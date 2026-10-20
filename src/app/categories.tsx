/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * CATEGORY MANAGEMENT SCREEN (Section 3, 4.4)
 * Thực hiện quản lý loại món ăn và ràng buộc: "Không cho xóa loại món đang được sử dụng"
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFood } from '@/context/FoodContext';
import { BIT240091_DishCategory } from '@/types/dish';

export default function CategoriesScreen() {
  const {
    categories,
    dishes,
    addCategory,
    deleteCategory,
    getCategoryDisplayName,
    getCategoryDisplayDesc,
    t,
  } = useFood();

  const [modalVisible, setModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Đếm số lượng món ăn theo từng loại (để kiểm tra ràng buộc không cho xóa loại đang dùng)
  const getDishCountForCategory = (catId: string) => {
    return dishes.filter((d) => d.BIT240091_DishCategoryId === catId).length;
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) {
      Alert.alert(t.validationError, t.categoryNameRequired);
      return;
    }

    setIsSubmitting(true);
    const result = await addCategory(newCatName, newCatDesc);
    setIsSubmitting(false);

    if (result.success) {
      setNewCatName('');
      setNewCatDesc('');
      setModalVisible(false);
    } else {
      Alert.alert(t.validationError, result.error || 'Failed to create category');
    }
  };

  const handleDeleteCategory = (cat: BIT240091_DishCategory) => {
    const dishCount = getDishCountForCategory(cat.BIT240091_Id);

    // RÀNG BUỘC NGHIỆP VỤ (Section 4.4): Không cho xóa loại món đang được sử dụng!
    if (dishCount > 0) {
      Alert.alert(
        t.validationError,
        `${t.categoryInUseCannotDelete} • ${dishCount} ${t.dishesCount}`
      );
      return;
    }

    // Nếu không có món nào thuộc loại này thì mới cho xóa với xác nhận
    Alert.alert(
      t.confirmDeleteCatTitle,
      t.confirmDeleteCatMessage.replace('{name}', getCategoryDisplayName(cat)),
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            const res = await deleteCategory(cat.BIT240091_Id);
            if (!res.success) {
              Alert.alert(t.validationError, res.error);
            }
          },
        },
      ]
    );
  };

  const renderCategoryItem = ({ item }: { item: BIT240091_DishCategory }) => {
    const count = getDishCountForCategory(item.BIT240091_Id);
    const inUse = count > 0;

    return (
      <View style={styles.catCard}>
        <View style={styles.catIconBox}>
          <Ionicons name="restaurant" size={20} color="#2563EB" />
        </View>
        <View style={styles.catInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.catName}>{getCategoryDisplayName(item)}</Text>
            <View style={[styles.countBadge, inUse ? styles.countBadgeInUse : styles.countBadgeEmpty]}>
              <Text style={[styles.countText, inUse ? styles.countTextInUse : styles.countTextEmpty]}>
                {count} {t.dishesCount}
              </Text>
            </View>
          </View>
          {getCategoryDisplayDesc(item) ? (
            <Text style={styles.catDesc}>{getCategoryDisplayDesc(item)}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.deleteCatBtn, inUse && styles.deleteCatBtnDisabled]}
          onPress={() => handleDeleteCategory(item)}
          activeOpacity={0.7}>
          <Ionicons
            name="trash-outline"
            size={18}
            color={inUse ? '#94A3B8' : '#EF4444'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Table & Requirements info banner */}
      <View style={styles.ruleBanner}>
        <Ionicons name="information-circle-outline" size={18} color="#2563EB" />
        <Text style={styles.ruleBannerText}>
          {t.categoryRuleBanner}
        </Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.BIT240091_Id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t.emptyCategoriesTitle}</Text>
          </View>
        }
      />

      {/* FAB add category */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.fabText}>{t.addCategory}</Text>
      </TouchableOpacity>

      {/* Create Category Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.newCategoryTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  {t.categoryNameLabel} <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.categoryNamePlaceholder}
                  placeholderTextColor="#94A3B8"
                  value={newCatName}
                  onChangeText={setNewCatName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t.categoryDescLabel}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t.categoryDescPlaceholder}
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  value={newCatDesc}
                  onChangeText={setNewCatDesc}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={isSubmitting}>
                <Text style={styles.modalCancelText}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSaveBtn, isSubmitting && styles.btnDisabled]}
                onPress={handleCreateCategory}
                disabled={isSubmitting}>
                <Text style={styles.modalSaveText}>{t.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  ruleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    gap: 8,
  },
  ruleBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 16,
  },
  codeText: {
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  catIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  catInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  catName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeInUse: {
    backgroundColor: '#EFF6FF',
  },
  countBadgeEmpty: {
    backgroundColor: '#F1F5F9',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  countTextInUse: {
    color: '#2563EB',
  },
  countTextEmpty: {
    color: '#64748B',
  },
  catDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 4,
  },
  techKey: {
    fontSize: 10,
    color: '#94A3B8',
    fontFamily: 'monospace',
  },
  deleteCatBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    marginLeft: 10,
  },
  deleteCatBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 28,
    elevation: 5,
    gap: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalBody: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 14,
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
    height: 70,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  modalSaveBtn: {
    flex: 2,
    paddingVertical: 12,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});

