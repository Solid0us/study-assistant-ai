export type CollectionFlashcardResponse = {
  collection: {
    id: string;
    name: string;
    description?: string;
    user_id: string;
    created_at: Date;
  };
  flashcards: {
    id: string;
    question: string;
    answer: string;
    collection_id: string;
    created_at: Date;
  }[];
};

export type AiGenerateFlashcardsBody = {
  number: number;
  subject: string;
  description: string;
};

export type AiGenerateFlashcardsResponse = {
  flashcards: {
    question: string;
    answer: string;
  }[];
};
