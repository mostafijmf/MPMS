"use server";
import { API_URL } from "@/lib/secret";
import { apiError, apiSuccess } from "./api-response";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAccessToken } from "@/lib/cookie-handler";

// Revalidate User cache
export const revalidateUser = async () => {
  revalidateTag("users", "max");
  revalidateTag("user", "max");
  revalidatePath("/dashboard");
};

// <!-- Get all users by admin/manager -->
interface UsersQueryProps {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}
export const getAllUsersByAdmin = async ({ limit = 10, page = 1, search, role }: UsersQueryProps) => {
  // Build query string dynamically
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (role) params.append("role", role);
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));

  const queryString = params.toString();

  try {
    const response = await fetch(
      `${API_URL}/users${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        cache: "force-cache",
        next: { tags: ["users"] }
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while fetching users."
      );
    };

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    // console.error("Unexpected error:", error?.message);
    return apiError(
      error?.message || "An unexpected error occurred while fetching users."
    );
  }
};

// <!-- Get user profile -->
export const getUserProfile = async () => {
  try {
    const response = await fetch(
      `${API_URL}/users/get-profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        cache: "no-store",
        next: { tags: ["user"] }
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while fetching user."
      );
    };

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    // console.error("Unexpected error:", error?.message);
    return apiError(
      error?.message || "An unexpected error occurred while fetching user."
    );
  }
};

// <!-- Create user -->
export const createUser = async (body: FormData) => {
  try {
    const response = await fetch(
      `${API_URL}/users`,
      {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        body
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while creating user."
      );
    };
    await revalidateUser();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while creating user."
    );
  }
};

// <!-- Delete user by Id -->
export const deleteUserById = async (id: string) => {
  try {
    const response = await fetch(
      `${API_URL}/users/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while deleting user."
      );
    };
    await revalidateUser();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while deleting user."
    );
  }
};
