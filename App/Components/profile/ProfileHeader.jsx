import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';

const ProfileHeader = ({
  user,
  isGuest,
  onCreateReport,
  onLogin,
  isAdmin = false,
}) => {
  const getUserInitial = () => {
    if (isGuest || !user?.nombre) return 'U';
    return user.nombre.charAt(0).toUpperCase();
  };

  const getFormattedDate = () => {
    if (isGuest || !user?.fechaRegistro) return '';
    const date = new Date(user.fechaRegistro);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.profileSection}>
      <View style={styles.profileHeaderRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{getUserInitial()}</Text>
        </View>

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

      {!isGuest && !isAdmin && (
        <TouchableOpacity style={styles.createReportButton} onPress={onCreateReport}>
          <Text style={styles.createReportText}>Crear Reporte</Text>
        </TouchableOpacity>
      )}

      {isGuest && (
        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitial: {
    fontSize: 32,
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
});

export default ProfileHeader;
