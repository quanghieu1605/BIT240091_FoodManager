/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * FILTER & SORT MODAL COMPONENT (Section 4.2)
 * Hỗ trợ phối hợp đồng thời tìm kiếm, lọc loại, trạng thái, khoảng giá và sắp xếp.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';
import { AvailabilityFilter, FilterState, SortOption } from '@/types/dish';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose }) => {
  const { categories, filterState, setFilterState, resetFilterState, t } = useFood();

  // Local draft state để chỉ áp dụng khi bấm "Apply Filters"
  const [draftState, setDraftState] = useState<FilterState>(filterState);
  const [priceError, setPriceError] = useState<string | null>(null);

  const [prevVisible, setPrevVisible] = useState(visible);
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setDraftState(filterState);
      setPriceError(null);
    }
  }

  const handleApply = () => {
    // Kiểm tra tính hợp lệ của khoảng giá (Section 4.4: Xử lý khoảng giá không hợp lệ)
    const minP = draftState.minPrice.trim() !== '' ? parseFloat(draftState.minPrice) : NaN;
    const maxP = draftState.maxPrice.trim() !== '' ? parseFloat(draftState.maxPrice) : NaN;

    if (!isNaN(minP) && minP < 0) {
      setPriceError(t.invalidPriceNumbers);
      return;
    }
    if (!isNaN(maxP) && maxP < 0) {
      setPriceError(t.invalidPriceNumbers);
      return;
    }
    if (!isNaN(minP) && !isNaN(maxP) && minP > maxP) {
      setPriceError(t.invalidPriceRange);
      return;
    }

    setPriceError(null);
    setFilterState(draftState);
    onClose();
  };

  const handleReset = () => {
    resetFilterState();
    setDraftState({
      searchQuery: draftState.searchQuery, // giữ lại search text nếu người dùng muốn
      categoryId: 'all',
      availability: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'default',
    });
    setPriceError(null);
    onClose();
  };

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'default', label: t.sortDefault },
    { key: 'price_asc', label: t.sortPriceAsc },
    { key: 'price_desc', label: t.sortPriceDesc },
    { key: 'prep_time_asc', label: t.sortPrepTimeAsc },
  ];

  const statusOptions: { key: AvailabilityFilter; label: string }[] = [
    { key: 'all', label: t.statusAll },
    { key: 'available', label: t.statusAvailableOnly },
    { key: 'unavailable', label: t.statusUnavailableOnly },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{t.filterTitle}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* 1. Lọc theo Loại món ăn */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.categoryLabel}</Text>
              <View style={styles.chipGroup}>
                <TouchableOpacity
                  style={[
                    styles.chip,
                    draftState.categoryId === 'all' && styles.chipActive,
                  ]}
                  onPress={() => setDraftState((prev) => ({ ...prev, categoryId: 'all' }))}>
                  <Text
                    style={[
                      styles.chipText,
                      draftState.categoryId === 'all' && styles.chipTextActive,
                    ]}>
                    {t.allCategories}
                  </Text>
                </TouchableOpacity>

                {categories.map((cat) => {
                  const isSelected = draftState.categoryId === cat.BIT240091_Id;
                  return (
                    <TouchableOpacity
                      key={cat.BIT240091_Id}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() =>
                        setDraftState((prev) => ({ ...prev, categoryId: cat.BIT240091_Id }))
                      }>
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {cat.BIT240091_Name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. Lọc theo trạng thái đang bán */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.availabilityLabel}</Text>
              <View style={styles.segmentedControl}>
                {statusOptions.map((opt) => {
                  const isSelected = draftState.availability === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                      onPress={() => setDraftState((prev) => ({ ...prev, availability: opt.key }))}>
                      <Text
                        style={[
                          styles.segmentText,
                          isSelected && styles.segmentTextActive,
                        ]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Lọc theo khoảng giá */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.priceRangeLabel}</Text>
              <View style={styles.priceRow}>
                <View style={styles.priceInputWrapper}>
                  <TextInput
                    style={styles.priceInput}
                    placeholder={t.minPricePlaceholder}
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={draftState.minPrice}
                    onChangeText={(val) => {
                      setDraftState((prev) => ({ ...prev, minPrice: val }));
                      setPriceError(null);
                    }}
                  />
                </View>
                <Text style={styles.priceDivider}>—</Text>
                <View style={styles.priceInputWrapper}>
                  <TextInput
                    style={styles.priceInput}
                    placeholder={t.maxPricePlaceholder}
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={draftState.maxPrice}
                    onChangeText={(val) => {
                      setDraftState((prev) => ({ ...prev, maxPrice: val }));
                      setPriceError(null);
                    }}
                  />
                </View>
              </View>
              {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
            </View>

            {/* 4. Sắp xếp theo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.sortByLabel}</Text>
              {sortOptions.map((opt) => {
                const isSelected = draftState.sortBy === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={styles.sortRow}
                    onPress={() => setDraftState((prev) => ({ ...prev, sortBy: opt.key }))}>
                    <Text style={[styles.sortLabel, isSelected && styles.sortLabelActive]}>
                      {opt.label}
                    </Text>
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={isSelected ? '#2563EB' : '#94A3B8'}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.sheetFooter}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>{t.resetFilters}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>{t.applyFilters}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#0F172A',
  },
  priceDivider: {
    color: '#94A3B8',
    fontWeight: '700',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  sortLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  sortLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  sheetFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  applyBtn: {
    flex: 2,
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
