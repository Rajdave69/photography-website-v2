
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { execSync } from "child_process";

// Prebuild plugin to process images before building
const prebuildPlugin = () => ({
  name: 'prebuild',
  buildStart() {
    try {
      console.log('🚀 Running prebuild pipeline...');
      execSync('node scripts/prebuild.js', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
    } catch (error) {
      console.warn('⚠️ Prebuild failed:', error instanceof Error ? error.message : String(error));
    }
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    prebuildPlugin(),
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
