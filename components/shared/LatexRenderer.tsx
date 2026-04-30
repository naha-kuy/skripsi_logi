import React from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface LatexRendererProps {
  content: string;
  block?: boolean;
  className?: string;
}

/**
 * Komponen untuk merender teks yang mengandung LaTeX.
 * Mendukung format $...$ untuk inline math dan $$...$$ untuk block math.
 * Serta memproses teks LaTeX dasar seperti \textbf{}, \textit{}, \begin{itemize}, dll.
 * Versi ini telah diperkuat untuk menangani output AI yang tidak sempurna.
 */
export const LatexRenderer: React.FC<LatexRendererProps> = ({ content, block = false, className = '' }) => {
  
  const renderContent = (rawText: string): string => {
    if (!rawText) return '';
    let text = rawText;

    // --- TAHAP 0: Pre-normalisasi output AI yang tidak konsisten ---
    // Tangani double-backslash dari JSON (\\frac -> \frac) supaya KaTeX bisa baca
    // Ini HANYA dilakukan di luar blok $...$ karena di dalam $...$ sudah ditangani KaTeX
    // Kita tunda normalisasi ini sampai saat rendering math block

    // --- TAHAP 1: Ekstrak dan lindungi blok math agar tidak disentuh regex teks ---
    const mathBlocks: string[] = [];
    text = text.replace(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g, (match) => {
      mathBlocks.push(match);
      return `___MATH_BLOCK_${mathBlocks.length - 1}___`;
    });

    // --- TAHAP 2: Proses perintah teks LaTeX ---
    // \textbf{} -> <strong>
    text = text.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
    // \textit{} -> <em>
    text = text.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
    // \underline{} -> <u>
    text = text.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
    // Kutipan LaTeX: ``text'' -> "text"
    text = text.replace(/``(.*?)''/g, '"$1"');
    // \textcolor{color}{text} -> styled span (abaikan warna, jaga teks)
    text = text.replace(/\\textcolor\{[^}]+\}\{([^}]+)\}/g, '$1');
    
    // --- TAHAP 3: Proses list (itemize & enumerate) ---
    // Tangani \item yang diikuti konten hingga \item berikutnya atau \end
    text = text.replace(/\\item\s+([\s\S]*?)(?=\\item|\\end\{itemize\}|\\end\{enumerate\}|$)/g, '<li>$1</li>');
    text = text.replace(/\\begin\{itemize\}/g, '<ul class="list-disc pl-5 my-2 space-y-1 text-left">');
    text = text.replace(/\\end\{itemize\}/g,   '</ul>');
    text = text.replace(/\\begin\{enumerate\}/g, '<ol class="list-decimal pl-5 my-2 space-y-1 text-left">');
    text = text.replace(/\\end\{enumerate\}/g,   '</ol>');

    // --- TAHAP 4: Konversi newline -> <br/> ---
    text = text.replace(/\n/g, '<br/>');
    
    // Bersihkan <br/> berlebih di sekitar elemen block list
    text = text.replace(/<br\/>\s*<ul/g,    '<ul');
    text = text.replace(/<\/ul>\s*<br\/>/g, '</ul>');
    text = text.replace(/<br\/>\s*<ol/g,    '<ol');
    text = text.replace(/<\/ol>\s*<br\/>/g, '</ol>');
    text = text.replace(/<br\/>\s*<li/g,    '<li');
    text = text.replace(/<\/li>\s*<br\/>/g, '</li>');

    // --- TAHAP 5: Kembalikan blok math dan render via KaTeX ---
    text = text.replace(/___MATH_BLOCK_(\d+)___/g, (_, indexStr) => {
      const index = parseInt(indexStr, 10);
      let mathString = mathBlocks[index];
      try {
        let isDisplay = false;
        let mathContent = '';
        if (mathString.startsWith('$$')) {
          isDisplay = true;
          mathContent = mathString.slice(2, -2);
        } else {
          mathContent = mathString.slice(1, -1);
        }
        // Normalisasi double-backslash dari JSON sebelum parsing KaTeX
        // Contoh: \\frac -> \frac (KaTeX butuh single backslash)
        mathContent = mathContent.replace(/\\\\/g, '\\');
        return katex.renderToString(mathContent, {
          displayMode: isDisplay,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch (e) {
        // Fallback: tampilkan konten mentah di dalam <code> agar tidak hilang
        return `<code class="text-xs bg-slate-100 px-1 rounded">${mathString}</code>`;
      }
    });

    return text;
  };

  // Mode block murni (tanpa $ delimiter, langsung LaTeX display)
  if (block && !content.includes('$')) {
      try {
          const normalized = content.replace(/\\\\/g, '\\');
          const html = katex.renderToString(normalized, { displayMode: true, throwOnError: false, strict: false });
          return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (e) {
          return <div className={className}>{content}</div>;
      }
  }

  return (
    <div 
        className={`latex-container ${className}`} 
        dangerouslySetInnerHTML={{ __html: renderContent(content) }} 
    />
  );
};
