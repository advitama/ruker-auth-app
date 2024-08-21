"use client";

import { env } from "@/config/env";
import { toast } from "@/components/ui/use-toast";
import axios, { InternalAxiosRequestConfig } from "axios";

// function authRequestInterceptor(config: InternalAxiosRequestConfig) {
//   if (config.headers) {
//     config.headers.Accept = "application/json";
//   }

//   config.withCredentials = true;
//   return config;
// }

export const AUTH_API = axios.create({
  baseURL: env.NEXT_PUBLIC_AUTH_API_URL,
});

// AUTH_API.interceptors.request.use(authRequestInterceptor);
// AUTH_API.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     const message = error.response?.data?.message || error.message;
//     toast({
//       title: "Error",
//       description: message,
//     });

//     if (error.response?.status === 401) {
//       const searchParams = new URLSearchParams();
//       const redirectTo = searchParams.get("redirectTo");
//       window.location.href = `/auth/login?redirectTo=${redirectTo}`;
//     }

//     return Promise.reject(error);
//   }
// );
