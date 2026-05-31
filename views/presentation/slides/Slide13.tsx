import React from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

export const Slide13 = () => (
  <div className="w-full max-w-5xl mx-auto">
    <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display text-center mb-8">
      Kesimpulan & Saran
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="border-2 border-slate-200 rounded-3xl p-8 bg-white shadow-sm flex flex-col gap-5">
        <h3 className="font-display font-black text-xl text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
          <CheckCircle className="text-feather" /> Kesimpulan Penelitian
        </h3>
        <ul className="space-y-4 text-sm md:text-base text-slate-700 leading-relaxed flex-1">
          <li>• Platform Logi terbukti <strong>Valid</strong> dengan skor kelayakan rata-rata validator ahli sebesar <strong>92,0%</strong>.</li>
          <li>• Platform Logi terbukti sangat <strong>Praktis</strong> dalam penggunaan pembelajaran kelas dengan persentase kepraktisan mencapai <strong>97,7%</strong>.</li>
          <li>• Platform Logi terbukti <strong>Efektif</strong> meningkatkan kecakapan CT siswa berdasarkan hasil N-Gain sebesar <strong>0,75</strong> (Tinggi).</li>
        </ul>
      </div>

      <div className="border-2 border-slate-200 rounded-3xl p-8 bg-white shadow-sm flex flex-col gap-5">
        <h3 className="font-display font-black text-xl text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
          <HelpCircle className="text-macaw" /> Saran & Tindak Lanjut
        </h3>
        <ul className="space-y-4 text-sm md:text-base text-slate-700 leading-relaxed flex-1">
          <li>• Melakukan ekspansi materi dan modul game ajar ke topik matematika lainnya seperti aljabar, statistik, atau kalkulus.</li>
          <li>• Menguji cobakan platform Logi secara lebih luas pada skala makro dengan sampel lintas sekolah untuk mengukur adaptabilitas.</li>
          <li>• Mengoptimasi sistem prompt AI (scaffolding) agar kian relevan bagi profil kecepatan belajar murid yang beragam.</li>
        </ul>
      </div>
    </div>
  </div>
);