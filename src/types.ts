export interface Declaration {
  id: string;
  title: string;
  content: string;
  subtext?: string;
  icon?: string;
  category?: 'first_sight' | 'daily' | 'future' | 'feeling';
}

export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  date?: string;
  location?: string;
  caption: string;
  rotation?: number;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    reaction: string;
    isRomantic: boolean;
  }[];
}

export interface LoveStoryConfig {
  recipientName: string;
  senderName: string;
  introTitle: string;
  introSubtitle: string;
  declarations: Declaration[];
  photos: PhotoItem[];
  memories: MemoryItem[];
  loveLetter: string;
  finalQuestion: string;
  quizQuestions: QuizQuestion[];
  bgMusicTrack?: string;
}

export interface FinalAnswer {
  id: string;
  answerText: string;
  submittedAt: string;
  recipientName: string;
  senderName: string;
}

export type StageId = 
  | 'intro'
  | 'declarations'
  | 'photos'
  | 'games'
  | 'letter'
  | 'fake_ending'
  | 'final_question';

export interface StageInfo {
  id: StageId;
  number: number;
  title: string;
  icon: string;
  description: string;
}
