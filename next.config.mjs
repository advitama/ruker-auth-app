/** @type {import('next').NextConfig} */

import { fileURLToPath } from "node:url";
import createJiti from "jiti";

const nextConfig = {
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
};

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./src/config/env.ts");

export default nextConfig;
