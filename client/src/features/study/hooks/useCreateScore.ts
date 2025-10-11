import type { CreateScoreBody } from "@/features/dashboard/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import http from "../../../services/HttpService";

const useCreateScore = (
  flashcardId: string,
  options?: UseMutationOptions<any, Error, CreateScoreBody>
) =>
  useMutation({
    mutationFn: (request: CreateScoreBody) =>
      http.request(`flashcards/${flashcardId}/scores`, {
        method: "POST",
        body: JSON.stringify(request),
        auth: true,
      }),
    ...options,
  });
export default useCreateScore;
