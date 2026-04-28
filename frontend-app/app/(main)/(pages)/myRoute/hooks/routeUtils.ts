import type { AppError } from '../../../../utils/types/api/common.types';
import type { Coords } from '../../../components/Here/types';

export function requestBrowserPosition(): Promise<Coords> {
  if (!('geolocation' in navigator)) {
    return Promise.reject(new Error('Nabigatzaileak ez du GPSa onartzen.'));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      reject,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  });
}

export function getActionErrorMessage(error: unknown): string {
  if (isGeolocationError(error)) {
    if (error.code === error.PERMISSION_DENIED) {
      return 'GPS baimena ukatu da.';
    }
    if (error.code === error.POSITION_UNAVAILABLE) {
      return 'Ezin izan da kokapena lortu.';
    }
    if (error.code === error.TIMEOUT) {
      return 'Kokapena lortzea gehiegi luzatu da.';
    }
  }

  const appError = error as AppError;
  if (appError?.message) return appError.message;

  if (error instanceof Error) return error.message;
  return 'Ekintza ezin izan da osatu.';
}

export function getErrorStatus(error: unknown): number | undefined {
  return (error as AppError | null)?.status;
}

function isGeolocationError(error: unknown): error is GeolocationPositionError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}
