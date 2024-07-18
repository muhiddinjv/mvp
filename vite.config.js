import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

let faviconURL = "/img/android-chrome-512x512.svg";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,json}"],
      },
      // install your native app on users device directly from the app store
      // related_applications: [{
      //   platform: "play",
      //   id: "com.google.samples.apps.iosched"
      // }],
      includeAssets: ["/public/*"],
      prefer_related_applications: false,
      manifest: {
        name: "Book Word By Word",
        short_name: "bwbw",
        description: "I am a simple pwa vite app",
        scope: "/",
        start_url: "/",
        background_color: "#f0e7db",
        theme_color: "#171717",
        display: "standalone",
        orientation: "any",
        icons: [
          {
            src: faviconURL,
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: faviconURL,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
