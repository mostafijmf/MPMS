import { jwtVerify, SignJWT } from "jose";
import { jwtAccessKey, jwtRefreshKey } from "./secret";

type SignJWTProps = {
  type: "access" | "refresh";
  expiresIn: number | string | Date;
  payload: any;
};

export const createJWT = async ({ payload, type, expiresIn }: SignJWTProps) => {
  if (typeof payload !== 'object' || !payload)
    throw new Error('Payload must be a non-empty object');

  if (type === "access" && (typeof jwtAccessKey !== 'string' || jwtAccessKey === ''))
    throw new Error('Secret key must be a non-empty string');
  if (type === "refresh" && (typeof jwtRefreshKey !== 'string' || jwtRefreshKey === ''))
    throw new Error('Secret key must be a non-empty string');

  const secretKey = type === "access" ? jwtAccessKey : jwtRefreshKey;

  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(new TextEncoder().encode(secretKey));

    return token;
  } catch (error) {
    console.error('Failed to sign the JWT: ', error);
    throw error;
  }
}

export const verifyJWT = async (token: string, type: "access" | "refresh") => {
  if (!token) return null;
  const secretKey = type === "access" ? jwtAccessKey : jwtRefreshKey;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey), {
      algorithms: ['HS256'],
    });
    return payload;

  } catch (error) {
    const err = error as Error & { code?: string };
    console.error('Failed to verify the JWT: ', err.message);

    if (err.name === 'JWTExpired' || err.code === 'ERR_JWT_EXPIRED')
      throw new Error("Token has been expired");

    if (err.name === 'JWTInvalid' || err.code === 'ERR_JWT_INVALID')
      throw new Error("Invalid token");

    return null;
  }
}