import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
} from "@/features/auth/types";
import { createContext, useContext, type ReactNode } from "react";
import http from "../services/HttpService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useGetJwt, { type JwtPayload } from "@/hooks/useGetJwt";

interface AuthProviderProps {
  children?: ReactNode;
}

interface AuthProviderValues {
  login: UseMutationResult<
    {
      data: AuthResponse;
      status: number;
    },
    Error,
    LoginRequest,
    unknown
  >;
  signup: UseMutationResult<
    {
      data: AuthResponse;
      status: number;
    },
    Error,
    SignupRequest,
    unknown
  >;
  logout: () => void;
  isLoggedIn: boolean;
  payload: JwtPayload | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthProviderValues | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const { payload, accessToken, isLoggedIn, refreshToken, isLoading } =
    useGetJwt();

  const login = useMutation({
    mutationFn: (request: LoginRequest) =>
      http.request<AuthResponse>("auth/login", {
        method: "POST",
        body: JSON.stringify(request),
        auth: false,
      }),
  });

  const signup = useMutation({
    mutationFn: (request: SignupRequest) =>
      http.request<AuthResponse>("auth/register", {
        method: "POST",
        body: JSON.stringify(request),
        auth: false,
      }),
  });

  const logout = () => {
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    navigate("/");
  };
  const values: AuthProviderValues = {
    login,
    signup,
    logout,
    isLoggedIn,
    payload,
    accessToken,
    refreshToken,
    isLoading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
