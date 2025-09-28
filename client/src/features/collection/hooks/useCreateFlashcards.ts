import type { CreateFlashcardsBody } from "@/features/dashboard/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import http from "../../../services/HttpService";

const useCreateFlashcards = (
  collectionId: string,
  options?: UseMutationOptions<any, Error, CreateFlashcardsBody>
) =>
  useMutation({
    mutationFn: (request: CreateFlashcardsBody) =>
      http.request(`collections/${collectionId}/flashcards`, {
        method: "POST",
        body: JSON.stringify(request),
        auth: true,
      }),
    ...options,
  });

export default useCreateFlashcards;
