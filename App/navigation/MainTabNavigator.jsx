import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/home/HomeScreen';
import ReportsScreen from '../Screens/reports/ReportsScreen';
import CreateReportScreen from '../Screens/reports/CreateReportScreen';
import ProfileScreen from '../Screens/profile/ProfileScreen';
import AdminScreen from '../Screens/admin/AdminScreen';
import DashboardScreen from '../Screens/admin/DashboardScreen';
import BottomTabBar from '../Components/navigation/BottomTabBar';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

/**
 * MainTabNavigator - Navegador principal con tabs inferiores
 * Utiliza la barra de navegación personalizada estilo Spotify
 * Muestra diferentes tabs según el rol del usuario (admin vs user)
 */
const MainTabNavigator = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <Tab.Navigator
            tabBar={(props) => <BottomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                // Configuraciones adicionales para mejorar la experiencia
                lazy: true,
                tabBarHideOnKeyboard: true,
            }}
            initialRouteName="Home"
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarAccessibilityLabel: 'Pantalla de inicio',
                }}
            />
            {isAdmin ? (
                // Tabs para administrador
                <>
                    <Tab.Screen
                        name="Admin"
                        component={AdminScreen}
                        options={{
                            tabBarAccessibilityLabel: 'Panel de administración',
                        }}
                    />
                    <Tab.Screen
                        name="Dashboard"
                        component={DashboardScreen}
                        options={{
                            tabBarAccessibilityLabel: 'Dashboard de métricas',
                        }}
                    />
                </>
            ) : (
                // Tabs para usuario normal
                <>
                    <Tab.Screen
                        name="Reports"
                        component={ReportsScreen}
                        options={{
                            tabBarAccessibilityLabel: 'Lista de reportes',
                        }}
                    />
                    <Tab.Screen
                        name="CreateReport"
                        component={CreateReportScreen}
                        options={{
                            tabBarAccessibilityLabel: 'Crear nuevo reporte',
                        }}
                    />
                </>
            )}
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarAccessibilityLabel: 'Mi perfil de usuario',
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;