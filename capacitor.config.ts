
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ccb0b97a1c3541bbbe10564d88920161',
  appName: 'focus-sprint-helper',
  webDir: 'dist',
  server: {
    url: "https://ccb0b97a-1c35-41bb-be10-564d88920161.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
