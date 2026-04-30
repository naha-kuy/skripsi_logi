import { MaterialContent } from './index';

export const u2l2: MaterialContent = {
  id: 'u2l2',
  title: 'Volume Prisma',
  intro: 'Temukan rumus umum volume prisma dari berbagai bentuk alas secara mandiri.',
  objectives: [
    'Siswa dapat memahami konsep prisma sebagai bangun ruang dengan alas dan tutup yang kongruen.',
    'Siswa dapat menemukan rumus umum volume prisma.',
    'Siswa dapat menghitung volume prisma dengan berbagai bentuk alas.'
  ],
  sections: [
    {
      id: 'intro',
      type: 'text',
      htmlContent: `
        <p><strong>Prisma</strong> adalah bangun ruang yang memiliki alas dan tutup yang sama persis (kongruen) serta sejajar.</p>
        <p>Tahukah Anda? Balok sebenarnya juga merupakan bagian dari keluarga prisma dengan alas berbentuk persegi panjang.</p>
        <p>Sekarang, mari amati <strong>Prisma Segitiga</strong> berikut.</p>
      `
    },
    {
      id: 'prisma-1',
      type: '3d-demo',
      modelType: 'volume',
      modelConfig: {
        shape: 'prisma',
        mode: 'fixed',
        segments: 3,
        t: 4
      },
      hideWhenVisible: 'prisma-2'
    },
    {
      id: 'inquiry-1-sisi',
      type: 'inquiry-input',
      question: 'Perhatikan prisma pertama di atas. Berapa jumlah sisi pada bentuk alasnya?',
      placeholder: 'Ketik angka...',
      correctAnswer: 3,
      feedback: 'Mantap! Alasnya berbentuk segitiga, jadi memiliki 3 sisi.',
      hideWhenVisible: 'prisma-2'
    },
    {
      id: 'inquiry-1-vol',
      type: 'inquiry-input',
      question: 'Bayangkan alas segitiga tersebut memiliki luas 6 satuan persegi. Jika tinggi prisma adalah 4 satuan, berapa total volume (banyak kubus satuan) yang bisa mengisi prisma ini?',
      placeholder: 'Ketik angka...',
      correctAnswer: 24,
      feedback: 'Luar biasa! 6 (luas alas) dikali 4 (tinggi) sama dengan 24.',
      hideWhenVisible: 'prisma-2'
    },
    {
      id: 'prisma-2-intro',
      type: 'text',
      htmlContent: `
        <p>Bagus sekali! Sekarang mari kita lihat prisma kedua dengan bentuk alas yang berbeda.</p>
      `
    },
    {
      id: 'prisma-2',
      type: '3d-demo',
      modelType: 'volume',
      modelConfig: {
        shape: 'prisma',
        mode: 'fixed',
        segments: 5,
        t: 5
      }
    },
    {
      id: 'inquiry-2-sisi',
      type: 'inquiry-input',
      question: 'Perhatikan prisma kedua ini. Berapa jumlah sisi pada bentuk alasnya?',
      placeholder: 'Ketik angka...',
      correctAnswer: 5,
      feedback: 'Mantap! Alasnya berbentuk segilima, jadi memiliki 5 sisi.'
    },
    {
      id: 'inquiry-2-vol',
      type: 'inquiry-input',
      question: 'Jika luas alas segilima tersebut adalah 10 satuan persegi, dan tinggi prisma adalah 5 satuan, berapa total volumenya?',
      placeholder: 'Masukkan angka...',
      correctAnswer: 50,
      feedback: 'Luar biasa! 10 (luas alas) dikali 5 (tinggi) sama dengan 50.'
    },
    {
      id: 'lab-mandiri',
      type: 'text',
      htmlContent: `
        <p>Sekarang giliranmu! Cobalah membuat prismamu sendiri di <strong>Lab Mandiri</strong> di bawah ini.</p>
        <p>Tentukan jumlah sisi alas dan tinggi (t), lalu klik <strong>TAMPILKAN PRISMA</strong>.</p>
      `
    },
    {
      id: 'lab-demo',
      type: '3d-demo',
      modelType: 'volume',
      modelConfig: {
        shape: 'prisma',
        mode: 'lab',
        segments: 6,
        t: 4
      }
    },
    {
      id: 'prisma-playground',
      type: 'logic-playground',
      question: 'Susunlah rumus umum Volume Prisma!',
      playgroundConfig: {
        availableBlocks: ['Volume Prisma', '=', 'Luas Alas', 'Tinggi', '×', '+'],
        correctAnswers: [
          ['Volume Prisma', '=', 'Luas Alas', '×', 'Tinggi'],
          ['Volume Prisma', '=', 'Tinggi', '×', 'Luas Alas']
        ]
      },
      feedback: 'Hebat! Kamu telah menyusun rumus umum Volume Prisma. Rumus ini (Luas Alas × Tinggi) berlaku untuk semua jenis prisma, apa pun bentuk alasnya.'
    },
    {
      id: 'formula-general',
      type: 'text',
      htmlContent: `
        <h3>Kesimpulan: Rumus Umum Volume Prisma</h3>
        <p>Karena bentuk alasnya konsisten dari bawah sampai atas, kita bisa membayangkan volume prisma sebagai tumpukan alas setinggi $t$.</p>
        <p>Jadi, rumus umumnya sangat sederhana:</p>
        <div class="bg-green-50 p-4 rounded-xl border-l-4 border-green-500 my-4">
            <p class="text-xl font-bold text-center">$$V = \\text{Luas Alas} \\times \\text{Tinggi}$$</p>
        </div>
        <p>Rumus ini berlaku untuk <strong>SEMUA</strong> jenis prisma (segitiga, segiempat, segilima, dst).</p>
        <p><strong>Contoh Prisma Segitiga:</strong></p>
        <p>Alasnya berbentuk segitiga, maka Luas Alas = $\\frac{1}{2} \\times a \\times t_{alas}$.</p>
        <p>Volume = $(\\frac{1}{2} \\times a \\times t_{alas}) \\times t_{prisma}$.</p>
      `
    }
  ],
  practiceQuestions: [
    {
      id: 'q-u2l2-1',
      type: 'multiple-choice',
      question: '[PLACEHOLDER] Latihan Soal Volume Prisma. Soal ini akan dikembangkan lebih lanjut.',
      options: ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'],
      correctAnswer: 'Opsi A',
      explanation: 'Ini adalah penjelasan placeholder.',
      feedbackCorrect: 'Jawaban Anda benar! (Feedback placeholder)',
      feedbackIncorrect: 'Jawaban Anda salah. Silakan coba lagi. (Feedback placeholder)'
    }
  ]
};
