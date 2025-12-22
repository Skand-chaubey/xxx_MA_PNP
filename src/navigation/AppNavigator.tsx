import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '@/types';
import { useAuthStore } from '@/store';

// Auth Screens
import LoginScreen from '@/screens/auth/LoginScreen';
import OTPScreen from '@/screens/auth/OTPScreen';
import OnboardingScreen from '@/screens/auth/OnboardingScreen';

// Main Screens
import HomeScreen from '@/screens/home/HomeScreen';
import MarketplaceScreen from '@/screens/trading/MarketplaceScreen';
import WalletScreen from '@/screens/wallet/WalletScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';

// KYC & Meter Screens
import KYCScreen from '@/screens/kyc/KYCScreen';
import MeterRegistrationScreen from '@/screens/meter/MeterRegistrationScreen';

// Trading Screens
import OrderScreen from '@/screens/trading/OrderScreen';

// Home Screens
import EnergyChartScreen from '@/screens/home/EnergyChartScreen';

// Profile Screens
import TradingBotScreen from '@/screens/profile/TradingBotScreen';

// Wallet Screens
import TopUpScreen from '@/screens/wallet/TopUpScreen';

// Meter Screens
import MeterStatusScreen from '@/screens/meter/MeterStatusScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <MainTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <MainTabs.Screen name="Home" component={HomeScreen} />
      <MainTabs.Screen name="Marketplace" component={MarketplaceScreen} />
      <MainTabs.Screen name="Wallet" component={WalletScreen} />
      <MainTabs.Screen name="Profile" component={ProfileScreen} />
    </MainTabs.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="OTP" component={OTPScreen} />
            <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
          </>
        ) : (
          <>
            <RootStack.Screen name="Main" component={MainTabNavigator} />
            <RootStack.Screen
              name="KYC"
              component={KYCScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="MeterRegistration"
              component={MeterRegistrationScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="Order"
              component={OrderScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="EnergyChart"
              component={EnergyChartScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="TradingBot"
              component={TradingBotScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="TopUp"
              component={TopUpScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="MeterStatus"
              component={MeterStatusScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

