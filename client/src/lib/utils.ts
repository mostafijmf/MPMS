import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initializeFormData(data: { [key: string]: any }) {
  const formData = new FormData();
  Object.keys(data).map(key => {
    if (data[key]) {
      if (Array.isArray(data[key])) data[key].forEach((value) => {
        formData.append(`${key}[]`, value);
      })
      else formData.append(key, data[key])
    };
  });

  return formData
}

export const nameSplitter = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  // Calculate the appropriate index for the 'sizes' array (0 for Bytes, 1 for KB, 2 for MB, etc.)
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Use toFixed(2) to round to two decimal places for readability, then append the unit
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}