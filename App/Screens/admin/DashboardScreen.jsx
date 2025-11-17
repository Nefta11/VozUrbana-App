import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import CustomHeader from '../../Components/navigation/CustomHeader';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <CustomHeader />
      <View style={styles.content}>
        <MaterialIcons name="dashboard" size={80} color={colors.primary} />
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Panel de métricas en desarrollo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textGray,
    textAlign: 'center',
  },
});
