import {
  type RefreshResponse,
  type AuthResponse,
  type LoginRequest,
  type SignupRequest,
} from "@/features/auth/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import http from "../services/HttpService";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

export type AuthState = "loading" | "authenticated" | "unauthenticated";

interface JwtPayload {
  username: string;
  iat: number;
  exp: number;
  user_id: string;
}

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
  refresh: UseMutationResult<
    {
      data: RefreshResponse;
      status: number;
    },
    Error,
    void,
    unknown
  >;
  logout: () => void;
  payload: JwtPayload | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAccessExpired: boolean;
  isRefreshExpired: boolean;
  authState: AuthState;
}

const isPayloadExpired = (payload: JwtPayload) => {
  const unixTimestamp = Date.now() / 1000;
  return unixTimestamp > payload.exp;
};

export const AuthContext = createContext<AuthProviderValues | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [payload, setPayload] = useState<JwtPayload | null>(null);
  const [authState, setAuthState] = useState<AuthState>("loading");

  useEffect(() => {
    checkTokens();
    window.addEventListener("storage", checkTokens);
    return () => window.removeEventListener("storage", checkTokens);
  }, []);

  const isTokenExpired = (token: string | null) => {
    if (!token) return true;
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  const isAccessExpired = isTokenExpired(accessToken);
  const isRefreshExpired = isTokenExpired(refreshToken);

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

  const refresh = useMutation({
    mutationFn: () =>
      http.request<RefreshResponse>("auth/refresh", {
        method: "POST",
        auth: true,
      }),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.data.token);
    },
  });

  const logout = () => {
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    window.location.replace("/auth/login");
  };

  const checkTokens = async () => {
    setAuthState("loading");
    const storedAccessToken = localStorage.getItem("access_token");
    const storedRefreshToken = localStorage.getItem("refresh_token");

    if (storedAccessToken) {
      const payload: JwtPayload = jwtDecode(storedAccessToken);
      if (!isPayloadExpired(payload)) {
        setPayload(payload);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setAuthState("authenticated");
        return;
      }

      if (storedRefreshToken && !isTokenExpired(storedRefreshToken)) {
        await attemptRefresh(storedRefreshToken);
        return;
      }
    } else if (storedRefreshToken && !isTokenExpired(storedRefreshToken)) {
      await attemptRefresh(storedRefreshToken);
      return;
    }

    setPayload(null);
    setAccessToken(null);
    setRefreshToken(null);
    setAuthState("unauthenticated");
  };

  const attemptRefresh = async (refreshToken: string) => {
    try {
      await refresh.mutateAsync();
      const newAccessToken = localStorage.getItem("access_token");
      if (newAccessToken) {
        const newPayload: JwtPayload = jwtDecode(newAccessToken);
        setPayload(newPayload);
        setAccessToken(newAccessToken);
        setRefreshToken(refreshToken);
        setAuthState("authenticated");
        return;
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  };

  const values: AuthProviderValues = {
    login,
    signup,
    logout,
    refresh,
    payload,
    accessToken,
    refreshToken,
    authState,
    isAccessExpired,
    isRefreshExpired,
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
