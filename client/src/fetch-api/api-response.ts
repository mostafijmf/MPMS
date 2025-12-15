
export const apiSuccess = <T>(data: T, message = "Request successful") => ({
  success: true,
  error: false,
  message,
  data,
});

export const apiError = (message: string = "An unexpected error occurred", data: any = null) => ({
  success: false,
  error: true,
  message,
  data,
});
