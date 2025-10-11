export type FlashcardSchema = {
  id: string;
  question: string;
  answer: string;
  collection_id: string;
  created_at: Date;
};

export type CollectionSchema = {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: Date;
};
