import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type {
  AiGenerateFlashcardsBody,
  AiGenerateFlashcardsResponse,
} from "../types";
import http from "../../../services/HttpService";

const useAiGenerateFlashcards = (
  options?: UseMutationOptions<
    { data: AiGenerateFlashcardsResponse; status: number },
    Error,
    AiGenerateFlashcardsBody
  >
) =>
  useMutation<
    { data: AiGenerateFlashcardsResponse; status: number },
    Error,
    AiGenerateFlashcardsBody
  >({
    mutationFn: async (request: AiGenerateFlashcardsBody) =>
      await http.request<AiGenerateFlashcardsResponse>(`flashcards/generate`, {
        method: "POST",
        body: JSON.stringify(request),
        auth: true,
      }),
    ...options,
  });

export default useAiGenerateFlashcards;
