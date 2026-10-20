/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * SETTINGS & OFFLINE AUTO-SYNC MANAGEMENT SCREEN (Section 4.5, 5)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';

export default function SettingsScreen() {
  const {
    language,
    setLanguage,
    isOnline,
    simulateOffline,
    setSimulateOffline,
    syncStatus,
    pendingSyncCount,
    triggerAutoSync,
    mockApiUrl,
    setMockApiUrl,
    resetAllData,
    t,
  } = useFood();

  const [inputUrl, setInputUrl] = useState(mockApiUrl);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSaveApiUrl = async () => {
    await setMockApiUrl(inputUrl.trim());
    Alert.alert('MockAPI URL', 'Updated successfully');
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await triggerAutoSync();
    setIsSyncing(false);
    Alert.alert('Sync Status', isOnline ? t.syncSuccess : t.syncFailed);
  };

  const handleResetData = () => {
    Alert.alert(t.confirmResetTitle, t.confirmResetMessage, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.confirm,
        style: 'destructive',
        onPress: async () => {
          await resetAllData();
          Alert.alert('Reset', t.resetSuccess);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Student & Project Identification Card (Section 1, 2, 3) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="school-outline" size={20} color="#2563EB" />
          <Text style={styles.cardTitle}>{t.studentIdLabel} & Project</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>MSSV:</Text>
          <Text style={styles.infoValueHighlight}>BIT240091</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Project Name:</Text>
          <Text style={styles.infoValue}>BIT240091_FoodManager</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Storage Tables:</Text>
          <Text style={styles.infoValueCode}>BIT240091_Dish, BIT240091_DishCategory</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Framework:</Text>
          <Text style={styles.infoValue}>React Native (Expo SDK 58)</Text>
        </View>
      </View>

      {/* 2. Multilingual Settings (Section 4.5) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="language-outline" size={20} color="#0D9488" />
          <Text style={styles.cardTitle}>{t.languageSection}</Text>
        </View>

        <View style={styles.langSelector}>
          <TouchableOpacity
            style={[styles.langOption, language === 'en' && styles.langOptionSelected]}
            onPress={() => setLanguage('en')}
            activeOpacity={0.7}>
            <Text style={styles.flag}>🇺🇸</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.langName, language === 'en' && styles.langNameSelected]}>
                English (Default)
              </Text>
              <Text style={styles.langDesc}>Mặc định theo đề thi</Text>
            </View>
            <Ionicons
              name={language === 'en' ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={language === 'en' ? '#2563EB' : '#94A3B8'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langOption, language === 'vi' && styles.langOptionSelected]}
            onPress={() => setLanguage('vi')}
            activeOpacity={0.7}>
            <Text style={styles.flag}>🇻🇳</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.langName, language === 'vi' && styles.langNameSelected]}>
                Tiếng Việt
              </Text>
              <Text style={styles.langDesc}>Giao diện tiếng Việt hoàn chỉnh</Text>
            </View>
            <Ionicons
              name={language === 'vi' ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={language === 'vi' ? '#2563EB' : '#94A3B8'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Offline Mode & Automatic Sync (Section 5: Yêu cầu nâng cao 1.5đ) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="cloud-done-outline" size={20} color="#D97706" />
          <Text style={styles.cardTitle}>{t.networkStatusSection}</Text>
        </View>

        {/* Live Status indicator */}
        <View style={styles.statusBox}>
          <View style={styles.statusBoxRow}>
            <View style={[styles.dotLarge, isOnline ? styles.dotOnline : styles.dotOffline]} />
            <Text style={styles.statusBoxTitle}>
              {isOnline ? t.statusOnline : t.statusOffline}
            </Text>
          </View>
          <Text style={styles.statusBoxSubtitle}>
            {syncStatus === 'syncing'
              ? t.statusSyncing
              : pendingSyncCount > 0
              ? `${pendingSyncCount} ${t.pendingChanges}`
              : t.statusSynced}
          </Text>
        </View>

        {/* Simulate Offline Mode Switch */}
        <View style={styles.simulateBox}>
          <View style={styles.simulateTextContainer}>
            <Text style={styles.simulateTitle}>{t.simulateOfflineLabel}</Text>
            <Text style={styles.simulateHelp}>{t.simulateOfflineHelp}</Text>
          </View>
          <Switch
            value={simulateOffline}
            onValueChange={setSimulateOffline}
            trackColor={{ false: '#CBD5E1', true: '#FCD34D' }}
            thumbColor={simulateOffline ? '#D97706' : '#94A3B8'}
          />
        </View>

        {/* MockAPI URL configuration */}
        <View style={styles.apiConfigGroup}>
          <Text style={styles.apiConfigLabel}>{t.mockApiConfigLabel}</Text>
          <Text style={styles.apiConfigHelp}>{t.mockApiHelp}</Text>
          <View style={styles.urlInputRow}>
            <TextInput
              style={styles.urlInput}
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder="https://...mockapi.io/api/v1/..."
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.saveUrlBtn} onPress={handleSaveApiUrl}>
              <Text style={styles.saveUrlBtnText}>{t.save}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Manual Force Sync Button */}
        <TouchableOpacity
          style={[styles.syncButton, !isOnline && styles.syncButtonDisabled]}
          onPress={handleManualSync}
          disabled={!isOnline || isSyncing}>
          {isSyncing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="sync" size={18} color="#FFFFFF" />
          )}
          <Text style={styles.syncButtonText}>{t.syncNowButton}</Text>
        </TouchableOpacity>
      </View>

      {/* 4. Reset Data Section */}
      <View style={[styles.card, { marginBottom: 40 }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="refresh-circle-outline" size={20} color="#EF4444" />
          <Text style={styles.cardTitle}>{t.resetDataLabel}</Text>
        </View>
        <Text style={styles.resetHelpText}>
          Khôi phục lại dữ liệu mẫu gồm 04 loại món và 06 món ăn ban đầu để tiện demo chấm bài.
        </Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetData}>
          <Ionicons name="trash-bin-outline" size={18} color="#DC2626" />
          <Text style={styles.resetButtonText}>{t.resetDataButton}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  infoValueHighlight: {
    fontSize: 15,
    color: '#1D4ED8',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  infoValueCode: {
    fontSize: 11,
    color: '#334155',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  langSelector: {
    gap: 10,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  langOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  flag: {
    fontSize: 24,
  },
  langName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  langNameSelected: {
    color: '#1D4ED8',
  },
  langDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statusBox: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  statusBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOnline: {
    backgroundColor: '#10B981',
  },
  dotOffline: {
    backgroundColor: '#F59E0B',
  },
  statusBoxTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBoxSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 18,
  },
  simulateBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 14,
  },
  simulateTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  simulateTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  simulateHelp: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 16,
  },
  apiConfigGroup: {
    marginBottom: 14,
  },
  apiConfigLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2,
  },
  apiConfigHelp: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
  },
  urlInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0F172A',
  },
  saveUrlBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveUrlBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  syncButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  resetHelpText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  resetButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
});

