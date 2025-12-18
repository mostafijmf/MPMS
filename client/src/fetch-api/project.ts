"use server";
import { getAccessToken } from "@/lib/cookie-handler";
import { API_URL } from "@/lib/secret";
import { revalidatePath, revalidateTag } from "next/cache";
import { apiError, apiSuccess } from "./api-response";

// Revalidate Project cache
export const revalidateProject = async () => {
  revalidateTag("projects", "max");
  revalidateTag("project", "max");
  revalidateTag("summary", "max");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
};

// <!-- Create Project -->
export const createProject = async (body: FormData) => {
  try {
    const response = await fetch(
      `${API_URL}/projects`,
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
        result?.message || "An unexpected error occurred while creating project."
      );
    };
    await revalidateProject();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while creating project."
    );
  }
};

// <!-- Get All Projects -->
interface ProjectQueryProps {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
export const getAllProjects = async ({ page = 1, limit = 10, search,status }: ProjectQueryProps) => {
  // Build query string dynamically
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));

  const queryString = params.toString();

  try {
    const response = await fetch(
      `${API_URL}/projects${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        cache: "force-cache",
        next: { tags: ["projects"] }
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while fetching projects."
      );
    };

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while fetching projects."
    );
  }
};

// <!-- Get Project By ID -->
export const getProjectById = async (id: string) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        cache: "force-cache",
        next: { tags: ["project"] }
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while fetching project."
      );
    };

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while fetching project."
    );
  }
};

// <!-- Update Project By ID -->
export const updateProjectById = async (id: string, body: FormData) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/${id}`,
      {
        method: "PATCH",
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
        result?.message || "An unexpected error occurred while updating project."
      );
    };
    await revalidateProject();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while updating project."
    );
  }
};

// <!-- Delete Project By ID -->
export const deleteProjectById = async (id: string) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/${id}`,
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
        result?.message || "An unexpected error occurred while deleting project."
      );
    };
    await revalidateProject();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while deleting project."
    );
  }
};