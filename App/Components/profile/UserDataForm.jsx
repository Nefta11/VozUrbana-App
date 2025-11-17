import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../utils/colors';

const UserDataForm = ({
  formNombre,
  setFormNombre,
  formEmail,
  setFormEmail,
  formFechaNacimiento,
  showDatePicker,
  onDateChange,
  formatDate,
  openDatePicker,
  onUpdate,
}) => {
  return (
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
        <TouchableOpacity style={styles.formInput} onPress={openDatePicker}>
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

      <TouchableOpacity style={styles.updateButton} onPress={onUpdate}>
        <Text style={styles.updateButtonText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default UserDataForm;
