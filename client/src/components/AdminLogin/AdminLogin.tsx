import type React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminLoginBackground from "../../assets/admin/AdminLoginBackground.jpg";
import { authService } from "../../services/auth.service";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const loginPromise = authService.login(email, password);
      const data = await toast.promise(loginPromise, {
        loading: "Đang đăng nhập...",
        success: <b>Đăng nhập thành công!</b>,
        error: <b>Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.</b>,
      });

      if (data?.accessToken) {
        localStorage.setItem("token", data.accessToken);
      }

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${AdminLoginBackground})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/70 to-amber-900/45" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="pointer-events-none absolute -left-16 top-16 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-3xl border border-white/30 bg-white/80 p-6 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Admin Portal</p>
            <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Đăng nhập với <span className="text-yellow-600">Admin</span>
            </h1>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Địa chỉ email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="block w-full rounded-xl border border-gray-300/90 bg-white/90 px-3 py-2 text-base text-gray-900 outline-none placeholder:text-gray-400 transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mật khẩu
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-yellow-600 transition hover:text-yellow-500">
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="block w-full rounded-xl border border-gray-300/90 bg-white/90 px-3 py-2 text-base text-gray-900 outline-none placeholder:text-gray-400 transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-xl bg-yellow-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
