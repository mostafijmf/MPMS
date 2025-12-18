"use server";
import { getAccessToken } from "@/lib/cookie-handler";
import { API_URL } from "@/lib/secret";
import { apiError, apiSuccess } from "./api-response";
import { SprintInput } from "@/validators/sprint-schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { revalidateProject } from "./project";

// Revalidate Sprint cache
export const revalidateSprint = async () => {
  revalidateTag("sprints", "max");
  revalidateTag("sprint", "max");
  revalidateTag("summary", "max");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
};

// <!-- Add Sprint By Project ID -->
export const addSprintByProjectId = async (projectId: string, body: SprintInput) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/${projectId}/sprint`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        body: JSON.stringify(body)
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while adding sprint to project."
      );
    };
    await revalidateSprint();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while adding sprint to project."
    );
  }
};

// <!-- Get Sprints By Project ID -->
export const getSprintsByProjectId = async (projectId: string) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/${projectId}/sprint`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        cache: "force-cache",
        next: { tags: ["sprints"] }
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while fetching sprints."
      );
    };

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while fetching sprints."
    );
  }
};

// <!-- Get Sprint By ID -->
export const getSprintById = async (sprintId: string) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/sprint/${sprintId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        cache: "force-cache",
        next: { tags: ["sprint"] }
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while fetching sprint."
      );
    };

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while fetching sprint."
    );
  }
};

// <!-- Update Sprint By ID -->
export const updateSprintById = async (sprintId: string, body: any) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/sprint/${sprintId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        body: JSON.stringify(body)
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while sprint sprint."
      );
    };
    await revalidateSprint();
    await revalidateProject();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while sprint sprint."
    );
  }
};

// <!-- Delete Sprint By ID -->
export const deleteSprintById = async (sprintId: string) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/sprint/${sprintId}`,
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
        result?.message || "An unexpected error occurred while deleting sprint."
      );
    };
    await revalidateSprint();
    await revalidateProject();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while deleting sprint."
    );
  }
};