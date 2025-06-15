"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    try {
      await register({ username, password });
      setSuccess(
        "회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다."
      );
      setTimeout(() => {
        router.push("/login");
      }, 2000); // 2초 후 로그인 페이지로 리다이렉트
    } catch (err: any) {
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-app-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white-900 backdrop-blur-md border border-app-accent-200 rounded-xl shadow-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-app-primary">
          AI Detector 회원가입
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-app-text text-sm font-semibold mb-2"
            >
              사용자 이름
            </label>
            <input
              type="text"
              id="username"
              className="input-field w-full"
              placeholder="사용자 이름을 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-app-text text-sm font-semibold mb-2"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              className="input-field w-full"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-app-text text-sm font-semibold mb-2"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field w-full"
              placeholder="비밀번호를 다시 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-center text-sm mb-4 bg-red-50 border border-red-200 rounded-md p-2"
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 text-center text-sm mb-4 bg-green-50 border border-green-200 rounded-md p-2"
            >
              {success}
            </motion.p>
          )}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn bg-app-primary hover:bg-app-primary-700 text-white w-full py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  회원가입 중...
                </div>
              ) : (
                "회원가입"
              )}
            </motion.button>
          </div>
          <p className="text-center text-app-secondary text-sm mt-6">
            이미 계정이 있으신가요?
            <Link
              href="/login"
              className="text-app-primary hover:text-app-primary-700 font-medium hover:underline ml-1 transition-colors"
            >
              로그인
            </Link>
          </p>
        </form>
      </motion.div>
    </main>
  );
}
