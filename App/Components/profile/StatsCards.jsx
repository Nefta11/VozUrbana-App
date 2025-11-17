import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';

const StatsCards = ({ reports, isGuest }) => {
  const stats = useMemo(() => {
    if (isGuest) {
      return {
        reportesCreados: 0,
        reportesNuevos: 0,
        reportesEnProceso: 0,
        reportesResueltos: 0,
      };
    }

    return reports.reduce(
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
  }, [isGuest, reports]);

  return (
    <View style={styles.statsSection}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.reportesCreados}</Text>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statSubLabel}>reportes</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.reportesNuevos}</Text>
          <Text style={styles.statLabel}>Nuevos</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.reportesEnProceso}</Text>
          <Text style={styles.statLabel}>En proceso</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.reportesResueltos}</Text>
          <Text style={styles.statLabel}>Resueltos</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 12,
    color: colors.textGray,
    textAlign: 'center',
  },
});

export default StatsCards;
