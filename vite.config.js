import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

let faviconURL = "/img/book.png";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,json,mp3}"],
      },
      // install your native app on users device from the app store
      // related_applications: [{
      //   platform: "play",
      //   id: "com.google.samples.apps.iosched"
      // }],
      includeAssets: ["/public/*"],
      prefer_related_applications: false,
      manifest: {
        name: "Quranim",
        short_name: "quranim",
        description: "I am a simple pwa vite app",
        scope: "/",
        start_url: "/",
        background_color: "#2f4f4f",
        theme_color: "#2f4f4f",
        display: "fullscreen",// or standalone
        orientation: "portrait",
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
            purpose: "favicon mask",
          },
        ],
      },
    }),
  ],
});
