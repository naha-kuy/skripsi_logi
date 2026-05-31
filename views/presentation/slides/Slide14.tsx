import React from 'react';
import { BookOpenCheck } from 'lucide-react';

export const Slide14 = () => (
  <div className="w-full max-w-5xl mx-auto">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-4 bg-feather/10 rounded-2xl text-feather shrink-0">
        <BookOpenCheck size={32} />
      </div>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display">Daftar Pustaka</h2>
    </div>
    
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-sm mt-4">
      <ul className="space-y-6 text-sm md:text-base text-slate-700 leading-relaxed max-h-[50vh] overflow-y-auto pr-4">
        <li className="pl-8 -indent-8">
          Branch, R. M. (2009). <em>Instructional Design: The ADDIE Approach</em>. Springer Science & Business Media.
        </li>
        <li className="pl-8 -indent-8">
          Hamari, J., Koivisto, J., & Sarsa, H. (2014). Does Gamification Work? — A Literature Review of Empirical Studies on Gamification. <em>Proceedings of the Annual Hawaii International Conference on System Sciences</em>, 3025–3034.
        </li>
        <li className="pl-8 -indent-8">
          Wing, J. M. (2006). Computational Thinking. <em>Communications of the ACM</em>, 49(3), 33-35.
        </li>
        <li className="pl-8 -indent-8">
          Grover, S., & Pea, R. (2013). Computational Thinking in K–12: A Review of the State of the Field. <em>Educational Researcher</em>, 42(1), 38-43.
        </li>
      </ul>
    </div>
  </div>
);