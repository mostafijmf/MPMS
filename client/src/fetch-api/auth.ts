"use server";
import { API_URL } from "@/lib/secret";
import { apiError, apiSuccess } from "./api-response";
import { getAccessToken, getRefreshToken, setCookieHandler } from "@/lib/cookie-handler";

// <!-- Login -->
export const login = async (body: {
  email: string;
  password: string;
  isRemember: boolean;
}) => {
  try {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        credentials: "include",
        body: JSON.stringify(body)
      }
    );
    await setCookieHandler(response);

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while login.",
        result
      );
    };

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    // console.error("Unexpected error:", error?.message);
    return apiError(
      error?.message || "An unexpected error occurred while login."
    );
  }
};

// <!-- Logout -->
export const logout = async () => {
  try {
    const response = await fetch(
      `${API_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        credentials: "include",
      }
    );
    await setCookieHandler(response);

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while logout.",
        result
      );
    };

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    // console.error("Unexpected error:", error?.message);
    return apiError(
      error?.message || "An unexpected error occurred while logout."
    );
  }
};

// <!-- Validate Auth token -->
export const validateAuth = async () => {
  try {
    const response = await fetch(
      `${API_URL}/auth/validate-auth-token`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()} ,refreshToken=${await getRefreshToken()}`,

        },
        credentials: "include",
      }
    );
    await setCookieHandler(response);

    const result = await response.json();
    // console.log("Fetch response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while validating auth."
      );
    };

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    // console.error("Unexpected error:", error?.message);
    return apiError(
      error?.message || "An unexpected error occurred while validating auth."
    );
  }
};