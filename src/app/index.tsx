/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * MAIN DISHES LIST SCREEN (Section 4.1, 4.2)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DishCard } from '@/components/DishCard';
import { FilterModal } from '@/components/FilterModal';
import { StudentBanner } from '@/components/StudentBanner';
import { useFood } from '@/context/FoodContext';
import { BIT240091_Dish } from '@/types/dish';

export default function DishListScreen() {
  const router = useRouter();
  const {
    categories,
    filteredDishes,
    filterState,
    setFilterState,
    resetFilterState,
    activeFilterCount,
    getCategoryDisplayName,
    triggerAutoSync,
    isLoading,
    t,
  } = useFood();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await triggerAutoSync();
    setRefreshing(false);
  };

  const handleSearchChange = (text: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: text }));
  };

  const handleClearSearch = () => {
    setFilterState((prev) => ({ ...prev, searchQuery: '' }));
  };

  const handleSelectQuickCategory = (catId: string) => {
    setFilterState((prev) => ({
      ...prev,
      categoryId: prev.categoryId === catId ? 'all' : catId,
    }));
  };

  const renderDishItem = ({ item }: { item: BIT240091_Dish }) => (
    <DishCard
      dish={item}
      onPress={() => {
        router.push(`/dish/${item.BIT240091_Id}` as any);
      }}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Student Banner thể hiện rõ MSSV: BIT240091 */}
      <StudentBanner
        onOpenCategories={() => router.push('/categories' as any)}
        onOpenSettings={() => router.push('/settings' as any)}
      />

      {/* Search Bar & Filter Button */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchPlaceholder}
            placeholderTextColor="#94A3B8"
            value={filterState.searchQuery}
            onChangeText={handleSearchChange}
            clearButtonMode="while-editing"
          />
          {filterState.searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearSearchBtn}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterTriggerBtn, activeFilterCount > 0 && styles.filterTriggerActive]}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.7}>
          <Ionicons
            name="options-outline"
            size={18}
            color={activeFilterCount > 0 ? '#1D4ED8' : '#334155'}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick category horizontal scroll filter */}
      <View style={styles.quickCategoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickCategoryList}>
          <TouchableOpacity
            style={[
              styles.quickChip,
              filterState.categoryId === 'all' && styles.quickChipActive,
            ]}
            onPress={() => handleSelectQuickCategory('all')}>
            <Text
              style={[
                styles.quickChipText,
                filterState.categoryId === 'all' && styles.quickChipTextActive,
              ]}>
              {t.allCategories}
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSelected = filterState.categoryId === cat.BIT240091_Id;
            return (
              <TouchableOpacity
                key={cat.BIT240091_Id}
                style={[styles.quickChip, isSelected && styles.quickChipActive]}
                onPress={() => handleSelectQuickCategory(cat.BIT240091_Id)}>
                <Text
                  style={[
                    styles.quickChipText,
                    isSelected && styles.quickChipTextActive,
                  ]}>
                  {getCategoryDisplayName(cat)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Active Summary banner if filters applied */}
      {activeFilterCount > 0 && (
        <View style={styles.filterNoticeRow}>
          <Text style={styles.filterNoticeText}>
            {activeFilterCount} {t.activeFiltersCount}
          </Text>
          <TouchableOpacity onPress={resetFilterState}>
            <Text style={styles.resetQuickText}>{t.resetFilters}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Dishes List */}
      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => item.BIT240091_Id}
        renderItem={renderDishItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="fast-food-outline" size={48} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>{t.emptyDishesTitle}</Text>
              <Text style={styles.emptyMessage}>{t.emptyDishesMessage}</Text>
              {activeFilterCount > 0 ? (
                <TouchableOpacity style={styles.resetBtnEmpty} onPress={resetFilterState}>
                  <Text style={styles.resetBtnEmptyText}>{t.resetFilters}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.resetBtnEmpty}
                  onPress={() => router.push('/dish/create' as any)}>
                  <Text style={styles.resetBtnEmptyText}>{t.addDish}</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : undefined
        }
      />

      {/* Floating Action Button (FAB) for adding new dish */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/dish/create' as any)}
        activeOpacity={0.85}>
        <Ionicons name="add" size={26} color="#FFFFFF" />
        <Text style={styles.fabText}>{t.addDish}</Text>
      </TouchableOpacity>

      {/* Filter & Sort Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    gap: 10,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  clearSearchBtn: {
    padding: 4,
  },
  filterTriggerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterTriggerActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#2563EB',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  quickCategoryContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  quickCategoryList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  quickChipTextActive: {
    color: '#FFFFFF',
  },
  filterNoticeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  filterNoticeText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  resetQuickText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 90,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptyMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  resetBtnEmpty: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetBtnEmptyText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
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
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    gap: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
