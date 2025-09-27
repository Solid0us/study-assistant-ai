import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { CreateCollectionBody } from "../types";
import http from "../../../services/HttpService";

export const useCreateCollection = (
  options?: UseMutationOptions<any, Error, CreateCollectionBody>
) =>
  useMutation({
    mutationFn: (request: CreateCollectionBody) =>
      http.request("collections", {
        method: "POST",
        body: JSON.stringify(request),
        auth: true,
      }),
    ...options,
  });
