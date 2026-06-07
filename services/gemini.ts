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

// ============================================================================
// MULTI-KEY & MULTI-MODEL ROTATOR
// ============================================================================
// Strategi:
//   1. Coba model termurah/tercepat dulu (gemini-2.5-flash-lite)
//   2. Jika gagal (rate limit / timeout / error), naik ke model berikutnya
//   3. Jika semua model pada satu API key gagal, pindah ke API key cadangan
//   4. Jika semua API key habis, kembalikan data fallback
// ============================================================================

const API_KEYS: string[] = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_BACKUP_API_KEY
].filter((k): k is string => !!k);

const MODELS: string[] = [
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b'
];

const RATE_LIMIT = { MAX_CALLS: 20, WINDOW_MS: 60_000 };

interface RotatorState {
  client: GoogleGenAI;
  apiKey: string;
  modelIndex: number;
  exhausted: boolean;
  callTimestamps: number[];
}

const keyStates: RotatorState[] = API_KEYS.map(key => ({
  client: new GoogleGenAI({ apiKey: key }),
  apiKey: key,
  modelIndex: 0,
  exhausted: false,
  callTimestamps: []
}));

let currentRotatorKeyIndex = 0;

function updateCurrentKeyIndex(): boolean {
  const totalKeys = keyStates.length;
  for (let i = 0; i < totalKeys; i++) {
    const idx = (currentRotatorKeyIndex + i) % totalKeys;
    if (!keyStates[idx].exhausted) {
      currentRotatorKeyIndex = idx;
      return true;
    }
  }
  return false;
}

function checkKeyRateLimit(state: RotatorState): boolean {
  const now = Date.now();
  state.callTimestamps = state.callTimestamps.filter(t => now - t < RATE_LIMIT.WINDOW_MS);
  if (state.callTimestamps.length >= RATE_LIMIT.MAX_CALLS) return false;
  return true;
}

/**
 * Mencoba request ke AI dengan rotasi multi-key & multi-model.
 * Mengembalikan { text } jika berhasil, null jika semua gagal.
 */
async function tryGenerateContent(prompt: string, isJson: boolean): Promise<{ text: string } | null> {
  for (let attempts = 0; attempts < keyStates.length * MODELS.length; attempts++) {
    if (!updateCurrentKeyIndex()) return null;

    const state = keyStates[currentRotatorKeyIndex];
    const modelName = MODELS[state.modelIndex];

    if (state.exhausted) {
      currentRotatorKeyIndex = (currentRotatorKeyIndex + 1) % keyStates.length;
      continue;
    }

    if (!checkKeyRateLimit(state)) {
      console.warn(`[AI Rotator] Key ${currentRotatorKeyIndex} rate limited. Coba berikutnya.`);
      state.modelIndex = 0;
      state.exhausted = true;
      currentRotatorKeyIndex = (currentRotatorKeyIndex + 1) % keyStates.length;
      continue;
    }

    try {
      const apiCall = state.client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: isJson ? { responseMimeType: "application/json" } : undefined
      });

      apiCall.catch(() => {});

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 15000);
      });
      timeoutPromise.catch(() => {});

      const response: unknown = await Promise.race([apiCall, timeoutPromise]);
      const text = (response as any).text;

      if (!text || (typeof text === 'string' && text.trim().length === 0)) {
        throw new Error("Empty response");
      }

      state.callTimestamps.push(Date.now());
      return { text };

    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.warn(`[AI Rotator] Key ${currentRotatorKeyIndex} Model ${modelName} gagal: ${errMsg}`);

      // Coba model berikutnya pada key yang sama
      if (state.modelIndex < MODELS.length - 1) {
        state.modelIndex++;
      } else {
        // Semua model pada key ini habis, tandai exhausted
        state.modelIndex = 0;
        state.exhausted = true;
        currentRotatorKeyIndex = (currentRotatorKeyIndex + 1) % keyStates.length;
      }
    }
  }

  return null;
}

/**
 * Mendapatkan client dan model terbaik yang tersedia saat ini.
 * Untuk digunakan oleh chat session (useChat).
 */
export function getBestAvailableClient(): { client: GoogleGenAI; model: string } | null {
  updateCurrentKeyIndex();
  const state = keyStates[currentRotatorKeyIndex];
  if (state.exhausted) return null;
  return { client: state.client, model: MODELS[state.modelIndex] };
}

// ============================================================================
// EXPOSED: Nama model terbaik saat ini (buat kompatibilitas)
// ============================================================================
export function getCurrentModelName(): string {
  if (!updateCurrentKeyIndex()) return MODELS[0];
  return MODELS[keyStates[currentRotatorKeyIndex].modelIndex];
}

// ============================================================================
// SANITISASI JSON
// ============================================================================
export function parseAIResponse(text: string): any {
  if (!text) return {};
  
  let cleaned = text.replace(/```(?:json)?|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (initialError) {
    cleaned = cleaned.replace(/"((?:[^"\\]|\\.)*)"/g, (match) => {
        return match
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
    });

    try {
        return JSON.parse(cleaned);
    } catch (secondError) {
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

// ============================================================================
// DRAFT QUESTION (TEACHER)
// ============================================================================
export const draftQuestionWithAI = async (topic: string, difficulty: string, context: string): Promise<Partial<Question>> => {
  const prompt = `
    Bertindaklah sebagai Expert Mathematics Content Creator untuk aplikasi 'Logi'. Tugas Anda adalah men-generate soal latihan matematika berdasarkan topik dan konteks yang diberikan pengguna dengan output WAJIB berupa JSON murni yang valid secara sintaksis.
    
    Topik: "${topic}"
    Tingkat Kesulitan: "${difficulty}"
    Konteks materi: ${context}
    
    Mengingat soal ini melibatkan rumus LaTeX, Anda harus melakukan double-escaping pada setiap karakter backslash (\\\\) di dalam rumus matematika sehingga setiap simbol diawali dengan dua backslash (contoh: tulis \\\\\\\\frac{a}{b} dan bukannya \\\\frac{a}{b}, atau \\\\\\\\times dan bukannya \\\\times) agar output tersebut dapat diproses oleh fungsi JSON.parse() di sisi klien tanpa menyebabkan 'SyntaxError: Bad escaped character'. 
    
    Aturan Penting:
    1. Integrasikan ke-4 pilar Computational Thinking secara halus ke dalam alur pemecahan masalah soal cerita. DILARANG KERAS mencetak/menyebutkan kata-kata "Decomposition", "Pattern Recognition", "Abstraction", "Algorithm" (atau terjemahannya) di dalam teks soal maupun penjelasan.
    2. Bahasa yang digunakan harus luwes, naratif, dan komunikatif agar enak dibaca dan mudah dipahami oleh siswa SMP.
    3. Penulisan Matematika yang Rapi: Gunakan LaTeX untuk rumus dan persamaan. Untuk satuan (seperti cm, m), tulis sebagai teks biasa di luar blok LaTeX (contoh: $L = 30$ cm, BUKAN $L = 30 \\text{cm}$).
    4. Pada bagian "explanation", jabarkan perhitungan langkah demi langkah dengan rapi. Jika perhitungannya panjang, gunakan block equation ( $$...$$ ). Jangan menyisipkan baris baru (\\\\) sembarangan di luar blok LaTeX.
    5. Berikan 4 pilihan jawaban yang khas, salah satunya benar. Pilihan salah harus mengecoh (melambangkan kesalahan bernalar spesifik).
    6. Berikan "optionFeedback", yaitu feedback singkat (1-2 kalimat) untuk MASING-MASING opsi jawaban. Jelaskan di titik mana siswa mungkin keliru sehingga memilih opsi tersebut, dan beri semangat jika benar.

    Di bawah ini adalah 2 contoh soal yang sudah jadi sebagai acuan gaya penulisan (few-shot prompting). Perhatikan bagaimana soal cerita dikemas secara naratif, bagaimana CT diintegrasikan secara implisit, dan bagaimana feedback diberikan untuk setiap opsi:

    === CONTOH 1 (Prisma Segitiga) ===
    {
      "question": "Bu Ratih membuat sebuah kolam renang berbentuk prisma segitiga untuk perumahan elit. Alas segitiga kolam memiliki panjang 8 meter dan tinggi 5 meter. Kedalaman kolam yang seragam adalah 12 meter. Bu Ratih ingin menghitung volume air yang dibutuhkan untuk mengisi penuh kolam tersebut. Bagaimana cara menghitung volume air yang diperlukan?",
      "options": [
        "Volume = (\\\\(\\\\frac{1}{2}\\\\) \\\\times 8 \\\\times 5) \\\\times 12",
        "Volume = (8 \\\\times 5) \\\\times 12",
        "Volume = (8 + 5) \\\\times 12",
        "Volume = \\\\(\\\\frac{1}{2}\\\\) \\\\times 8 \\\\times 5 \\\\times 12 \\\\times 2"
      ],
      "correctAnswer": "Volume = (\\\\(\\\\frac{1}{2}\\\\) \\\\times 8 \\\\times 5) \\\\times 12",
      "explanation": "Kolam renang berbentuk prisma segitiga, maka volumenya adalah luas alas segitiga dikali tinggi prisma (kedalaman). $$V = \\\\(\\\\frac{1}{2}\\\\) \\\\times a \\\\times t_{\\\\text{segitiga}} \\\\times t_{\\\\text{prisma}} = \\\\(\\\\frac{1}{2}\\\\) \\\\times 8 \\\\times 5 \\\\times 12 = 240\\\\text{ m}^3$$",
      "optionFeedback": {
        "Volume = (\\\\(\\\\frac{1}{2}\\\\) \\\\times 8 \\\\times 5) \\\\times 12": "Benar! Kamu memahami bahwa volume prisma adalah luas alas dikali tinggi. Hebat!",
        "Volume = (8 \\\\times 5) \\\\times 12": "Hampir saja! Rumus luas segitiga adalah \\\\(\\\\frac{1}{2}\\\\) \\\\times alas \\\\times tinggi. Kamu lupa membagi dua. Coba periksa lagi langkahmu.",
        "Volume = (8 + 5) \\\\times 12": "Perhatikan bahwa menghitung volume tidak menggunakan penjumlahan panjang dan tinggi, melainkan perkalian. Ingat rumus luas segitiga dulu ya.",
        "Volume = \\\\(\\\\frac{1}{2}\\\\) \\\\times 8 \\\\times 5 \\\\times 12 \\\\times 2": "Kamu mengalikan dengan 2 di akhir, padahal tidak perlu. Volume prisma cukup luas alas dikali tinggi. Tidak ada perkalian dua kali."
      }
    }

    === CONTOH 2 (Balok) ===
    {
      "question": "Andi memiliki sebuah akuarium berbentuk balok dengan panjang 80 cm, lebar 50 cm, dan tinggi 40 cm. Ia ingin mengisi akuarium tersebut dengan air hingga ketinggian 35 cm. Berapa volume air yang dibutuhkan Andi untuk mengisi akuariumnya?",
      "options": [
        "140.000 cm\\\\(^3\\\\)",
        "160.000 cm\\\\(^3\\\\)",
        "120.000 cm\\\\(^3\\\\)",
        "100.000 cm\\\\(^3\\\\)"
      ],
      "correctAnswer": "140.000 cm\\\\(^3\\\\)",
      "explanation": "Volume air dihitung dengan panjang \\\\times lebar \\\\times tinggi air (bukan tinggi akuarium). $$V = 80 \\\\times 50 \\\\times 35 = 140.000\\\\text{ cm}^3$$ Tinggi akuarium 40 cm tidak dipakai karena air hanya diisi setinggi 35 cm.",
      "optionFeedback": {
        "140.000 cm\\\\(^3\\\\)": "Benar! Kamu jeli menggunakan tinggi air (35 cm), bukan tinggi akuarium. Pertahankan!",
        "160.000 cm\\\\(^3\\\\)": "Kamu menggunakan tinggi akuarium (40 cm) bukan tinggi air (35 cm). Baca soal dengan teliti ya.",
        "120.000 cm\\\\(^3\\\\)": "Hasil ini mungkin dari perkalian yang kurang tepat. Coba hitung 80 \\\\times 50 \\\\times 35 langkah demi langkah.",
        "100.000 cm\\\\(^3\\\\)": "Kesalahan perhitungan. Pastikan kamu mengalikan panjang, lebar, dan tinggi air dengan benar: 80 \\\\times 50 = 4.000, lalu 4.000 \\\\times 35 = ?"
      }
    }

    Kembalikan HANYA dalam format JSON valid persis seperti dua contoh di atas (tanpa markdown block sama sekali), dengan struktur:
    {
      "question": "Soal cerita matematika bergaya naratif seperti contoh, dengan $rumus LaTeX$",
      "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "correctAnswer": "Opsi yang benar persis seperti di array",
      "explanation": "Penjelasan langkah-demi-langkah yang rapi dan terstruktur dengan block $$rumus LaTeX$$",
      "optionFeedback": {
          "Opsi A": "Feedback singkat dengan semangat jika benar, atau jelaskan kesalahan jika salah",
          "Opsi B": "Feedback singkat",
          "Opsi C": "Feedback singkat",
          "Opsi D": "Feedback singkat"
      }
    }
  `;

  const result = await tryGenerateContent(prompt, true);
  if (!result) {
    throw new Error("Semua API Key dan model AI gagal. Gunakan mode manual.");
  }

  const parsed = parseAIResponse(result.text);
  return {
    type: "multiple-choice",
    question: parsed.question || "",
    options: parsed.options || [],
    correctAnswer: parsed.correctAnswer || "",
    explanation: parsed.explanation || "",
    optionFeedback: parsed.optionFeedback || {}
  };
};

// ============================================================================
// SAFE GENERATOR — Rotasi multi-key & multi-model, dengan fallback
// ============================================================================
async function safeGenerateContent(prompt: string, fallbackData: unknown, isJson = true) {
  const result = await tryGenerateContent(prompt, isJson);
  if (!result) {
    console.warn('[AI Rotator] Semua key & model habis. Menggunakan fallback data.');
    return fallbackData;
  }

  if (isJson) {
    return parseAIResponse(result.text);
  }
  return result.text.replace(/```(?:json)?|```/g, '').trim();
}

// ============================================================================
// HELPERS
// ============================================================================
const getGradeInstruction = (grade: string) => {
  return `KONTEKS: Siswa Kelas ${grade} SMP (Standar Kompetisi/Olimpiade & Computational Thinking).`;
};

const getDifficultyInstruction = (level: number) => {
  if (level <= 5) {
    return "TINGKAT KESULITAN: MENENGAH (LOGIKA DASAR).";
  } else if (level <= 15) {
    return "TINGKAT KESULITAN: SULIT (ALGORITMIK). Soal cerita yang memerlukan 'Decomposition'.";
  } else {
    return "TINGKAT KESULITAN: EXPERT (COMPUTATIONAL THINKING).";
  }
};

// ============================================================================
// GENERATOR 1: SOAL MAZE
// ============================================================================
export const generateMazeQuestionsAI = async (grade: string, topics: string[], level: number): Promise<{q: string, opts: string[], ans: number}[]> => {
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

  return safeGenerateContent(prompt, fallback);
};

// ============================================================================
// GENERATOR 2: MAP MAZE
// ============================================================================
export const generateMazeMapAI = async (): Promise<CellType[][]> => {
  const fallback = getRandomMazeMap();

  const prompt = `
    Generate 2D Maze 21x35 matrix. 0=path, 1=wall, 2=door, 3=finish, 4=start.
    Rules: Start at (1,1). Finish at (19,33). At least 8 doors (value 2).
    Output valid JSON array of arrays only.
  `;
  
  const result = await tryGenerateContent(prompt, true);
  if (!result) {
    console.warn("Maze Map AI gagal di semua key/model. Pakai fallback.");
    return fallback;
  }
  try {
    const map = JSON.parse(result.text.replace(/```json|```/g, '').trim());
    if (!Array.isArray(map) || map.length < 5) throw new Error("Invalid map");
    return map;
  } catch {
    return fallback;
  }
};

// ============================================================================
// GENERATOR 3: SOAL ADVENTURE
// ============================================================================
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

  return safeGenerateContent(prompt, fallback);
};

// ============================================================================
// GENERATOR 4: MAP ADVENTURE
// ============================================================================
export const generateAdventureMapAI = async (): Promise<string[]> => {
  const fallback = getRandomAdventureMap();

  const prompt = `
    Generate ASCII map 40 rows x 60 cols. '#' is wall, '.' is floor.
    Create a school layout with rooms and corridors.
    Output JSON Array of strings.
  `;

  const result = await tryGenerateContent(prompt, true);
  if (!result) {
    console.warn("Adventure Map AI gagal di semua key/model. Pakai fallback.");
    return fallback;
  }
  try {
    const map = JSON.parse(result.text.replace(/```json|```/g, '').trim());
    if (!Array.isArray(map) || map.length < 10) throw new Error("Invalid map");
    return map;
  } catch {
    return fallback;
  }
};

// ============================================================================
// GENERATOR 5: PRACTICE QUESTIONS
// ============================================================================
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

    return safeGenerateContent(prompt, fallback);
};

// ============================================================================
// GENERATOR 7: PRETEST
// ============================================================================
export const generatePretestQuestions = async (grade: string): Promise<(Question & { difficulty: string })[]> => {
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

    return safeGenerateContent(prompt, fallback);
};

// ============================================================================
// NEW: CT INDICATOR ANALYSIS
// ============================================================================
export interface CTIndicators {
  decomposition: string;
  patternRecognition: string;
  abstraction: string;
  algorithmDesign: string;
}

export const analyzeCTIndicators = async (
  questionText: string,
  options: string[],
  correctAnswer: string,
  explanation: string
): Promise<CTIndicators> => {
  const prompt = `
    Bertindaklah sebagai Expert Pendidikan Matematika & Computational Thinking. Analisis soal berikut dan jelaskan bagaimana keempat pilar Computational Thinking (CT) termanifestasi dalam soal ini.

    Soal:
    ${questionText}

    Opsi Jawaban:
    ${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}

    Jawaban Benar: ${correctAnswer}

    Penjelasan Soal:
    ${explanation}

    Untuk SETIAP pilar CT di bawah ini, berikan penjelasan 2-3 kalimat yang spesifik merujuk pada soal di atas (BUKAN definisi umum). Gunakan bahasa Indonesia yang jelas dan naratif. JANGAN gunakan format bullet/numbering di dalam penjelasan masing-masing pilar.

    Kembalikan HANYA JSON valid dengan struktur:
    {
      "decomposition": "Penjelasan dekomposisi untuk soal ini...",
      "patternRecognition": "Penjelasan pengenalan pola untuk soal ini...",
      "abstraction": "Penjelasan abstraksi untuk soal ini...",
      "algorithmDesign": "Penjelasan algoritma untuk soal ini..."
    }
  `;

  const result = await tryGenerateContent(prompt, true);
  if (!result) {
    throw new Error("Gagal menganalisis indikator CT. Semua API key/model habis.");
  }

  const parsed = parseAIResponse(result.text);
  return {
    decomposition: parsed.decomposition || "Tidak dapat dianalisis",
    patternRecognition: parsed.patternRecognition || "Tidak dapat dianalisis",
    abstraction: parsed.abstraction || "Tidak dapat dianalisis",
    algorithmDesign: parsed.algorithmDesign || "Tidak dapat dianalisis"
  };
};

// ============================================================================
// NEW: QUESTION REVISION WITH AI
// ============================================================================
export const reviseQuestionWithAI = async (
  currentQuestion: string,
  currentOptions: string[],
  currentCorrectAnswer: string,
  currentExplanation: string,
  instruction: string
): Promise<Partial<Question>> => {
  const prompt = `
    Bertindaklah sebagai Expert Mathematics Content Creator untuk aplikasi 'Logi'. Tugas Anda adalah MEREVISI soal yang sudah ada berdasarkan instruksi pengguna.

    Soal Saat Ini:
    ${currentQuestion}

    Opsi Saat Ini:
    ${currentOptions.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}

    Jawaban Benar Saat Ini: ${currentCorrectAnswer}

    Penjelasan Saat Ini:
    ${currentExplanation}

    Instruksi Revisi Pengguna:
    "${instruction}"

    Aturan:
    1. Modifikasi soal, opsi, jawaban benar, dan penjelasan sesuai instruksi.
    2. JANGAN mengubah/menghasilkan "optionFeedback" (feedback per opsi) - biarkan seperti semula.
    3. Pastikan format LaTeX menggunakan double escaping (\\\\frac, \\\\times, dll) agar valid JSON.
    4. Integrasikan Computational Thinking secara implisit (jangan sebut nama pilar CT).
    5. Bahasa naratif, komunikatif untuk siswa SMP.

    Kembalikan HANYA JSON valid dengan struktur:
    {
      "question": "Soal yang sudah direvisi...",
      "options": ["Opsi A baru", "Opsi B baru", "Opsi C baru", "Opsi D baru"],
      "correctAnswer": "Jawaban benar baru persis seperti di array options",
      "explanation": "Penjelasan yang sudah direvisi..."
    }
  `;

  const result = await tryGenerateContent(prompt, true);
  if (!result) {
    throw new Error("Gagal merevisi soal. Semua API key/model habis.");
  }

  const parsed = parseAIResponse(result.text);
  return {
    type: "multiple-choice",
    question: parsed.question || currentQuestion,
    options: parsed.options || currentOptions,
    correctAnswer: parsed.correctAnswer || currentCorrectAnswer,
    explanation: parsed.explanation || currentExplanation
  };
};

export const getSystemInstruction = (user: UserData) => {
  const grade = user.grade || '8';
  const name = user.username || 'Sobat';
  return `Kamu adalah Logi, Asisten Tutor Matematika interaktif khusus untuk materi "Bangun Ruang" (3D shapes / Geometry) untuk ${name} kelas ${grade}. 
Sangat Penting: Kamu HANYA BOLEH menjawab dan membahas pertanyaan yang berkaitan dengan Bangun Ruang (contoh: kubus, balok, prisma, limas, tabung, kerucut, bola, volume, luas permukaan). 
Jika user bertanya tentang topik di luar materi Bangun Ruang (misalnya bangun datar, aljabar, bahasa, sejarah, atau lainnya), KAMU HARUS menolak untuk menjawabnya dengan sopan, contoh: "Maaf ya, saat ini Logi hanya fokus membahas materi Bangun Ruang. Ada pertanyaan seputar volume atau luas permukaan bangun ruang yang ingin kamu diskusikan?". Jangan berikan jawaban untuk di luar topik. 
Gunakan LaTeX untuk rumus (gunakan $ untuk inline dan $$ untuk block). Jawablah dengan bahasa Indonesia yang singkat, ramah, dan seru.`;
};
