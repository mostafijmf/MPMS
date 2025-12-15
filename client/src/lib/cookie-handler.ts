"use server";
import { cookies } from "next/headers";
import setCookie from 'set-cookie-parser';

export async function getAccessToken() {
  const token = (await cookies()).get("accessToken");
  return token?.value || "";
};

export async function getRefreshToken() {
  const token = (await cookies()).get("refreshToken");
  return token?.value || "";
}

export const setCookieHandler = async (response: Response) => {
  const cookie = await cookies();
  const cookieData = setCookie(response.headers.getSetCookie())
  cookieData.forEach((ck) => {
    cookie.set(ck.name, ck.value, { ...ck } as any)
  })
}

export const deleteCookieHandler = async (key: string | string[]) => {
  const cookie = await cookies();
  if (Array.isArray(key)) key.forEach((k) => cookie.delete(k))
  else cookie.delete(key)
}