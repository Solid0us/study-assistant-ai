import type { CollectionSchema, FlashcardSchema } from "@/types";

export type CollectionFlashcardResponse = {
  collection: CollectionSchema;
  flashcards: FlashcardSchema[];
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
