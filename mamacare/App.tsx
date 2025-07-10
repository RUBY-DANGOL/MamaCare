// app.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './app/navigation/RootNavigator';
import { loadUserData } from './app/utils/storage';

export default function App() {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Home' | 'Partner'>('Login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const user = await loadUserData();
      if (user?.loggedIn) {
        setInitialRoute(user.role === 'mom' ? 'Home' : 'Partner');
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <RootNavigator initialRouteName={initialRoute} />
    </NavigationContainer>
  );
}
