export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpOptions extends RequestInit {
  auth?: boolean;
}

class HttpService {
  private static instance: HttpService;
  private baseUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  public static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService();
    }
    return HttpService.instance;
  }

  public setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
  }

  public setRefreshToken(token: string | null) {
    this.refreshToken = token;
    if (token) {
      localStorage.setItem("refresh_token", token);
    } else {
      localStorage.removeItem("refresh_token");
    }
  }

  public getAccessToken(): string | null {
    return this.accessToken ?? localStorage.getItem("access_token");
  }

  public getRefreshToken(): string | null {
    return this.refreshToken ?? localStorage.getItem("refresh_token");
  }

  public async request<T>(
    endpoint: string,
    options: HttpOptions = {}
  ): Promise<{ data: T; status: number }> {
    const { auth = true, headers, ...rest } = options;

    const config: RequestInit = {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
      },
    };

    if (auth) {
      const token =
        endpoint == "auth/refresh"
          ? this.getRefreshToken()
          : this.getAccessToken();
      if (token) {
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    let responseBody: any = null;

    if (response.status !== 204) {
      responseBody = await response.json().catch(() => ({}));
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseBody?.message || `HTTP error: ${response.status}`,
        body: responseBody,
      };
    }

    return { data: responseBody as T, status: response.status };
  }
}

export default HttpService.getInstance();
