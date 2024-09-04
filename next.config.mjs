/** @type {import('next').NextConfig} */

import { fileURLToPath } from "node:url";
import createJiti from "jiti";

const nextConfig = {
  output: "standalone",
};

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./src/config/env.ts");

export default nextConfig;