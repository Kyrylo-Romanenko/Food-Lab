import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
export default defineConfig({
  output: "static",
  site: "https://kyrylo-romanenko.github.io",
  base: process.env.BASE_PATH || "/",
  trailingSlash: "always",
  integrations: [preact()],
  devToolbar: { enabled: false },
});
