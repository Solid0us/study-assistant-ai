import { useMutation } from "@tanstack/react-query";
import type { AuthResponse, SignupRequest } from "../types";
import http from "../../../services/HttpService";

export const useSignup = () =>
  useMutation({
    mutationFn: (request: SignupRequest) =>
      http.request<AuthResponse>("auth/register", {
        method: "POST",
        body: JSON.stringify(request),
        auth: false,
      }),
  });
