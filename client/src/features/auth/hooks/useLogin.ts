import { useMutation } from "@tanstack/react-query";
import type { LoginRequest, AuthResponse } from "../types";
import http from "../../../services/HttpService";

export const useLogin = () =>
  useMutation({
    mutationFn: (request: LoginRequest) =>
      http.request<AuthResponse>("auth/login", {
        method: "POST",
        body: JSON.stringify(request),
        auth: false,
      }),
  });
