import { GoogleGenAI } from "@google/genai";
import { UserData, Question } from "../models/types";
import { CellType, AdventureTileType } from "../models/types";

// Import Fallback Data
import { getRandomMazeMap } from "../data/fallbacks/mazeMaps";
import { getRandomAdventureMap } from "../data/fallbacks/adventureMaps";
import { getFallbackMazeQuestions } from "../data/fallbacks/mazeQuestions";
import { getFallbackAdventureQuestions } from "../data/fallbacks/adventureQuestions";
import { getFallbackPracticeQuestions } from "../data/fallbacks/practiceQuestions";
import { getRandomPretestQuestions } from "../data/fallbacks/pretestQuestions";

/**
 * --- SERVICE LAYER ---
 * Mengatur komunikasi dengan Google Gemini API
 * File ini berisi fungsi-fungsi untuk menghasilkan konten dinamis menggunakan AI,
 * seperti soal latihan, peta game, dan respons chatbot.
 */

// API KEYS (Menggunakan Environment Variable)
// Mendukung VITE_GEMINI_API_KEY untuk pengembangan lokal di luar AI Studio,
// dan process.env.GEMINI_API_KEY untuk kompatibilitas di dalam AI Studio.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is not defined in .env! AI features will not work.");
}

// Satu instance cukup — GoogleGenAI adalah stateless client
export const ai = new GoogleGenAI({ apiKey });

/**
 * SANITISASI JSON TINGKAT LANJUT (AI Integration Specialist Approach)
 * Fungsi ini menangani cacat umum pada output JSON dari LLM:
 * 1. Bad control character: Unescaped newlines/tabs di dalam string literal.
 * 2. Bad escaped character: Unescaped backslashes (kasus LaTeX \frac menjadi \\frac).
 */
export function parseAIResponse(text: string): any {
  if (!text) return {};
  
  // 1. Hapus markdown code block wrapper
  let cleaned = text.replace(/```(?:json)?|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (initialError) {
    // 2. Jika gagal, jalankan sanitasi bertahap.
    
    // Lapis 1: Escape unescaped control characters di dalam string literal (Bad control character error)
    // Regex ini mencocokkan struktur string JSON: " diikuti oleh karakter apa saja kecuali kutip tak terescape, lalu "
    cleaned = cleaned.replace(/"((?:[^"\\]|\\.)*)"/g, (match) => {
        return match
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
    });

    try {
        return JSON.parse(cleaned);
    } catch (secondError) {
        // Lapis 2: Tangani Bad escaped character (Khas masalah LaTeX)
        // Jika AI merender \sqrt, parser crash karena \s bukan escape valid di JSON.
        // Solusi: Escape setiap backslash tunggal yang diikuti oleh huruf alfabet (mengubah \frac -> \\frac)
        // Negative lookbehind (?<!\\) memastikan backslash yang sudah ganda tidak ikut terganda lagi.
        cleaned = cleaned.replace(/(?<!\\)\\([a-zA-Z])/g, '\\\\$1');

        try {
            return JSON.parse(cleaned);
        } catch (finalError) {
            console.error("ParseAIResponse: Final parsing failed", finalError);
            console.error("Raw text:", text);
            console.error("Sanitized text:", cleaned);
            throw new SyntaxError("AI JSON Output could not be sanitized: " + (finalError as Error).message);
        }
    }
  }
}


// Model
export const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-lite';

// ============================================================================
// SEC-03: RATE LIMITER — Mencegah abuse API Gemini
// Membatasi panggilan maksimal 20x per menit per sesi browser.
// ============================================================================
const rateLimiter = {
  callTimestamps: [] as number[],
  MAX_CALLS: 20,
  WINDOW_MS: 60 * 1000, // 1 menit
  check(): boolean {
    const now = Date.now();
    this.callTimestamps = this.callTimestamps.filter(t => now - t < this.WINDOW_MS);
    if (this.callTimestamps.length >= this.MAX_CALLS) return false;
    this.callTimestamps.push(now);
    return true;
  },
  remainingCalls(): number {
    const now = Date.now();
    const active = this.callTimestamps.filter(t => now - t < this.WINDOW_MS);
    return Math.max(0, this.MAX_CALLS - active.length);
  }
};

/**
 * GENERATE QUESTION DRAFT (TEACHER)
 * Menghasilkan draf soal untuk guru menggunakan AI.
 * Mendukung format LaTeX.
 */
export const draftQuestionWithAI = async (topic: string, difficulty: string, context: string): Promise<Partial<Question>> => {
  // SEC-03: Rate limit check
  if (!rateLimiter.check()) {
    throw new Error(`Terlalu banyak permintaan AI. Tunggu sebentar. (Sisa: ${rateLimiter.remainingCalls()} dari 20/menit)`);
  }
  try {
    const prompt = `
      Bertindaklah sebagai Expert Mathematics Content Creator untuk aplikasi 'Logi'. Tugas Anda adalah men-generate soal latihan matematika berdasarkan topik dan konteks yang diberikan pengguna dengan output WAJIB berupa JSON murni yang valid secara sintaksis.
      
      Topik: "${topic}"
      Tingkat Kesulitan: "${difficulty}"
      Konteks materi: ${context}
      
      Mengingat soal ini melibatkan rumus LaTeX, Anda harus melakukan double-escaping pada setiap karakter backslash (\\\\) di dalam rumus matematika sehingga setiap simbol diawali dengan dua backslash (contoh: tulis \\\\\\\\frac{a}{b} dan bukannya \\\\frac{a}{b}, atau \\\\\\\\times dan bukannya \\\\times) agar output tersebut dapat diproses oleh fungsi JSON.parse() di sisi klien tanpa menyebabkan 'SyntaxError: Bad escaped character'. 
      
      Aturan Penting:
      1. Integrasikan ke-4 pilar Computational Thinking secara halus ke dalam alur pemecahan masalah soal cerita. DILARANG KERAS mencetak/menyebutkan kata-kata "Decomposition", "Pattern Recognition", "Abstraction", "Algorithm" (atau terjemahannya) di dalam teks soal maupun penjelasan.
      2. Bahasa yang digunakan harus luwes, naratif, dan komunikatif agar enak dibaca dan mudah dipahami oleh siswa SMP.
      3. Penulisan Matematika yang Rapi: Gunakan LaTeX untuk rumus dan persamaan. Untuk satuan (seperti cm, m), tulis sebagai teks biasa di luar blok LaTeX (contoh: $L = 30$ cm, BUKAN $L = 30 \text{cm}$).
      4. Pada bagian "explanation", jabarkan perhitungan langkah demi langkah dengan rapi. Jika perhitungannya panjang, gunakan block equation ( $$...$$ ). Jangan menyisipkan baris baru (\\\\) sembarangan di luar blok LaTeX.
      5. Berikan 4 pilihan jawaban yang khas, salah satunya benar. Pilihan salah harus mengecoh (melambangkan kesalahan bernalar spesifik).
      6. Berikan "optionFeedback", yaitu feedback singkat (1-2 kalimat) untuk MASING-MASING opsi jawaban. Jelaskan di titik mana siswa mungkin keliru sehingga memilih opsi tersebut, dan beri semangat jika benar.
      
      Kembalikan HANYA dalam format JSON valid dan persis mengikuti struktur berikut (tanpa markdown block sama sekali):
      {
        "question": "Teks soal cerita yang komunikatif dengan pilar CT tersirat (tanpa menyebut nama pilarnya) dan $rumus LaTeX$",
        "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
        "correctAnswer": "Opsi yang benar persis seperti di array",
        "explanation": "Penjelasan langkah-demi-langkah yang rapi dan terstruktur dengan block $$rumus LaTeX$$",
        "optionFeedback": {
            "Opsi A": "Feedback singkat jika anak memilih ini",
            "Opsi B": "Feedback singkat",
            "Opsi C": "Feedback singkat",
            "Opsi D": "Feedback singkat"
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    const parsed = parseAIResponse(text);
    
    return {
      type: "multiple-choice",
      question: parsed.question || "",
      options: parsed.options || [],
      correctAnswer: parsed.correctAnswer || "",
      explanation: parsed.explanation || "",
      optionFeedback: parsed.optionFeedback || {}
    };
  } catch (error) {
    console.error("Failed to draft question with AI:", error);
    throw new Error("Gagal membuat draf soal dengan AI.");
  }
};

/**
 * HELPER: Safe Generator (Adapted for @google/genai)
 * Menjalankan request ke Gemini API dengan timeout dan penanganan error.
 * Jika gagal atau timeout, akan mengembalikan data fallback.
 * 
 * @param {GoogleGenAI} client - Instance client Gemini API.
 * @param {string} prompt - Teks prompt untuk dikirim ke model.
 * @param {any} fallbackData - Data cadangan jika request gagal.
 * @param {boolean} [isJson=true] - Apakah mengharapkan respons dalam format JSON.
 * @returns {Promise<any>} Hasil dari AI atau data fallback.
 */
async function safeGenerateContent(client: GoogleGenAI, prompt: string, fallbackData: unknown, isJson = true) {
  // SEC-03: Rate limit check — jika limit terlampaui, langsung return fallback tanpa throw
  if (!rateLimiter.check()) {
    console.warn('AI Rate limit reached — menggunakan fallback data.');
    return fallbackData;
  }
  try {
    const apiCall = client.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: isJson ? { responseMimeType: "application/json" } : undefined
    });

    // Add a dummy catch to apiCall to prevent unhandled rejections if it resolves/rejects after timeout
    apiCall.catch(() => {});

    const timeoutPromise = new Promise((_, reject) => {
        const id = setTimeout(() => reject(new Error("Request timed out")), 15000); // 15s Timeout
        // Ensure the timeout ID is cleared if apiCall resolves first (we can't easily do it here without wrapping, but it's ok, the timeout will just dummy reject later)
    });

    // Also add a dummy catch to timeoutPromise to prevent unhandled rejection if apiCall finishes first
    timeoutPromise.catch(() => {});

    const response: unknown = await Promise.race([apiCall, timeoutPromise]);
    let text = (response as any).text;
    
    if (isJson) {
        if (!text) throw new Error("Empty response");
        return parseAIResponse(text);
    }
    return text.replace(/```(?:json)?|```/g, '').trim();
  } catch (error) {
    console.warn(`AI Generation Failed (${MODEL_NAME}). Using Smart Fallback. Reason:`, error);
    // Return Fallback jika AI gagal/timeout
    return fallbackData; 
  }
}

/**
 * Menghasilkan instruksi konteks kelas untuk prompt AI.
 * @param {string} grade - Kelas siswa (misal: "8").
 * @returns {string} String instruksi konteks kelas.
 */
const getGradeInstruction = (grade: string) => {
  return `KONTEKS: Siswa Kelas ${grade} SMP (Standar Kompetisi/Olimpiade & Computational Thinking).`;
};

/**
 * Menghasilkan instruksi tingkat kesulitan berdasarkan level pengguna.
 * @param {number} level - Level pengguna saat ini.
 * @returns {string} String instruksi tingkat kesulitan.
 */
const getDifficultyInstruction = (level: number) => {
  if (level <= 5) {
    return "TINGKAT KESULITAN: MENENGAH (LOGIKA DASAR).";
  } else if (level <= 15) {
    return "TINGKAT KESULITAN: SULIT (ALGORITMIK). Soal cerita yang memerlukan 'Decomposition'.";
  } else {
    return "TINGKAT KESULITAN: EXPERT (COMPUTATIONAL THINKING).";
  }
};

/**
 * GENERATOR 1: SOAL MAZE
 * Menghasilkan soal-soal matematika logika untuk game Maze menggunakan AI.
 * 
 * @param {string} grade - Kelas siswa.
 * @param {string[]} topics - Daftar topik yang sudah dipelajari.
 * @param {number} level - Level pengguna.
 * @returns {Promise<{q: string, opts: string[], ans: number}[]>} Array soal pilihan ganda.
 */
export const generateMazeQuestionsAI = async (grade: string, topics: string[], level: number): Promise<{q: string, opts: string[], ans: number}[]> => {
  // Use Smart Fallback filtered by topics
  const fallback = getFallbackMazeQuestions(topics, 10);

  const topicsList = topics.join(', ');
  const gradeInst = getGradeInstruction(grade);
  const diffInst = getDifficultyInstruction(level);
  
  const prompt = `
    Buatkan 10 soal matematika SINGKAT TAPI MEMBUTUHKAN LOGIKA (Computational Thinking) untuk game labirin.
    ${gradeInst} ${diffInst}
    Topik: [${topicsList}].
    Syarat: Maksimal 8 kata. Output JSON Array: [{ "q": "...", "opts": ["..."], "ans": 0 }]
  `;

  return safeGenerateContent(ai, prompt, fallback);
};

/**
 * GENERATOR 2: MAP MAZE
 * Menghasilkan layout peta 2D untuk game Maze menggunakan AI.
 * 
 * @returns {Promise<CellType[][]>} Array 2D yang merepresentasikan peta labirin.
 */
export const generateMazeMapAI = async (): Promise<CellType[][]> => {
  // Use Smart Fallback Map
  const fallback = getRandomMazeMap();

  const prompt = `
    Generate 2D Maze 21x35 matrix. 0=path, 1=wall, 2=door, 3=finish, 4=start.
    Rules: Start at (1,1). Finish at (19,33). At least 8 doors (value 2).
    Output valid JSON array of arrays only.
  `;
  
  // Note: We create a simpler safeGenerate wrapper here because maps are complex arrays
  try {
     const result = await ai.models.generateContent({
         model: MODEL_NAME,
         contents: prompt,
         config: { responseMimeType: "application/json" }
     });
     const text = result.text?.replace(/```json|```/g, '').trim() || "[]";
     const map = JSON.parse(text);
     if (!Array.isArray(map) || map.length < 5) throw new Error("Invalid map");
     return map;
  } catch (e) {
     console.warn("Maze Map AI Failed, using fallback.");
     return fallback;
  }
};

/**
 * GENERATOR 3: SOAL ADVENTURE
 * Menghasilkan soal-soal matematika kontekstual (HOTS) untuk game Adventure menggunakan AI.
 * 
 * @param {string} grade - Kelas siswa.
 * @param {string[]} topics - Daftar topik yang sudah dipelajari.
 * @param {number} level - Level pengguna.
 * @returns {Promise<{q: string, opts: string[], ans: string}[]>} Array soal cerita pilihan ganda.
 */
export const generateAdventureQuestionsAI = async (grade: string, topics: string[], level: number): Promise<{q: string, opts: string[], ans: string}[]> => {
  const fallback = getFallbackAdventureQuestions(topics, 5);

  const topicsList = topics.join(', ');
  const gradeInst = getGradeInstruction(grade);
  const diffInst = getDifficultyInstruction(level);

  const prompt = `
    Buatkan 5 soal matematika KONTEKSTUAL (Soal Cerita) HOTS.
    ${gradeInst} ${diffInst}
    Materi: [${topicsList}].
    Output JSON Array: [{ "q": "...", "opts": ["..."], "ans": "string_jawaban_benar" }]
  `;

  return safeGenerateContent(ai, prompt, fallback);
};

/**
 * GENERATOR 4: MAP ADVENTURE
 * Menghasilkan layout peta ASCII untuk game Adventure menggunakan AI.
 * 
 * @returns {Promise<string[]>} Array string yang merepresentasikan peta petualangan.
 */
export const generateAdventureMapAI = async (): Promise<string[]> => {
  const fallback = getRandomAdventureMap();

  const prompt = `
    Generate ASCII map 40 rows x 60 cols. '#' is wall, '.' is floor.
    Create a school layout with rooms and corridors.
    Output JSON Array of strings.
  `;

  try {
     const result = await ai.models.generateContent({
         model: MODEL_NAME,
         contents: prompt,
         config: { responseMimeType: "application/json" }
     });
     const text = result.text?.replace(/```json|```/g, '').trim() || "[]";
     const map = JSON.parse(text);
     if (!Array.isArray(map) || map.length < 10) throw new Error("Invalid map");
     return map;
  } catch (e) {
     console.warn("Adventure Map AI Failed, using fallback.");
     return fallback;
  }
};

/**
 * GENERATOR 5: PRACTICE QUESTIONS
 * Menghasilkan soal latihan pilihan ganda tipe HOTS menggunakan AI.
 * 
 * @param {string[]} topics - Daftar topik materi.
 * @param {string} grade - Kelas siswa.
 * @param {number} level - Level pengguna.
 * @returns {Promise<Question[]>} Array soal latihan.
 */
export const generatePracticeQuestions = async (topics: string[], grade: string, level: number): Promise<Question[]> => {
    const fallback = getFallbackPracticeQuestions(topics, 5);

    const topicsList = topics.join(', ');
    const gradeInst = getGradeInstruction(grade);
    
    const prompt = `
      Buatkan 5 soal matematika PILIHAN GANDA TIPE HOTS.
      ${gradeInst}
      TOPIK: [${topicsList}].
      Output JSON Array: [{"id": "...", "type": "multiple-choice", "question": "...", "options": ["...",...], "correctAnswer": "...", "explanation": "..."}]
    `;

    return safeGenerateContent(ai, prompt, fallback);
};

/**
 * GENERATOR 7: PRETEST (ASESMEN AWAL)
 * Menghasilkan soal pretest untuk asesmen awal kemampuan siswa menggunakan AI.
 * 
 * @param {string} grade - Kelas siswa.
 * @returns {Promise<(Question & { difficulty: string })[]>} Array soal pretest dengan tingkat kesulitan.
 */
export const generatePretestQuestions = async (grade: string): Promise<(Question & { difficulty: string })[]> => {
    // Fallback khusus pretest (random 10 questions)
    const fallback = getRandomPretestQuestions(10);

    const gradeInst = getGradeInstruction(grade);
    
    const prompt = `
      Buatkan 10 soal Pretest Matematika SMP untuk Asesmen Awal.
      Tingkat Kesulitan: Campuran (3 Mudah, 4 Sedang, 3 Sulit/HOTS).
      ${gradeInst}
      TOPIK: Geometri Bangun Datar, Bangun Ruang, Bilangan, Aljabar Dasar.
      
      Output JSON Array: [{
        "id": "pt-ai-...", 
        "difficulty": "easy" | "medium" | "hard",
        "type": "multiple-choice", 
        "question": "...", 
        "options": ["..."], 
        "correctAnswer": "...", 
        "explanation": "..."
      }]
    `;

    return safeGenerateContent(ai, prompt, fallback);
};

/**
 * Menghasilkan instruksi sistem (system prompt) untuk chatbot Logi.
 * 
 * @param {UserData} user - Data pengguna saat ini.
 * @returns {string} String instruksi sistem untuk AI.
 */
export const getSystemInstruction = (user: UserData) => {
  const grade = user.grade || '8';
  const name = user.username || 'Sobat';
  return `Kamu adalah Logi, Asisten Tutor Matematika interaktif khusus untuk materi "Bangun Ruang" (3D shapes / Geometry) untuk ${name} kelas ${grade}. 
Sangat Penting: Kamu HANYA BOLEH menjawab dan membahas pertanyaan yang berkaitan dengan Bangun Ruang (contoh: kubus, balok, prisma, limas, tabung, kerucut, bola, volume, luas permukaan). 
Jika user bertanya tentang topik di luar materi Bangun Ruang (misalnya bangun datar, aljabar, bahasa, sejarah, atau lainnya), KAMU HARUS menolak untuk menjawabnya dengan sopan, contoh: "Maaf ya, saat ini Logi hanya fokus membahas materi Bangun Ruang. Ada pertanyaan seputar volume atau luas permukaan bangun ruang yang ingin kamu diskusikan?". Jangan berikan jawaban untuk di luar topik. 
Gunakan LaTeX untuk rumus (gunakan $ untuk inline dan $$ untuk block). Jawablah dengan bahasa Indonesia yang singkat, ramah, dan seru.`;
};