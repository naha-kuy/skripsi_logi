import { supabase } from '../lib/supabase';
import { Question } from '../models/types';

// Helper to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const fetchQuestionsByCategory = async (category: string, teacherId?: string, limit?: number): Promise<Question[]> => {
  try {
    let query = supabase.from('questions').select('*').eq('category', category);
    if (teacherId) {
      query = query.eq('teacher_id', teacherId);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    if (!data || data.length === 0) {
        console.warn(`No questions found for category: ${category}`);
        return [];
    }

    // Shuffle, then optionally limit (if limit provided)
    const shuffled = shuffleArray(data);
    const result = limit ? shuffled.slice(0, limit) : shuffled;

    return result.map(q => ({
      id: q.id,
      type: 'multiple-choice',
      question: q.question_text,
      options: q.options,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      optionFeedback: q.option_feedback
    }));
  } catch (error) {
    console.error(`Error fetching ${category} questions:`, error);
    return [];
  }
};

export const fetchMazeQuestions = async (teacherId?: string, limit: number = 10): Promise<{q: string, opts: string[], ans: number}[]> => {
    let questions = await fetchQuestionsByCategory('game', teacherId, limit);
    if (questions.length === 0) {
        return [
           { q: "5 + 5?", opts: ["10", "11", "12", "9"], ans: 0 },
           { q: "10 * 2?", opts: ["20", "22", "12", "5"], ans: 0 }
        ];
    }
    return questions.map(q => {
        const options = [...(q.options || [])];
        const correctAnswer = q.correctAnswer || '';
        const shuffledOptions = shuffleArray(options);
        const correctIndex = shuffledOptions.indexOf(correctAnswer);
        return {
            q: q.question,
            opts: shuffledOptions,
            ans: correctIndex >= 0 ? correctIndex : 0
        };
    });
};

export const fetchAdventureQuestions = async (teacherId?: string, limit: number = 10): Promise<{q: string, opts: string[], ans: number}[]> => {
    let questions = await fetchQuestionsByCategory('game', teacherId, limit);
    if (questions.length === 0) {
       return [
          { q: "Sita memiliki 5 apel, memakan 2. Berapa sisa apel Sita?", opts: ["3", "4", "2", "5"], ans: 0 },
          { q: "Jarak sekolah 10km, Budi jalan 2km/jam. Berapa jam Budi sampai?", opts: ["5 Jam", "4 Jam", "3 Jam", "6 Jam"], ans: 0 }
       ];
    }
    return questions.map(q => {
        const options = [...(q.options || [])];
        const correctAnswer = q.correctAnswer || '';
        const shuffledOptions = shuffleArray(options);
        const correctIndex = shuffledOptions.indexOf(correctAnswer);
        return {
            q: q.question,
            opts: shuffledOptions,
            ans: correctIndex >= 0 ? correctIndex : 0
        };
    });
};
