"use client";

import axios from "axios";

export const AUTH_API = axios.create({
  baseURL: "http://localhost:8080",
});