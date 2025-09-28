import { useQuery } from "@tanstack/react-query";
import http from "../../../services/HttpService";
import type { CollectionFlashcardResponse } from "../types";

const useGetCollectionFlashCards = (collectionId: string) => {
  return useQuery({
    queryKey: ["collections", collectionId],
    queryFn: async () =>
      await http.request<CollectionFlashcardResponse>(
        `collections/${collectionId}/flashcards`,
        {
          method: "GET",
          auth: true,
        }
      ),
  });
};

export default useGetCollectionFlashCards;
