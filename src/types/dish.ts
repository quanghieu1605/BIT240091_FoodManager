/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * DATA MODEL DEFINITIONS
 * Tất cả các trường và bảng dữ liệu đều có tiền tố BIT240091_ theo đúng quy định đề thi.
 */

export interface BIT240091_DishImage {
  BIT240091_ImageUrl: string;
  BIT240091_IsThumbnail: boolean;
}

export interface BIT240091_DishCategory {
  BIT240091_Id: string;
  BIT240091_Name: string;
  BIT240091_Description: string;
  BIT240091_UpdatedAt?: number;
}

export type SyncStatus = 'synced' | 'created_offline' | 'updated_offline' | 'deleted_offline';

export interface BIT240091_Dish {
  BIT240091_Id: string;
  BIT240091_Name: string;
  BIT240091_Price: number;
  BIT240091_PreparationTime: number; // in minutes
  BIT240091_IsAvailable: boolean;
  BIT240091_Description: string;
  BIT240091_DishCategoryId: string;
  BIT240091_DishImages: BIT240091_DishImage[];
  BIT240091_UpdatedAt?: number;
  BIT240091_SyncStatus?: SyncStatus;
}

export interface SyncQueueItem {
  id: string;
  action: 'CREATE_DISH' | 'UPDATE_DISH' | 'DELETE_DISH' | 'CREATE_CATEGORY' | 'UPDATE_CATEGORY' | 'DELETE_CATEGORY';
  targetId: string;
  payload?: any;
  timestamp: number;
}

export type Language = 'en' | 'vi';

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'prep_time_asc';

export type AvailabilityFilter = 'all' | 'available' | 'unavailable';

export interface FilterState {
  searchQuery: string;
  categoryId: string; // 'all' or category ID
  availability: AvailabilityFilter;
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
}

export const STORAGE_KEYS = {
  TABLE_CATEGORIES: 'BIT240091_DishCategory',
  TABLE_DISHES: 'BIT240091_Dish',
  LANGUAGE: 'BIT240091_Language',
  MOCK_API_CONFIG: 'BIT240091_MockApiConfig',
  SYNC_QUEUE: 'BIT240091_SyncQueue',
  SIMULATE_OFFLINE: 'BIT240091_SimulateOffline',
  FILTER_STATE: 'BIT240091_FilterState',
};

/**
 * Quy tắc phân loại thời gian chế biến:
 * ≤ 15 phút: Quick / Nhanh
 * > 15 phút: Regular / Thông thường
 */
export function getPreparationTimeType(prepTime: number): 'quick' | 'regular' {
  return prepTime <= 15 ? 'quick' : 'regular';
}
