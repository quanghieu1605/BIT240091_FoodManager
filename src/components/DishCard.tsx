/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * DISH CARD COMPONENT
 * Thiết kế nằm ngang: Ảnh bên TRÁI hiển thị FULL không bị cắt, thông tin bên PHẢI
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';
import { BIT240091_Dish, getPreparationTimeType } from '@/types/dish';

interface DishCardProps {
  dish: BIT240091_Dish;
  onPress: () => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1495195129352-aeb325a55b65?w=500&auto=format&fit=crop&q=60';

export const DishCard: React.FC<DishCardProps> = ({ dish, onPress }) => {
  const { getCategoryById, getCategoryDisplayName, t } = useFood();
  const [imageError, setImageError] = useState(false);

  const category = getCategoryById(dish.BIT240091_DishCategoryId);
  const prepType = getPreparationTimeType(dish.BIT240091_PreparationTime);

  // Tìm ảnh thumbnail (IsThumbnail = true), nếu không có thì lấy ảnh đầu tiên
  const thumbnailObj =
    dish.BIT240091_DishImages?.find((img) => img.BIT240091_IsThumbnail) ||
    dish.BIT240091_DishImages?.[0];

  const imageUri = !imageError && thumbnailObj?.BIT240091_ImageUrl
    ? thumbnailObj.BIT240091_ImageUrl
    : DEFAULT_IMAGE;

  return (
    <TouchableOpacity
      style={[styles.card, !dish.BIT240091_IsAvailable && styles.cardUnavailable]}
      onPress={onPress}
      activeOpacity={0.8}>
      {/* 1. KHỐI ẢNH BÊN TRÁI: Hiển thị Full ảnh (contain), không bị cắt */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          onError={() => setImageError(true)}
          resizeMode="contain"
        />

        {/* Sync status indicator if offline changed */}
        {dish.BIT240091_SyncStatus && dish.BIT240091_SyncStatus !== 'synced' && (
          <View style={styles.syncBadge}>
            <Ionicons name="cloud-offline" size={10} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* 2. KHỐI THÔNG TIN BÊN PHẢI */}
      <View style={styles.content}>
        {/* Category & Availability Status */}
        <View style={styles.headerRow}>
          <Text style={styles.categoryText} numberOfLines={1}>
            {category ? getCategoryDisplayName(category) : t.category}
          </Text>
          <View
            style={[
              styles.statusPill,
              dish.BIT240091_IsAvailable ? styles.statusAvailable : styles.statusUnavailable,
            ]}>
            <Text
              style={[
                styles.statusText,
                dish.BIT240091_IsAvailable ? styles.statusTextAvailable : styles.statusTextUnavailable,
              ]}>
              {dish.BIT240091_IsAvailable ? t.available : t.unavailable}
            </Text>
          </View>
        </View>

        {/* Dish Name */}
        <Text style={styles.name} numberOfLines={2}>
          {dish.BIT240091_Name}
        </Text>

        {/* Quick / Regular Badge & Prep Time */}
        <View style={styles.badgeRow}>
          <View style={[styles.timeBadge, prepType === 'quick' ? styles.quickBadge : styles.regularBadge]}>
            <Ionicons
              name={prepType === 'quick' ? 'flash' : 'time-outline'}
              size={11}
              color="#FFFFFF"
            />
            <Text style={styles.timeBadgeText}>
              {prepType === 'quick' ? t.quickDish : t.regularDish} • {dish.BIT240091_PreparationTime} {t.minutes}
            </Text>
          </View>
        </View>

        {/* Price & Action */}
        <View style={styles.footerRow}>
          <Text style={styles.price}>
            {dish.BIT240091_Price.toLocaleString('vi-VN')} ₫
          </Text>
          <View style={styles.viewDetail}>
            <Ionicons name="chevron-forward-circle" size={20} color="#2563EB" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  cardUnavailable: {
    opacity: 0.8,
    borderColor: '#E2E8F0',
  },
  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  syncBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#D97706',
    borderRadius: 10,
    padding: 4,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    minHeight: 110,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  categoryText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 6,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusAvailable: {
    backgroundColor: '#ECFDF5',
  },
  statusUnavailable: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextAvailable: {
    color: '#059669',
  },
  statusTextUnavailable: {
    color: '#DC2626',
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  quickBadge: {
    backgroundColor: '#059669',
  },
  regularBadge: {
    backgroundColor: '#2563EB',
  },
  timeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: '#DC2626',
  },
  viewDetail: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
