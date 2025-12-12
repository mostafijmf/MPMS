import 'dotenv/config';

export const PORT = process.env.PORT || 5000;
export const DB_URL = process.env.DB_URL;
export const BASE_URL = process.env.BASE_URL;
export const API_URL = process.env.API_URL;
export const jwtAccessKey = process.env.JWT_ACCESS_TOKEN;
export const jwtRefreshKey = process.env.JWT_REFRESH_TOKEN;

export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;