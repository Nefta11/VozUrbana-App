import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export const useProfileForm = (user) => {
  const [formNombre, setFormNombre] = useState(user?.nombre || '');
  const [formEmail, setFormEmail] = useState(user?.email || '');
  const [formFechaNacimiento, setFormFechaNacimiento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);

  // Sincronizar estados cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setFormNombre(user.nombre || '');
      setFormEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateData = useCallback(async () => {
    setLoadingVisible(true);
    // Simular llamada a API
    setTimeout(() => {
      setLoadingVisible(false);
      setSuccessAlertVisible(true);
    }, 2000);
  }, []);

  const onDateChange = useCallback((event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormFechaNacimiento(selectedDate);
    }
  }, []);

  const formatDate = useCallback((date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const closeSuccessAlert = useCallback(() => {
    setSuccessAlertVisible(false);
  }, []);

  const openDatePicker = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  return {
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
  };
};
