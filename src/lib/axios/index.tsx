"use client";

import { env } from "@/config/env";
import { toast } from "@/components/ui/use-toast";
import { getAccessToken } from "@/hooks/session";
import axios, { InternalAxiosRequestConfig } from "axios";

export const AUTH_API = axios.create({
  baseURL: env.NEXT_PUBLIC_AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to set the Authorization header
AUTH_API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken(); // fetch the token dynamically
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
    toast({
      title: "Error",
      description: message,
    });

    return Promise.reject(error);
  }
);
