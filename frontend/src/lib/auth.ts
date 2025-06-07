import {
  LoginRequest,
  SignupRequest,
  JwtResponse,
  MessageResponse,
} from "@/types/auth";

const API_BASE_URL = "http://localhost:8080/api/auth";

export async function login(credentials: LoginRequest): Promise<JwtResponse> {
  const response = await fetch(`${API_BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Login Error Response:", errorData);
    throw new Error(errorData.message || "로그인 실패");
  }

  return response.json();
}

export async function register(
  userData: SignupRequest
): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Signup Error Response:", errorData);
    throw new Error(errorData.message || "회원가입 실패");
  }

  return response.json();
}
