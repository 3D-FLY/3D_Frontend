import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// TEMP: build-time check that the sheet env vars reach the build (values are not printed).
console.log("[env check] JOIN:", !!process.env.VITE_JOIN_SHEET_URL, "SUPPLIER:", !!process.env.VITE_SUPPLIER_SHEET_URL);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
});
