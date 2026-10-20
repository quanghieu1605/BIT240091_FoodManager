/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * DISH DETAIL SCREEN (Section 4.1, 4.3, 4.4)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';
import { getPreparationTimeType } from '@/types/dish';

const { width } = Dimensions.get('window');
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1495195129352-aeb325a55b65?w=600&auto=format&fit=crop&q=60';

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getDishById, getCategoryById, getCategoryDisplayName, deleteDish, setThumbnailImage, t } = useFood();

  const dish = getDishById(id || '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Xử lý khi Id không tồn tại (Section 4.4)
  if (!dish) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={styles.notFoundTitle}>{t.dishNotFound}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          <Text style={styles.backButtonText}>{t.back}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const category = getCategoryById(dish.BIT240091_DishCategoryId);
  const prepType = getPreparationTimeType(dish.BIT240091_PreparationTime);
  const images = dish.BIT240091_DishImages && dish.BIT240091_DishImages.length > 0
    ? dish.BIT240091_DishImages
    : [{ BIT240091_ImageUrl: DEFAULT_IMAGE, BIT240091_IsThumbnail: true }];

  const currentSelectedImage = images[activeImageIndex] || images[0];

  // Xử lý xác nhận xóa món ăn (Section 4.1)
  const handleDelete = () => {
    Alert.alert(
      t.confirmDeleteDishTitle,
      t.confirmDeleteDishMessage.replace('{name}', dish.BIT240091_Name),
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            const res = await deleteDish(dish.BIT240091_Id);
            if (res.success) {
              router.back();
            } else {
              Alert.alert(t.validationError, res.error);
            }
          },
        },
      ]
    );
  };

  // Xử lý đặt ảnh làm thumbnail (Section 4.3: thay đổi ảnh đại diện, tối đa 1 thumbnail = true)
  const handleSetThumbnail = async (imageUrl: string) => {
    await setThumbnailImage(dish.BIT240091_Id, imageUrl);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Large Active Image Preview */}
      <View style={styles.heroImageContainer}>
        <Image
          source={{ uri: currentSelectedImage.BIT240091_ImageUrl || DEFAULT_IMAGE }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Badge Quick / Regular (Section 4.3) */}
        <View
          style={[
            styles.timeBadge,
            prepType === 'quick' ? styles.quickBadge : styles.regularBadge,
          ]}>
          <Ionicons
            name={prepType === 'quick' ? 'flash' : 'time-outline'}
            size={14}
            color="#FFFFFF"
          />
          <Text style={styles.timeBadgeText}>
            {prepType === 'quick' ? t.quickDish : t.regularDish} • {dish.BIT240091_PreparationTime} {t.minutes}
          </Text>
        </View>

        {/* Thumbnail badge on active image */}
        {currentSelectedImage.BIT240091_IsThumbnail && (
          <View style={styles.thumbnailActivePill}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.thumbnailActiveText}>{t.isThumbnail}</Text>
          </View>
        )}
      </View>

      {/* 2. Multi-image gallery list & Thumbnail Selector (Section 4.3) */}
      <View style={styles.gallerySection}>
        <View style={styles.galleryHeader}>
          <Text style={styles.sectionHeading}>{t.imagesGallery} • {images.length}</Text>
          {!currentSelectedImage.BIT240091_IsThumbnail && (
            <TouchableOpacity
              style={styles.setThumbnailBtn}
              onPress={() => handleSetThumbnail(currentSelectedImage.BIT240091_ImageUrl)}>
              <Ionicons name="star-outline" size={14} color="#D97706" />
              <Text style={styles.setThumbnailText}>{t.setAsThumbnail}</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailList}>
          {images.map((img, index) => {
            const isSelected = activeImageIndex === index;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnailCard,
                  isSelected && styles.thumbnailCardSelected,
                ]}
                onPress={() => setActiveImageIndex(index)}>
                <Image
                  source={{ uri: img.BIT240091_ImageUrl }}
                  style={styles.thumbnailImg}
                />
                {img.BIT240091_IsThumbnail && (
                  <View style={styles.starBadgeSmall}>
                    <Ionicons name="star" size={10} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Main Dish Information Card */}
      <View style={styles.infoCard}>
        <View style={styles.categoryRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {category ? getCategoryDisplayName(category) : t.category}
            </Text>
          </View>

          <View
            style={[
              styles.statusPill,
              dish.BIT240091_IsAvailable ? styles.statusAvailable : styles.statusUnavailable,
            ]}>
            <Ionicons
              name={dish.BIT240091_IsAvailable ? 'checkmark-circle' : 'close-circle'}
              size={13}
              color={dish.BIT240091_IsAvailable ? '#059669' : '#DC2626'}
            />
            <Text
              style={[
                styles.statusText,
                dish.BIT240091_IsAvailable ? styles.statusTextAvailable : styles.statusTextUnavailable,
              ]}>
              {dish.BIT240091_IsAvailable ? t.available : t.unavailable}
            </Text>
          </View>
        </View>

        <Text style={styles.dishName}>{dish.BIT240091_Name}</Text>
        <Text style={styles.price}>{dish.BIT240091_Price.toLocaleString('vi-VN')} ₫</Text>

        {/* Description */}
        <View style={styles.divider} />
        <Text style={styles.sectionSubHeading}>{t.description}</Text>
        <Text style={styles.descriptionText}>
          {dish.BIT240091_Description || t.noDescription}
        </Text>
      </View>

      {/* Action Buttons: Edit and Delete */}
      <View style={styles.actionsFooter}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}>
          <Ionicons name="trash-outline" size={18} color="#DC2626" />
          <Text style={styles.deleteButtonText}>{t.delete}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push(`/dish/edit/${dish.BIT240091_Id}` as any)}
          activeOpacity={0.8}>
          <Ionicons name="create-outline" size={18} color="#FFFFFF" />
          <Text style={styles.editButtonText}>{t.edit}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  heroImageContainer: {
    width: width,
    height: 270,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  timeBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  quickBadge: {
    backgroundColor: '#059669',
  },
  regularBadge: {
    backgroundColor: '#2563EB',
  },
  timeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  thumbnailActivePill: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FEF3C7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  thumbnailActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  gallerySection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },
  setThumbnailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  setThumbnailText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  thumbnailList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  thumbnailCard: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  thumbnailCardSelected: {
    borderColor: '#2563EB',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  starBadgeSmall: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusAvailable: {
    backgroundColor: '#ECFDF5',
  },
  statusUnavailable: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextAvailable: {
    color: '#059669',
  },
  statusTextUnavailable: {
    color: '#DC2626',
  },
  dishName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 28,
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  sectionSubHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  technicalCard: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  technicalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  technicalTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  techText: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  actionsFooter: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 40,
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  deleteButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
  editButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
