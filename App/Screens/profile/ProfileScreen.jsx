import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../utils/colors';
import CustomHeader from '../../Components/navigation/CustomHeader';
import ReportCard from '../../Components/ReportCard/ReportCard';
import CustomConfirmAlert from '../../Components/generals/CustomConfirmAlert';
import LoadingModal from '../../Components/generals/LoadingModal';
import CustomAlert from '../../Components/generals/CustomAlert';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const isGuest = !isAuthenticated || !user;

  // Estado para CustomConfirmAlert
  const [alertVisible, setAlertVisible] = useState(false);

  // Estado para controlar tab activo (reportes o datos)
  const [activeTab, setActiveTab] = useState('reportes');

  // Estados para el formulario de Mis Datos
  const [formNombre, setFormNombre] = useState(user?.nombre || '');
  const [formEmail, setFormEmail] = useState(user?.email || '');
  const [formFechaNacimiento, setFormFechaNacimiento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Estados para LoadingModal y CustomAlert de éxito
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);

  // Reportes de ejemplo del usuario (formato compatible con ReportCard)
  const [userReports] = useState([
    {
      id: 1,
      titulo: 'Semáforo dañado en intersección principal',
      descripcion: 'El semáforo ubicado en la intersección de Av. Central con Calle 15 presenta fallas intermitentes, causando riesgo para peatones y conductores.',
      categoria: 'infraestructura',
      estado: 'resuelto',
      prioridad: 'alta',
      fecha_creacion: '2025-11-15T08:30:00Z',
      ubicacion: 'Av. Central con Calle 15, Centro',
      latitud: 20.2745,
      longitud: -97.9557,
      imagen: null,
      votos_positivos: 12,
      votos_negativos: 1,
      comentarios: [{ id: 1, texto: 'Ya lo reporté también' }],
    },
    {
      id: 2,
      titulo: 'Fuga de agua en tubería principal',
      descripcion: 'Se observa una fuga considerable de agua potable en la tubería principal, desperdiciando el recurso y creando charcos en la vía.',
      categoria: 'servicios',
      estado: 'en_proceso',
      prioridad: 'media',
      fecha_creacion: '2025-11-14T14:20:00Z',
      ubicacion: 'Calle Hidalgo #234, Col. Norte',
      latitud: 20.2755,
      longitud: -97.9567,
      imagen: null,
      votos_positivos: 8,
      votos_negativos: 0,
      comentarios: [],
    },
    {
      id: 3,
      titulo: 'Bache profundo en avenida principal',
      descripcion: 'Bache de gran tamaño que representa peligro para vehículos y motocicletas, especialmente en horas nocturnas.',
      categoria: 'infraestructura',
      estado: 'nuevo',
      prioridad: 'media',
      fecha_creacion: '2025-11-13T16:45:00Z',
      ubicacion: 'Av. Revolución #456, Centro',
      latitud: 20.2735,
      longitud: -97.9547,
      imagen: null,
      votos_positivos: 15,
      votos_negativos: 2,
      comentarios: [{ id: 1, texto: 'Muy peligroso' }, { id: 2, texto: 'Urge reparación' }],
    },
    {
      id: 4,
      titulo: 'Luminaria pública sin funcionamiento',
      descripcion: 'La luminaria en el parque central no funciona desde hace una semana, afectando la seguridad del área.',
      categoria: 'seguridad',
      estado: 'nuevo',
      prioridad: 'baja',
      fecha_creacion: '2025-11-12T19:30:00Z',
      ubicacion: 'Parque Central, Centro',
      latitud: 20.2725,
      longitud: -97.9537,
      imagen: null,
      votos_positivos: 6,
      votos_negativos: 0,
      comentarios: [],
    },
  ]);

  // Calcular estadísticas de forma optimizada con useMemo
  const reportStats = useMemo(() => {
    if (isGuest) {
      return {
        reportesCreados: 0,
        reportesNuevos: 0,
        reportesEnProceso: 0,
        reportesResueltos: 0,
      };
    }

    // Calcular todo en un solo loop para mejor rendimiento
    const stats = userReports.reduce(
      (acc, report) => {
        acc.reportesCreados++;
        if (report.estado === 'nuevo') acc.reportesNuevos++;
        else if (report.estado === 'en_proceso') acc.reportesEnProceso++;
        else if (report.estado === 'resuelto') acc.reportesResueltos++;
        return acc;
      },
      {
        reportesCreados: 0,
        reportesNuevos: 0,
        reportesEnProceso: 0,
        reportesResueltos: 0,
      }
    );

    return stats;
  }, [isGuest, userReports]);

  // Función para obtener la inicial del primer nombre
  const getUserInitial = () => {
    if (isGuest || !user?.nombre) return 'U';
    return user.nombre.charAt(0).toUpperCase();
  };

  // Función para formatear la fecha de registro
  const getFormattedDate = () => {
    if (isGuest || !user?.fechaRegistro) return '';
    const date = new Date(user.fechaRegistro);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleLogout = () => {
    setAlertVisible(true);
  };
  
  const confirmLogout = async () => {
    setAlertVisible(false);
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
    setTimeout(() => {
      showToast('Cerraste sesión correctamente', 'info');
    }, 500);
  };
  
  const cancelLogout = () => {
    setAlertVisible(false);
  };

  const handleCreateReport = () => {
    if (isGuest) {
      Alert.alert('Acceso Requerido', 'Debes iniciar sesión para crear un reporte');
      return;
    }
    navigation.navigate('CreateReport');
  };

  const handleMyReports = () => {
    if (isGuest) {
      Alert.alert('Acceso Requerido', 'Debes iniciar sesión para ver tus reportes');
      return;
    }
    setActiveTab('reportes');
  };

  const handleViewAllReports = () => {
    navigation.navigate('Reports');
  };

  const handleMyData = () => {
    if (isGuest) {
      Alert.alert('Acceso Requerido', 'Debes iniciar sesión para editar tus datos');
      return;
    }
    setActiveTab('datos');
  };

  const handleUpdateData = async () => {
    setLoadingVisible(true);
    // Simular llamada a API
    setTimeout(() => {
      setLoadingVisible(false);
      setSuccessAlertVisible(true);
    }, 2000);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormFechaNacimiento(selectedDate);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleReportPress = (report) => {
    navigation.navigate('ReportDetail', { reportId: report.id });
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
        {/* Profile Header Section - Layout horizontal como en la imagen */}
        <View style={styles.profileSection}>
          {/* Avatar y información del usuario lado a lado */}
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>{getUserInitial()}</Text>
            </View>
            
            {/* Columna de información del usuario */}
            <View style={styles.userInfoColumn}>
              <Text style={styles.userName}>
                {isGuest ? 'Usuario Invitado' : user?.nombre || 'Usuario'}
              </Text>
              
              {!isGuest && user && (
                <>
                  <View style={styles.contactInfo}>
                    <MaterialIcons name="person" size={16} color={colors.textGray} />
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <MaterialIcons name="calendar-today" size={16} color={colors.textGray} />
                    <Text style={styles.userDate}>Miembro desde {getFormattedDate()}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
          
          {/* Botón Crear Reporte abajo de todo */}
          {!isGuest && (
            <TouchableOpacity style={styles.createReportButton} onPress={handleCreateReport}>
              <Text style={styles.createReportText}>Crear Reporte</Text>
            </TouchableOpacity>
          )}
          
          {isGuest && (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Contenido de Mis Reportes */}
        {activeTab === 'reportes' && (
          <>
            {/* Stats Cards - 4 cards blancas separadas */}
            <View style={styles.statsSection}>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{reportStats.reportesCreados}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                  <Text style={styles.statSubLabel}>reportes</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{reportStats.reportesNuevos}</Text>
                  <Text style={styles.statLabel}>Nuevos</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{reportStats.reportesEnProceso}</Text>
                  <Text style={styles.statLabel}>En proceso</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{reportStats.reportesResueltos}</Text>
                  <Text style={styles.statLabel}>Resueltos</Text>
                </View>
              </View>
            </View>

            {/* Sección de Reportes usando ReportCard */}
            {!isGuest && userReports.length > 0 && (
              <View style={styles.reportsSection}>
                <View style={styles.reportsSectionHeader}>
                  <Text style={styles.sectionTitle}>Mis Reportes</Text>
                  <TouchableOpacity onPress={handleViewAllReports}>
                    <Text style={styles.viewAllText}>Ver todos</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.reportsGrid}>
                  {userReports.slice(0, 4).map((report) => (
                    <View key={report.id} style={styles.reportCardWrapper}>
                      <ReportCard report={report} onPress={handleReportPress} />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* Contenido de Mis Datos */}
        {activeTab === 'datos' && (
          <View style={styles.myDataSection}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nombre:</Text>
              <TextInput
                style={styles.formInput}
                value={formNombre}
                onChangeText={setFormNombre}
                placeholder="Tu nombre"
                placeholderTextColor={colors.textGray}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email:</Text>
              <TextInput
                style={styles.formInput}
                value={formEmail}
                onChangeText={setFormEmail}
                placeholder="tu@email.com"
                placeholderTextColor={colors.textGray}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Fecha de Nacimiento:</Text>
              <TouchableOpacity
                style={styles.formInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(formFechaNacimiento)}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formFechaNacimiento}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateData}>
              <Text style={styles.updateButtonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Botones Principales - Mis Reportes / Mis Datos */}
        <View style={[styles.mainButtons, activeTab === 'datos' && styles.mainButtonsExtraMargin]}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              activeTab === 'reportes' && styles.mainButtonActive,
            ]}
            onPress={handleMyReports}
          >
            <MaterialIcons
              name="description"
              size={20}
              color={activeTab === 'reportes' ? colors.textWhite : colors.primary}
            />
            <Text
              style={[
                styles.mainButtonText,
                activeTab === 'reportes' && styles.mainButtonTextActive,
              ]}
            >
              Mis Reportes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mainButton,
              activeTab === 'datos' && styles.mainButtonActive,
            ]}
            onPress={handleMyData}
          >
            <MaterialIcons
              name="settings"
              size={20}
              color={activeTab === 'datos' ? colors.textWhite : colors.primary}
            />
            <Text
              style={[
                styles.mainButtonText,
                activeTab === 'datos' && styles.mainButtonTextActive,
              ]}
            >
              Mis Datos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión - Como en la imagen */}
        {!isGuest && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>✕ Cerrar Sesion</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      {/* CustomConfirmAlert para confirmación de logout */}
      <CustomConfirmAlert
        visible={alertVisible}
        title="Cerrar Sesión"
        message="¿Estás seguro que deseas cerrar sesión?"
        type="warning"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />

      {/* LoadingModal para actualización de datos */}
      <LoadingModal visible={loadingVisible} message="Actualizando..." />

      {/* CustomAlert para éxito en actualización */}
      <CustomAlert
        visible={successAlertVisible}
        title="Éxito"
        message="Actualizado correctamente"
        type="success"
        onClose={() => setSuccessAlertVisible(false)}
        confirmText="Entendido"
      />
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

  // Profile Section - Header con layout horizontal como en la imagen
  profileSection: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    width: 80, // Avatar más grande
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitial: {
    fontSize: 32, // Letra más grande para el avatar más grande
    fontWeight: '700',
    color: colors.textWhite,
  },
  userInfoColumn: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    lineHeight: 28,
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textGray,
  },
  userDate: {
    fontSize: 14,
    color: colors.textGray,
  },
  createReportButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  createReportText: {
    fontSize: 14,
    color: colors.textWhite,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  loginButtonText: {
    fontSize: 12,
    color: colors.textWhite,
    fontWeight: '600',
  },

  // Stats Section - 4 cards blancas uniformes como en la imagen
  statsSection: {
    marginHorizontal: 16,
    marginTop: 24,
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
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary, // Número azul
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark, // Texto negro
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: 'center',
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

  // Main Buttons - Como en la imagen
  mainButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  mainButtonsExtraMargin: {
    marginTop: 40,
  },
  mainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.backgroundWhite,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  mainButtonActive: {
    backgroundColor: colors.primary,
  },
  mainButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  mainButtonTextActive: {
    color: colors.textWhite,
  },

  // My Data Form Section
  myDataSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.borderLight || '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    color: colors.textDark,
  },
  updateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textWhite,
  },

  // Logout Button - Como en la imagen
  logoutButton: {
    backgroundColor: '#dc2626',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textWhite,
  },
});
