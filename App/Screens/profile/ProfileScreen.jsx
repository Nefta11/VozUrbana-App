import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../utils/colors';
import CustomHeader from '../../Components/navigation/CustomHeader';
import ReportCard from '../../Components/ReportCard/ReportCard';
import CustomConfirmAlert from '../../Components/generals/CustomConfirmAlert';
import LoadingModal from '../../Components/generals/LoadingModal';
import CustomAlert from '../../Components/generals/CustomAlert';
import ProfileHeader from '../../Components/profile/ProfileHeader';
import StatsCards from '../../Components/profile/StatsCards';
import UserDataForm from '../../Components/profile/UserDataForm';
import TabButtons from '../../Components/profile/TabButtons';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useProfileForm } from '../../hooks/useProfileForm';
import { mockUserReports } from '../../data/mockReports';

export default function ProfileScreen({ navigation }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const isGuest = !isAuthenticated || !user;
  const isAdmin = user?.role === 'admin';

  // Estado para CustomConfirmAlert
  const [alertVisible, setAlertVisible] = useState(false);

  // Estado para controlar tab activo (reportes o datos)
  const [activeTab, setActiveTab] = useState('reportes');

  // Reportes del usuario (mock data)
  const [userReports] = useState(mockUserReports);

  // Hook personalizado para el formulario
  const {
    formNombre,
    setFormNombre,
    formEmail,
    setFormEmail,
    formFechaNacimiento,
    showDatePicker,
    loadingVisible,
    successAlertVisible,
    handleUpdateData,
    onDateChange,
    formatDate,
    closeSuccessAlert,
    openDatePicker,
  } = useProfileForm(user);

  const handleLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleLogout = useCallback(() => {
    setAlertVisible(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    setAlertVisible(false);
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
    setTimeout(() => {
      showToast('Cerraste sesión correctamente', 'info');
    }, 500);
  }, [logout, navigation, showToast]);

  const cancelLogout = useCallback(() => {
    setAlertVisible(false);
  }, []);

  const handleCreateReport = useCallback(() => {
    if (isGuest) {
      Alert.alert('Acceso Requerido', 'Debes iniciar sesión para crear un reporte');
      return;
    }
    navigation.navigate('CreateReport');
  }, [isGuest, navigation]);

  const handleMyReports = useCallback(() => {
    if (isGuest) {
      Alert.alert('Acceso Requerido', 'Debes iniciar sesión para ver tus reportes');
      return;
    }
    setActiveTab('reportes');
  }, [isGuest]);

  const handleViewAllReports = useCallback(() => {
    navigation.navigate('Reports');
  }, [navigation]);

  const handleMyData = useCallback(() => {
    if (isGuest) {
      Alert.alert('Acceso Requerido', 'Debes iniciar sesión para editar tus datos');
      return;
    }
    setActiveTab('datos');
  }, [isGuest]);

  const handleReportPress = useCallback(
    (report) => {
      navigation.navigate('ReportDetail', { reportId: report.id });
    },
    [navigation]
  );

  const handleInfoPress = useCallback(() => {
    Alert.alert('Información', 'Perfil de usuario y configuraciones de la cuenta');
  }, []);

  const handleNotificationPress = useCallback(() => {
    Alert.alert('Notificaciones', 'Configurar preferencias de notificaciones');
  }, []);

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
        <ProfileHeader
          user={user}
          isGuest={isGuest}
          isAdmin={isAdmin}
          onCreateReport={handleCreateReport}
          onLogin={handleLogin}
        />

        {/* Contenido solo para usuarios normales (no admin) */}
        {!isAdmin && (
          <>
            {/* Contenido de Mis Reportes */}
            {activeTab === 'reportes' && (
              <>
                <StatsCards reports={userReports} isGuest={isGuest} />

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
              <UserDataForm
                formNombre={formNombre}
                setFormNombre={setFormNombre}
                formEmail={formEmail}
                setFormEmail={setFormEmail}
                formFechaNacimiento={formFechaNacimiento}
                showDatePicker={showDatePicker}
                onDateChange={onDateChange}
                formatDate={formatDate}
                openDatePicker={openDatePicker}
                onUpdate={handleUpdateData}
              />
            )}

            <TabButtons
              activeTab={activeTab}
              onReportsPress={handleMyReports}
              onDataPress={handleMyData}
            />
          </>
        )}

        {/* Botón de cerrar sesión */}
        {!isGuest && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>✕ Cerrar Sesion</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

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

      <LoadingModal visible={loadingVisible} message="Actualizando..." />

      <CustomAlert
        visible={successAlertVisible}
        title="Éxito"
        message="Actualizado correctamente"
        type="success"
        onClose={closeSuccessAlert}
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
