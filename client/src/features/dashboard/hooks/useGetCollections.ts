import { useQuery } from "@tanstack/react-query";
import http from "../../../services/HttpService";
import type { CollectionsResponse } from "../types";

export const useGetCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () =>
      await http.request<CollectionsResponse>("collections", {
        method: "GET",
        auth: true,
      }),
    staleTime: 30 * 1000,
  });
};
