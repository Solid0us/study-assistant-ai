import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export type JwtPayload = {
  user_id: string;
  username: string;
  exp: number;
  iat: number;
};

const isPayloadExpired = (payload: JwtPayload) => {
  return payload.iat < payload.exp;
};

const updateJwts = (
  setPayload: React.Dispatch<React.SetStateAction<JwtPayload | null>>,
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>,
  setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const storedAccessToken = localStorage.getItem("access_token");
  const storedRefreshToken = localStorage.getItem("refresh_token");
  if (storedAccessToken) {
    const payload: JwtPayload = jwtDecode(storedAccessToken);
    setPayload(payload);
    setIsLoggedIn(isPayloadExpired(payload));
  } else {
    setPayload(null);
    setIsLoggedIn(false);
  }
  setAccessToken(storedAccessToken);
  setRefreshToken(storedRefreshToken);
};

const useGetJwt = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [payload, setPayload] = useState<JwtPayload | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    updateJwts(setPayload, setAccessToken, setRefreshToken, setIsLoggedIn);
    window.addEventListener("storage", () =>
      updateJwts(setPayload, setAccessToken, setRefreshToken, setIsLoggedIn)
    );
    return () =>
      window.removeEventListener("storage", () =>
        updateJwts(setPayload, setAccessToken, setRefreshToken, setIsLoggedIn)
      );
  }, [accessToken, refreshToken]);

  return {
    accessToken,
    refreshToken,
    payload,
    isLoggedIn,
  };
};

export default useGetJwt;
