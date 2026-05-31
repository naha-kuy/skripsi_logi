import React from 'react';
import { List } from 'lucide-react';

interface Props { setCurrentSlide: (s: number) => void; }
export const Slide2: React.FC<Props> = ({ setCurrentSlide }) => (
  <div className="w-full max-w-5xl mx-auto">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-4 bg-feather/10 rounded-2xl text-feather shrink-0">
        <List size={32} />
      </div>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display">Outline Presentasi</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
      {[
        { num: '01', title: 'Latar Belakang & Urgensi CT', desc: 'Permasalahan geometri ruang 3D & pilar berpikir komputasional.' },
        { num: '02', title: 'Platform Pembelajaran "Logi"', desc: 'Overview media, arsitektur PBL gamifikasi, dan modul asisten AI.' },
        { num: '03', title: 'Metodologi Penelitian ADDIE', desc: 'Langkah riset terstruktur dari Analisis, Desain, hingga Evaluasi.' },
        { num: '04', title: 'Hasil Validitas & Praktikalitas', desc: 'Skor penilaian ahli serta tingkat kepraktisan pengguna lapangan.' },
        { num: '05', title: 'Hasil Uji Efektivitas Kuis', desc: 'Perbandingan rata-rata pretest vs posttest serta skor N-Gain.' },
        { num: '06', title: 'Kesimpulan, Saran & Pustaka', desc: 'Temuan akhir riset, rekomendasi tindak lanjut, & referensi.' }
      ].map((item, index) => {
        const slideMap = [3, 6, 9, 10, 12, 13];
        return (
          <div 
            key={index} 
            onClick={() => setCurrentSlide(slideMap[index])}
            className="group card-duo cursor-pointer flex gap-4 items-start border-2 border-slate-200 rounded-2xl p-6 hover:border-feather hover:bg-feather/5 transition-all duration-200"
          >
            <span className="font-display font-black text-3xl text-slate-300 group-hover:text-feather transition-colors">{item.num}</span>
            <div>
              <h3 className="font-display font-black text-lg md:text-xl text-slate-800 group-hover:text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);