/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * STUDENT BANNER & TOP STATUS BAR
 * Thể hiện rõ MSSV và tên project trên giao diện người dùng
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';

interface StudentBannerProps {
  showActions?: boolean;
  onOpenCategories?: () => void;
  onOpenSettings?: () => void;
}

export const StudentBanner: React.FC<StudentBannerProps> = ({
  showActions = true,
  onOpenCategories,
  onOpenSettings,
}) => {
  const { language, toggleLanguage, isOnline, pendingSyncCount, t } = useFood();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.idBadge}>
          <Text style={styles.idLabel}>MSSV: </Text>
          <Text style={styles.idValue}>BIT240091</Text>
        </View>

        <View style={styles.statusGroup}>
          {/* Network status pill */}
          <View style={[styles.networkPill, isOnline ? styles.onlinePill : styles.offlinePill]}>
            <View style={[styles.dot, isOnline ? styles.onlineDot : styles.offlineDot]} />
            <Text style={[styles.networkText, isOnline ? styles.onlineText : styles.offlineText]}>
              {isOnline ? t.statusOnline : t.statusOffline}
            </Text>
            {pendingSyncCount > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>{pendingSyncCount}</Text>
              </View>
            )}
          </View>

          {/* Language toggle button: hiển thị đúng ngôn ngữ hiện tại */}
          <TouchableOpacity
            style={styles.langButton}
            onPress={toggleLanguage}
            activeOpacity={0.7}
            accessibilityLabel="Switch Language">
            <Ionicons name="globe-outline" size={14} color="#0284C7" />
            <Text style={styles.langText}>{language === 'en' ? 'EN' : 'VI'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>{t.appName}</Text>
          <Text style={styles.projectSubtitle}>BIT240091_FoodManager</Text>
        </View>

        {showActions && (
          <View style={styles.actionsContainer}>
            {onOpenCategories && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onOpenCategories}
                activeOpacity={0.7}
                accessibilityLabel="Categories">
                <Ionicons name="grid-outline" size={20} color="#334155" />
              </TouchableOpacity>
            )}

            {onOpenSettings && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onOpenSettings}
                activeOpacity={0.7}
                accessibilityLabel="Settings">
                <Ionicons name="settings-outline" size={20} color="#334155" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  idLabel: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
  },
  idValue: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  networkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlinePill: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  offlinePill: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  onlineDot: {
    backgroundColor: '#10B981',
  },
  offlineDot: {
    backgroundColor: '#F59E0B',
  },
  networkText: {
    fontSize: 11,
    fontWeight: '600',
  },
  onlineText: {
    color: '#065F46',
  },
  offlineText: {
    color: '#92400E',
  },
  pendingBadge: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 4,
  },
  pendingText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 4,
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  projectSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
