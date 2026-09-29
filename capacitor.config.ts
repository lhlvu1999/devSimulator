import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mino.devsimulator",
  appName: "Dev Simulator",
  webDir: "dist",
  ios: {
    contentInset: "never",
    backgroundColor: "#f4f0e6",
    preferredContentMode: "mobile",
  },
  plugins: {
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
