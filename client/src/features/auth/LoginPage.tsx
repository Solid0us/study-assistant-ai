import { useState } from "react";
import { Link } from "react-router";
import http from "../../services/HttpService";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      {
        username,
        password,
      },
      {
        onSuccess: (response) => {
          http.setAccessToken(response.data.accessToken.token);
          http.setRefreshToken(response.data.refreshToken.token);
          navigate("/dashboard/home");
        },
        onError: (err: any) => {
          alert(err);
        },
      }
    );
  };
  return (
    <div className="flex flex-1 items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-amber-500 font-semibold">
              Sign up
            </Link>
          </p>
          <Link
            to="/auth/forgot-password"
            className="text-amber-500 text-sm mt-2 inline-block"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
