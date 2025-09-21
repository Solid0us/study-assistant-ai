import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-amber-100 items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-amber-700 mb-4">Recall AI</h1>
          <p className="text-lg text-gray-700">
            Your AI-powered study assistant to master your learning efficiently.
          </p>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
