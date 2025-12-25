import Constants from 'expo-constants';

/**
 * Get Mapbox access token from environment
 */
export const getMapboxAccessToken = (): string => {
  const token =
    Constants.expoConfig?.extra?.mapboxAccessToken ||
    process.env.MAPBOX_ACCESS_TOKEN ||
    '';

  if (!token) {
    console.warn(
      'Mapbox access token not found. Please set MAPBOX_ACCESS_TOKEN in .env or mapboxAccessToken in app.json'
    );
  }

  return token;
};

/**
 * Initialize Mapbox with access token
 */
export const initializeMapbox = () => {
  const token = getMapboxAccessToken();
  
  if (token && typeof Mapbox !== 'undefined') {
    Mapbox.setAccessToken(token);
  }
};

