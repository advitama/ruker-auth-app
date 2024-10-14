"use client";

import { env } from "@/config/env";
import axios, { InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "@/utils/functions/session";

const AUTH_API = axios.create({
  baseURL: env.NEXT_PUBLIC_AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to set the Authorization header
AUTH_API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AUTH_API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    // Return the error message to be handled by the component
    return Promise.reject(new Error(message));
  }
);

export default AUTH_API;
