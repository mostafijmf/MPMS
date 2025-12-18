"use server";
import { getAccessToken } from "@/lib/cookie-handler";
import { API_URL } from "@/lib/secret";
import { apiError, apiSuccess } from "./api-response";

export const getSummary = async () => {
  try {
    const response = await fetch(
      `${API_URL}/summary`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        cache: "force-cache",
        next: { tags: ["summary"] }
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while fetching summary."
      );
    };

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while fetching summary."
    );
  }
};