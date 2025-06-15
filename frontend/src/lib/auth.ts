import {
  LoginRequest,
  SignupRequest,
  JwtResponse,
  MessageResponse,
} from "@/types/auth";
import axiosInstance from "./axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

export async function login(credentials: LoginRequest): Promise<JwtResponse> {
  try {
    const response = await axiosInstance.post("/auth/signin", credentials);
    const token = response.data.accessToken || response.data.token;
    if (!token) {
      throw new Error("토큰이 응답에 포함되어 있지 않습니다.");
    }
    return {
      ...response.data,
      token: token,
    };
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "로그인 실패");
  }
}

export async function register(
  userData: SignupRequest
): Promise<MessageResponse> {
  try {
    const response = await axiosInstance.post("/auth/signup", userData);
    return response.data;
  } catch (error: any) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "회원가입 실패");
  }
}
