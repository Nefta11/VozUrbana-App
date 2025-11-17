import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import CustomHeader from '../../Components/navigation/CustomHeader';
import ReportCard from '../../Components/ReportCard/ReportCard';

export default function ProfileScreen({ navigation }) {
  const [isGuest, setIsGuest] = useState(false); // Para detectar si es usuario invitado
  const [user, setUser] = useState({
    id: 1, // ID del usuario para filtrar reportes
    nombre: isGuest ? 'Usuario Invitado' : 'Orlando Méndez Montes',
    email: isGuest ? null : 'om@gmail.com',
    fechaRegistro: '23 de Octubre 2025',
    avatar: null,
    reportesCreados: isGuest ? 0 : 24,
    reportesNuevos: isGuest ? 0 : 1,
    reportesEnProceso: isGuest ? 0 : 4,
    reportesResueltos: isGuest ? 0 : 2,
  });

  // Reportes de ejemplo del usuario (formato compatible con ReportCard)
  const [userReports, setUserReports] = useState(isGuest ? [] : [
    {
      id: 1,
      titulo: 'Semáforo dañado en intersección principal',
      descripcion: 'El semáforo ubicado en la intersección de Av. Central con Calle 15 presenta fallas intermitentes, causando riesgo para peatones y conductores.',
      categoria: 'Infraestructura',
      estado: 'resuelto',
      prioridad: 'alta',
      fecha_creacion: '2025-11-15T08:30:00Z',
      ubicacion: { latitud: 9.9326, longitud: -84.0775 },
      imagen: 'https://example.com/semaforo.jpg',
      votos_positivos: 12,
      votos_negativos: 1,
      comentarios: [{ id: 1, texto: 'Ya lo reporté también' }],
      usuario_id: 1,
    },
    {
      id: 2,
      titulo: 'Fuga de agua en tubería principal',
      descripcion: 'Se observa una fuga considerable de agua potable en la tubería principal, desperdiciando el recurso y creando charcos en la vía.',
      categoria: 'Servicios Públicos',
      estado: 'en_proceso',
      prioridad: 'media',
      fecha_creacion: '2025-11-14T14:20:00Z',
      ubicacion: { latitud: 9.9280, longitud: -84.0830 },
      imagen: null,
      votos_positivos: 8,
      votos_negativos: 0,
      comentarios: [],
      usuario_id: 1,
    },
    {
      id: 3,
      titulo: 'Bache profundo en avenida principal',
      descripcion: 'Bache de gran tamaño que representa peligro para vehículos y motocicletas, especialmente en horas nocturnas.',
      categoria: 'Infraestructura',
      estado: 'nuevo',
      prioridad: 'media',
      fecha_creacion: '2025-11-13T16:45:00Z',
      ubicacion: { latitud: 9.9350, longitud: -84.0820 },
      imagen: 'https://example.com/bache.jpg',
      votos_positivos: 15,
      votos_negativos: 2,
      comentarios: [{ id: 1, texto: 'Muy peligroso' }, { id: 2, texto: 'Urge reparación' }],
      usuario_id: 1,
    },
    {
      id: 4,
      titulo: 'Luminaria pública sin funcionamiento',
      descripcion: 'La luminaria en el parque central no funciona desde hace una semana, afectando la seguridad del área.',
      categoria: 'Seguridad',
      estado: 'nuevo',
      prioridad: 'baja',
      fecha_creacion: '2025-11-12T19:30:00Z',
      ubicacion: { latitud: 9.9300, longitud: -84.0790 },
      imagen: null,
      votos_positivos: 6,
      votos_negativos: 0,
      comentarios: [],
      usuario_id: 1,
    },
  ]);

  // Filtrar reportes del usuario actual
  const filteredUserReports = userReports.filter(report => report.usuario_id === user.id);

  // Actualizar estadísticas basadas en reportes
  useEffect(() => {
    if (!isGuest) {
      const creados = filteredUserReports.length;
      const nuevos = filteredUserReports.filter(r => r.estado === 'nuevo').length;
      const enProceso = filteredUserReports.filter(r => r.estado === 'en_proceso').length;
      const resueltos = filteredUserReports.filter(r => r.estado === 'resuelto').length;
      
      setUser(prev => ({
        ...prev,
        reportesCreados: creados,
        reportesNuevos: nuevos,
        reportesEnProceso: enProceso,
        reportesResueltos: resueltos,
      }));
    }
  }, [isGuest, userReports]);

  const handleLogin = () => {
    Alert.alert('Iniciar Sesión', 'Redirigiendo al login...');
    // navigation.navigate('Login');
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            setIsGuest(true);
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          },
        },
      ]
    );
  };

  const handleMyReports = () => {
    if (isGuest) {
      Alert.alert('Acceso Requerido', 'Debes iniciar sesión para ver tus reportes');
      return;
    }
    Alert.alert('Mis Reportes', 'Navegando a mis reportes...');
  };

  const handleMyData = () => {
    if (isGuest) {
      Alert.alert('Acceso Requerido', 'Debes iniciar sesión para editar tus datos');
      return;
    }
    Alert.alert('Mis Datos', 'Navegando a editar datos...');
  };

  const handleInfoPress = () => {
    Alert.alert('Información', 'Perfil de usuario y configuraciones de la cuenta');
  };

  const handleNotificationPress = () => {
    Alert.alert('Notificaciones', 'Configurar preferencias de notificaciones');
  };

  return (
    <View style={styles.container}>
      <CustomHeader 
        onInfoPress={handleInfoPress}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section - Como en la primera imagen */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            {/* Avatar circular con inicial */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>O</Text>
              </View>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.nombre}</Text>
              {!isGuest && (
                <>
                  <View style={styles.contactInfo}>
                    <MaterialIcons name="email" size={16} color={colors.textGray} />
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <MaterialIcons name="calendar-today" size={16} color={colors.textGray} />
                    <Text style={styles.userDate}>Miembro desde {user.fechaRegistro}</Text>
                  </View>
                </>
              )}
              {isGuest && (
                <Text style={styles.guestText}>Usuario Invitado</Text>
              )}
            </View>
            
            {!isGuest && (
              <TouchableOpacity style={styles.createReportButton} onPress={() => Alert.alert('Crear Reporte')}>
                <Text style={styles.createReportText}>Crear Reporte</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats Cards - Como en la primera imagen: Total, Nuevos, En proceso, Resueltos */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.totalCard]}>
              <Text style={styles.totalNumber}>{user.reportesCreados}</Text>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalSubLabel}>reportes</Text>
            </View>
            
            <View style={[styles.statCard, styles.newCard]}>
              <Text style={styles.newNumber}>{user.reportesNuevos}</Text>
              <Text style={styles.newLabel}>Nuevos</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.processCard]}>
              <Text style={styles.processNumber}>{user.reportesEnProceso}</Text>
              <Text style={styles.processLabel}>En proceso</Text>
            </View>
            
            <View style={[styles.statCard, styles.resolvedCard]}>
              <Text style={styles.resolvedNumber}>{user.reportesResueltos}</Text>
              <Text style={styles.resolvedLabel}>Resueltos</Text>
            </View>
          </View>
        </View>

        {/* Sección de Reportes usando ReportCard */}
        {!isGuest && filteredUserReports.length > 0 && (
          <View style={styles.reportsSection}>
            <View style={styles.reportsSectionHeader}>
              <Text style={styles.sectionTitle}>Mis Reportes</Text>
              <TouchableOpacity onPress={handleMyReports}>
                <Text style={styles.viewAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.reportsGrid}>
              {filteredUserReports.slice(0, 4).map((report) => (
                <View key={report.id} style={styles.reportCardWrapper}>
                  <ReportCard
                    report={report}
                    onPress={(selectedReport) => {
                      Alert.alert('Reporte', `Navegando al detalle de: ${selectedReport.titulo}`);
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Botones Principales - Como en la tercera imagen */}
        <View style={styles.mainButtons}>
          <TouchableOpacity style={styles.mainButton} onPress={handleMyReports}>
            <MaterialIcons name="description" size={20} color={colors.primary} />
            <Text style={styles.mainButtonText}>Mis Reportes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mainButton} onPress={handleMyData}>
            <MaterialIcons name="settings" size={20} color={colors.primary} />
            <Text style={styles.mainButtonText}>Mis Datos</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión - Como en la tercera imagen */}
        {!isGuest && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>✕ Cerrar Sesión</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Profile Section - Header con avatar, nombre y botón
  profileSection: {
    backgroundColor: colors.backgroundWhite,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textWhite,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textGray,
  },
  userDate: {
    fontSize: 14,
    color: colors.textGray,
  },
  guestText: {
    fontSize: 14,
    color: colors.textGray,
    fontStyle: 'italic',
  },
  createReportButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createReportText: {
    fontSize: 14,
    color: colors.textWhite,
    fontWeight: '600',
  },

  // Stats Section - Tarjetas como en la primera imagen
  statsSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Tarjeta Total (azul)
  totalCard: {
    backgroundColor: '#f0f4ff',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  totalNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  totalSubLabel: {
    fontSize: 12,
    color: colors.textGray,
  },
  // Tarjeta Nuevos
  newCard: {
    backgroundColor: '#e6f3ff',
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  newNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  newLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  // Tarjeta En Proceso
  processCard: {
    backgroundColor: '#fff7e6',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  processNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 4,
  },
  processLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  // Tarjeta Resueltos
  resolvedCard: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  resolvedNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 4,
  },
  resolvedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },

  // Reports Section
  reportsSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  reportsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  reportCardWrapper: {
    width: '48%',
  },

  // Main Buttons - Como en la tercera imagen
  mainButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  mainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.backgroundWhite,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },

  // Logout Button - Como en la tercera imagen
  logoutButton: {
    backgroundColor: '#dc2626',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textWhite,
  },
});
