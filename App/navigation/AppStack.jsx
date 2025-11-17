import React, { useRef, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoaderScreen from '../Screens/landing/LoaderScreen';
import LandingScreen from '../Screens/landing/LandingScreen';
import LoginScreen from '../Screens/auth/LoginScreen';
import RegisterScreen from '../Screens/auth/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';
import ReportDetailScreen from '../Screens/reports/ReportDetailScreen';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Stack = createNativeStackNavigator();

/**
 * AppStack - Navegación principal de la aplicación
 * Maneja el flujo de pantallas y transiciones usando React Navigation
 */
const AppStack = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const { showToast } = useToast();
    const navigationRef = useRef(null);
    const [loaderComplete, setLoaderComplete] = useState(false);
    const [hasNavigated, setHasNavigated] = useState(false);

    // Efecto para manejar la navegación cuando el loader termina y auth está lista
    useEffect(() => {
        if (loaderComplete && !loading && !hasNavigated && navigationRef.current) {
            setHasNavigated(true);

            if (isAuthenticated && user) {
                // Usuario autenticado - ir directo a Home
                navigationRef.current.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
                setTimeout(() => {
                    showToast(`¡Bienvenido de vuelta, ${user.nombre || 'Usuario'}!`, 'success');
                }, 500);
            } else {
                // Usuario no autenticado - ir a Landing
                navigationRef.current.reset({
                    index: 0,
                    routes: [{ name: 'Landing' }],
                });
            }
        }
    }, [loaderComplete, loading, isAuthenticated, user, hasNavigated, showToast]);

    const handleLoaderComplete = () => {
        setLoaderComplete(true);
    };

    return (
        <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    initialRouteName="Loader"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#4F46E5',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        animation: 'fade',
                        animationDuration: 350,
                        gestureEnabled: true,
                        gestureDirection: 'horizontal',
                    }}
                >
                    <Stack.Screen
                        name="Loader"
                        options={{
                            headerShown: false,
                            animation: 'fade',
                            animationDuration: 300,
                            gestureEnabled: false,
                        }}
                    >
                        {() => (
                            <LoaderScreen
                                onComplete={handleLoaderComplete}
                            />
                        )}
                    </Stack.Screen>
                <Stack.Screen
                    name="Landing"
                    options={{
                        headerShown: false,
                        animation: 'fade',
                        animationDuration: 400,
                        gestureEnabled: false,
                    }}
                >
                    {({ navigation }) => (
                        <LandingScreen
                            animated={true}
                            onNavigateToLogin={() => navigation.navigate('Login')}
                            onNavigateToRegister={() => navigation.navigate('Register')}
                            onNavigateToHome={() => navigation.navigate('MainTabs')}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        headerShown: false,
                        animation: 'slide_from_right',
                        animationDuration: 400,
                        gestureEnabled: true,
                        gestureDirection: 'horizontal',
                    }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{
                        headerShown: false,
                        animation: 'slide_from_right',
                        animationDuration: 400,
                        gestureEnabled: true,
                        gestureDirection: 'horizontal',
                    }}
                />
                <Stack.Screen
                    name="MainTabs"
                    component={MainTabNavigator}
                    options={{
                        headerShown: false,
                        animation: 'fade',
                        animationDuration: 350,
                        gestureEnabled: false,
                    }}
                />
                <Stack.Screen
                    name="ReportDetail"
                    component={ReportDetailScreen}
                    options={{
                        headerShown: false,
                        animation: 'slide_from_right',
                        animationDuration: 350,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppStack;