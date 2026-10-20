/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * LOCAL STORAGE SERVICE
 * Sử dụng AsyncStorage để lưu trữ dữ liệu local với tiền tố BIT240091_
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_CATEGORIES, INITIAL_DISHES } from '@/constants/initialData';
import {
  BIT240091_Dish,
  BIT240091_DishCategory,
  FilterState,
  Language,
  STORAGE_KEYS,
  SyncQueueItem,
} from '@/types/dish';

export const DEFAULT_MOCK_API_URL = 'https://67b5b5c907ba6e59083e204c.mockapi.io/api/v1/BIT240091_Dish';

export const storageService = {
  /**
   * Lấy danh sách loại món ăn từ bảng BIT240091_DishCategory
   */
  async getCategories(): Promise<BIT240091_DishCategory[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TABLE_CATEGORIES);
      if (data) {
        return JSON.parse(data);
      }
      // Khởi tạo dữ liệu mẫu nếu chưa có
      await this.saveCategories(INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    } catch (error) {
      console.error('Error reading BIT240091_DishCategory:', error);
      return INITIAL_CATEGORIES;
    }
  },

  /**
   * Lưu danh sách loại món ăn vào bảng BIT240091_DishCategory
   */
  async saveCategories(categories: BIT240091_DishCategory[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TABLE_CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving BIT240091_DishCategory:', error);
    }
  },

  /**
   * Lấy danh sách món ăn từ bảng BIT240091_Dish
   */
  async getDishes(): Promise<BIT240091_Dish[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TABLE_DISHES);
      if (data) {
        return JSON.parse(data);
      }
      // Khởi tạo dữ liệu mẫu nếu chưa có
      await this.saveDishes(INITIAL_DISHES);
      return INITIAL_DISHES;
    } catch (error) {
      console.error('Error reading BIT240091_Dish:', error);
      return INITIAL_DISHES;
    }
  },

  /**
   * Lưu danh sách món ăn vào bảng BIT240091_Dish
   */
  async saveDishes(dishes: BIT240091_Dish[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TABLE_DISHES, JSON.stringify(dishes));
    } catch (error) {
      console.error('Error saving BIT240091_Dish:', error);
    }
  },

  /**
   * Lấy ngôn ngữ đã lưu (mặc định 'en')
   */
  async getLanguage(): Promise<Language> {
    try {
      const lang = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return (lang === 'vi' || lang === 'en') ? lang : 'en';
    } catch {
      return 'en';
    }
  },

  /**
   * Lưu ngôn ngữ hiển thị
   */
  async saveLanguage(lang: Language): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (error) {
      console.error('Error saving BIT240091_Language:', error);
    }
  },

  /**
   * Lấy hàng đợi đồng bộ SyncQueue
   */
  async getSyncQueue(): Promise<SyncQueueItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Lưu hàng đợi đồng bộ SyncQueue
   */
  async saveSyncQueue(queue: SyncQueueItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch (error) {
      console.error('Error saving BIT240091_SyncQueue:', error);
    }
  },

  /**
   * Lấy trạng thái giả lập Offline
   */
  async getSimulateOffline(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.SIMULATE_OFFLINE);
      return val === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Lưu trạng thái giả lập Offline
   */
  async saveSimulateOffline(simulate: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SIMULATE_OFFLINE, simulate ? 'true' : 'false');
    } catch (error) {
      console.error('Error saving BIT240091_SimulateOffline:', error);
    }
  },

  /**
   * Lấy cấu hình URL MockAPI
   */
  async getMockApiUrl(): Promise<string> {
    try {
      const url = await AsyncStorage.getItem(STORAGE_KEYS.MOCK_API_CONFIG);
      return url || DEFAULT_MOCK_API_URL;
    } catch {
      return DEFAULT_MOCK_API_URL;
    }
  },

  /**
   * Lưu cấu hình URL MockAPI
   */
  async saveMockApiUrl(url: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MOCK_API_CONFIG, url);
    } catch (error) {
      console.error('Error saving BIT240091_MockApiConfig:', error);
    }
  },

  /**
   * Lấy trạng thái bộ lọc đã lưu (để giữ trạng thái khi back về màn hình danh sách)
   */
  async getSavedFilterState(): Promise<FilterState | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FILTER_STATE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Lưu trạng thái bộ lọc
   */
  async saveFilterState(filter: FilterState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FILTER_STATE, JSON.stringify(filter));
    } catch (error) {
      console.error('Error saving filter state:', error);
    }
  },

  /**
   * Khôi phục toàn bộ dữ liệu về ban đầu (Seed Data)
   */
  async resetToInitial(): Promise<{ categories: BIT240091_DishCategory[]; dishes: BIT240091_Dish[] }> {
    await this.saveCategories(INITIAL_CATEGORIES);
    await this.saveDishes(INITIAL_DISHES);
    await this.saveSyncQueue([]);
    return { categories: INITIAL_CATEGORIES, dishes: INITIAL_DISHES };
  },
};
