/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * DISH CARD COMPONENT
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
  const { getCategoryById, t } = useFood();
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
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          onError={() => setImageError(true)}
          resizeMode="cover"
        />
        {/* Badge Quick/Regular dựa theo PreparationTime <= 15 phút (Section 4.3) */}
        <View style={[styles.timeBadge, prepType === 'quick' ? styles.quickBadge : styles.regularBadge]}>
          <Ionicons
            name={prepType === 'quick' ? 'flash' : 'time-outline'}
            size={12}
            color="#FFFFFF"
          />
          <Text style={styles.timeBadgeText}>
            {prepType === 'quick' ? t.quickDish : t.regularDish} ({dish.BIT240091_PreparationTime}m)
          </Text>
        </View>

        {/* Sync status indicator if offline changed */}
        {dish.BIT240091_SyncStatus && dish.BIT240091_SyncStatus !== 'synced' && (
          <View style={styles.syncBadge}>
            <Ionicons name="cloud-offline" size={11} color="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.categoryText}>
            {category ? category.BIT240091_Name : 'Category'}
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

        <Text style={styles.name} numberOfLines={2}>
          {dish.BIT240091_Name}
        </Text>

        {dish.BIT240091_Description ? (
          <Text style={styles.description} numberOfLines={2}>
            {dish.BIT240091_Description}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <Text style={styles.price}>
            {dish.BIT240091_Price.toLocaleString('vi-VN')} ₫
          </Text>
          <View style={styles.viewDetail}>
            <Text style={styles.viewDetailText}>{t.dishDetailTitle}</Text>
            <Ionicons name="chevron-forward" size={14} color="#2563EB" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  cardUnavailable: {
    opacity: 0.82,
    borderColor: '#E2E8F0',
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  timeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  quickBadge: {
    backgroundColor: '#059669', // Xanh lá đậm cho Quick
  },
  regularBadge: {
    backgroundColor: '#2563EB', // Xanh dương cho Regular
  },
  timeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  syncBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#D97706',
    borderRadius: 12,
    padding: 6,
  },
  content: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusPill: {
    paddingHorizontal: 8,
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
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextAvailable: {
    color: '#059669',
  },
  statusTextUnavailable: {
    color: '#DC2626',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#DC2626',
  },
  viewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
});

