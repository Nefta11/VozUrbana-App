import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';

const TabButtons = ({ activeTab, onReportsPress, onDataPress }) => {
  return (
    <View
      style={[
        styles.mainButtons,
        activeTab === 'datos' && styles.mainButtonsExtraMargin,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.mainButton,
          activeTab === 'reportes' && styles.mainButtonActive,
        ]}
        onPress={onReportsPress}
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
        onPress={onDataPress}
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
  );
};

const styles = StyleSheet.create({
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
});

export default TabButtons;
