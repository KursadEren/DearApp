import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function SettingsScreen() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);

  return (
    <SafeAreaView style={[styles.container, isDarkTheme && styles.darkContainer]}>
      <Text style={[styles.header, isDarkTheme && styles.darkText]}>Ayarlar</Text>

      {/* Tema Seçimi */}
      <View style={styles.settingContainer}>
        <Text style={[styles.settingText, isDarkTheme && styles.darkText]}>Tema</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Text style={styles.themeButtonText}>
            {isDarkTheme ? 'Koyu Tema' : 'Açık Tema'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bildirimler */}
      <View style={styles.settingContainer}>
        <Text style={[styles.settingText, isDarkTheme && styles.darkText]}>Bildirimler</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleNotifications}
          value={notificationsEnabled}
        />
      </View>

      {/* Diğer Ayarlar */}
      <View style={styles.settingContainer}>
        <Text style={[styles.settingText, isDarkTheme && styles.darkText]}>Uygulama Dili</Text>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Türkçe</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingContainer}>
        <Text style={[styles.settingText, isDarkTheme && styles.darkText]}>Veri Tasarrufu Modu</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          value={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f8fc', // Açık tema arka plan rengi
  },
  darkContainer: {
    backgroundColor: '#333', // Koyu tema arka plan rengi
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  darkText: {
    color: '#fff', // Koyu tema için beyaz metin
  },
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingText: {
    fontSize: 18,
    color: '#333',
  },
  themeButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  themeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  optionText: {
    color: '#333',
    fontSize: 16,
  },
});
