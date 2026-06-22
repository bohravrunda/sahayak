import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const navigationRef =
  createNavigationContainerRef<RootStackParamList>();

// Generic implementation to enforce strict parameter matching based on route name
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    // TypeScript now knows exact parameter types for 'EmergencyView' or others
    navigationRef.navigate(name as any, params as any);
  }
}