import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.pupular.www',
  appName: 'Pupular',
  webDir: 'out',
  server: {
    url: 'https://www.pupular.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#f6f7f4',
    preferredContentMode: 'mobile',
    scheme: 'Pupular',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#f6f7f4',
      showSpinner: false,
      launchFadeOutDuration: 300,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#f6f7f4',
    },
  },
};

export default config;
