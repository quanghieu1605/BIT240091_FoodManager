/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * CREATE DISH SCREEN (Section 4.1, 4.3)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';
import { BIT240091_DishImage, getPreparationTimeType } from '@/types/dish';

const SAMPLE_FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80',
];

export default function CreateDishScreen() {
  const router = useRouter();
  const { categories, addDish, getCategoryDisplayName, t } = useFood();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.BIT240091_Id || '');
  const [price, setPrice] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<BIT240091_DishImage[]>([
    {
      BIT240091_ImageUrl: SAMPLE_FOOD_IMAGES[0],
      BIT240091_IsThumbnail: true,
    },
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live calculation of Quick/Regular badge preview
  const parsedPrepTime = parseFloat(prepTime);
  const prepType = !isNaN(parsedPrepTime) && parsedPrepTime > 0
    ? getPreparationTimeType(parsedPrepTime)
    : null;

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const isFirst = images.length === 0;
    setImages([
      ...images,
      {
        BIT240091_ImageUrl: newImageUrl.trim(),
        BIT240091_IsThumbnail: isFirst,
      },
    ]);
    setNewImageUrl('');
  };

  const handleSelectThumbnail = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        BIT240091_IsThumbnail: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    const wasThumbnail = images[index].BIT240091_IsThumbnail;
    const nextImages = images.filter((_, i) => i !== index);
    if (wasThumbnail && nextImages.length > 0) {
      nextImages[0].BIT240091_IsThumbnail = true;
    }
    setImages(nextImages);
  };

  const handleSave = async () => {
    // 1. Validation kiểm tra Name không rỗng
    if (!name.trim()) {
      Alert.alert(t.validationError, t.nameRequired);
      return;
    }

    // 2. Validation kiểm tra CategoryId hợp lệ
    if (!categoryId) {
      Alert.alert(t.validationError, t.categoryRequired);
      return;
    }

    // 3. Validation kiểm tra Price > 0
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert(t.validationError, t.pricePositive);
      return;
    }

    // 4. Validation kiểm tra PreparationTime > 0
    const parsedTime = parseFloat(prepTime);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      Alert.alert(t.validationError, t.prepTimePositive);
      return;
    }

    setIsSubmitting(true);
    const result = await addDish({
      BIT240091_Name: name.trim(),
      BIT240091_Price: parsedPrice,
      BIT240091_PreparationTime: parsedTime,
      BIT240091_IsAvailable: isAvailable,
      BIT240091_Description: description.trim(),
      BIT240091_DishCategoryId: categoryId,
      BIT240091_DishImages: images,
    });
    setIsSubmitting(false);

    if (result.success && result.dish) {
      router.back();
    } else {
      Alert.alert(t.validationError, result.error || 'Failed to create dish');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formCard}>
        {/* Dish Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t.dishNameLabel} <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t.dishNamePlaceholder}
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Dish Category Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t.category} <Text style={styles.requiredStar}>*</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryPills}>
            {categories.map((cat) => {
              const isSelected = categoryId === cat.BIT240091_Id;
              return (
                <TouchableOpacity
                  key={cat.BIT240091_Id}
                  style={[styles.catPill, isSelected && styles.catPillActive]}
                  onPress={() => setCategoryId(cat.BIT240091_Id)}>
                  <Text style={[styles.catPillText, isSelected && styles.catPillTextActive]}>
                    {getCategoryDisplayName(cat)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Price & PrepTime in Row */}
        <View style={styles.rowGroup}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>
              {t.priceLabel} <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t.pricePlaceholder}
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <View style={styles.labelWithPreview}>
              <Text style={styles.label}>
                {t.prepTime} <Text style={styles.requiredStar}>*</Text>
              </Text>
              {prepType && (
                <View style={[styles.previewBadge, prepType === 'quick' ? styles.quickBadge : styles.regularBadge]}>
                  <Text style={styles.previewBadgeText}>
                    {prepType === 'quick' ? t.quickDish : t.regularDish}
                  </Text>
                </View>
              )}
            </View>
            <TextInput
              style={styles.input}
              placeholder={t.prepTimePlaceholder}
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={prepTime}
              onChangeText={setPrepTime}
            />
          </View>
        </View>

        {/* Availability Switch */}
        <View style={styles.switchGroup}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchLabel}>{t.isAvailableSwitchLabel}</Text>
            <Text style={styles.switchSubLabel}>
              {isAvailable ? t.statusAvailableOnly : t.statusUnavailableOnly}
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
            thumbColor={isAvailable ? '#2563EB' : '#94A3B8'}
          />
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.descriptionLabel}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t.descriptionPlaceholder}
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Images Section (Section 4.3) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.imagesSectionTitle}</Text>
          <Text style={styles.helperText}>{t.atLeastOneImageHint}</Text>

          <View style={styles.addImageRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder={t.imageUrlPlaceholder}
              placeholderTextColor="#94A3B8"
              value={newImageUrl}
              onChangeText={setNewImageUrl}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.addImageBtn} onPress={handleAddImageUrl}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quick sample image buttons for easy testing */}
          <View style={styles.presetRow}>
            <Text style={styles.presetLabel}>Presets: </Text>
            {SAMPLE_FOOD_IMAGES.map((sampleUrl, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.presetBtn}
                onPress={() => setNewImageUrl(sampleUrl)}>
                <Text style={styles.presetBtnText}>Photo {idx + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Images List */}
          <View style={styles.imagesGrid}>
            {images.map((img, index) => (
              <View key={index} style={styles.imageCard}>
                <Image source={{ uri: img.BIT240091_ImageUrl }} style={styles.previewImage} />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={[
                      styles.thumbnailToggleBtn,
                      img.BIT240091_IsThumbnail && styles.thumbnailToggleActive,
                    ]}
                    onPress={() => handleSelectThumbnail(index)}>
                    <Ionicons
                      name={img.BIT240091_IsThumbnail ? 'star' : 'star-outline'}
                      size={13}
                      color={img.BIT240091_IsThumbnail ? '#B45309' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.thumbnailToggleText,
                        img.BIT240091_IsThumbnail && styles.thumbnailToggleTextActive,
                      ]}>
                      {img.BIT240091_IsThumbnail ? t.isThumbnail : t.setAsThumbnail}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.removeImageBtn}
                    onPress={() => handleRemoveImage(index)}>
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={isSubmitting}>
            <Text style={styles.cancelButtonText}>{t.cancel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSubmitting}>
            <Text style={styles.saveButtonText}>{t.save}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formGroup: {
    marginBottom: 16,
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  categoryPills: {
    gap: 8,
    paddingVertical: 4,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  catPillText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  catPillTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  labelWithPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  quickBadge: {
    backgroundColor: '#059669',
  },
  regularBadge: {
    backgroundColor: '#2563EB',
  },
  previewBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  switchTextContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  switchSubLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  addImageRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addImageBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  presetLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  presetBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetBtnText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  imagesGrid: {
    marginTop: 12,
    gap: 10,
  },
  imageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  previewImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    resizeMode: 'contain',
  },
  imageActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thumbnailToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  thumbnailToggleActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  thumbnailToggleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  thumbnailToggleTextActive: {
    color: '#92400E',
    fontWeight: '700',
  },
  removeImageBtn: {
    padding: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 13,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

