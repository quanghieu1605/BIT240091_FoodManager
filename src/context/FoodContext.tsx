/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * GLOBAL FOOD CONTEXT & STATE MANAGEMENT
 */

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { translations } from '@/constants/translations';
import { mockApiService } from '@/services/mockApi';
import { storageService } from '@/services/storage';
import {
  BIT240091_Dish,
  BIT240091_DishCategory,
  FilterState,
  Language,
  SyncQueueItem,
} from '@/types/dish';

export const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: '',
  categoryId: 'all',
  availability: 'all',
  minPrice: '',
  maxPrice: '',
  sortBy: 'default',
};

interface FoodContextType {
  // Data
  categories: BIT240091_DishCategory[];
  dishes: BIT240091_Dish[];
  filteredDishes: BIT240091_Dish[];
  filterState: FilterState;
  setFilterState: (updater: FilterState | ((prev: FilterState) => FilterState)) => void;
  resetFilterState: () => void;
  activeFilterCount: number;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (typeof translations)['en'];

  // Network & Sync
  isOnline: boolean;
  simulateOffline: boolean;
  setSimulateOffline: (simulate: boolean) => void;
  syncStatus: 'synced' | 'syncing' | 'offline' | 'pending';
  pendingSyncCount: number;
  triggerAutoSync: () => Promise<void>;
  mockApiUrl: string;
  setMockApiUrl: (url: string) => Promise<void>;

  // Dish CRUD
  addDish: (dishData: Omit<BIT240091_Dish, 'BIT240091_Id' | 'BIT240091_UpdatedAt' | 'BIT240091_SyncStatus'>) => Promise<{ success: boolean; error?: string; dish?: BIT240091_Dish }>;
  updateDish: (dish: BIT240091_Dish) => Promise<{ success: boolean; error?: string }>;
  deleteDish: (dishId: string) => Promise<{ success: boolean; error?: string }>;
  setThumbnailImage: (dishId: string, imageUrl: string) => Promise<void>;
  getDishById: (id: string) => BIT240091_Dish | undefined;
  getCategoryById: (id: string) => BIT240091_DishCategory | undefined;

  // Category CRUD
  addCategory: (name: string, description: string) => Promise<{ success: boolean; error?: string; category?: BIT240091_DishCategory }>;
  deleteCategory: (categoryId: string) => Promise<{ success: boolean; error?: string }>;

  // Admin / Reset
  resetAllData: () => Promise<void>;
  isLoading: boolean;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<BIT240091_DishCategory[]>([]);
  const [dishes, setDishes] = useState<BIT240091_Dish[]>([]);
  const [filterState, setFilterStateInternal] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [language, setLanguageState] = useState<Language>('en');
  const [mockApiUrl, setMockApiUrlState] = useState<string>('');
  const [simulateOffline, setSimulateOfflineState] = useState<boolean>(false);
  const [hasRealInternet, setHasRealInternet] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'pending'>('synced');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tính trạng thái Online thực tế: Có mạng thật VÀ không bật Giả lập Offline
  const isOnline = hasRealInternet && !simulateOffline;

  // Bản dịch hiện tại
  const t = translations[language];

  // 1. Khởi tạo dữ liệu từ AsyncStorage khi mở app
  useEffect(() => {
    async function initData() {
      try {
        setIsLoading(true);
        const [savedCategories, savedDishes, savedLang, savedOffline, savedUrl, savedFilter, queue] = await Promise.all([
          storageService.getCategories(),
          storageService.getDishes(),
          storageService.getLanguage(),
          storageService.getSimulateOffline(),
          storageService.getMockApiUrl(),
          storageService.getSavedFilterState(),
          storageService.getSyncQueue(),
        ]);

        setCategories(savedCategories);
        setDishes(savedDishes);
        setLanguageState(savedLang);
        setSimulateOfflineState(savedOffline);
        setMockApiUrlState(savedUrl);
        setPendingSyncCount(queue.length);

        if (savedFilter) {
          setFilterStateInternal(savedFilter);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initData();
  }, []);

  // 2. Lắng nghe trạng thái mạng từ NetInfo
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && (state.isInternetReachable ?? true));
      setHasRealInternet(online);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Bộ điều phối đồng bộ tự động
   */
  const triggerAutoSync = useCallback(async () => {
    if (!isOnline) {
      setSyncStatus('offline');
      return;
    }

    try {
      setSyncStatus('syncing');
      const url = mockApiUrl || (await storageService.getMockApiUrl());
      const result = await mockApiService.processSyncQueue(url);
      if (result.syncedCount > 0) {
        console.log(`Synced ${result.syncedCount} items to MockAPI`);
      }

      const refreshedDishes = await storageService.getDishes();
      setDishes(refreshedDishes);

      const remainingQueue = await storageService.getSyncQueue();
      setPendingSyncCount(remainingQueue.length);

      if (remainingQueue.length === 0) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('pending');
      }
    } catch (error) {
      console.log('Auto sync error:', error);
      setSyncStatus('pending');
    }
  }, [isOnline, mockApiUrl]);

  // 3. Tự động đồng bộ (Auto Sync) khi có mạng trở lại (Yêu cầu nâng cao 1.5đ)
  useEffect(() => {
    if (isOnline && !isLoading) {
      const timer = setTimeout(() => {
        triggerAutoSync();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOnline, isLoading, triggerAutoSync]);

  // Cập nhật pending count
  useEffect(() => {
    async function updatePending() {
      const queue = await storageService.getSyncQueue();
      setPendingSyncCount(queue.length);
      if (queue.length > 0 && !isOnline) {
        setSyncStatus('pending');
      }
    }
    updatePending();
  }, [dishes, isOnline]);

  /**
   * Đổi ngôn ngữ
   */
  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    await storageService.saveLanguage(newLang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  /**
   * Bật/tắt giả lập offline
   */
  const setSimulateOffline = async (simulate: boolean) => {
    setSimulateOfflineState(simulate);
    await storageService.saveSimulateOffline(simulate);
    if (!simulate && hasRealInternet) {
      // Khi tắt Offline Mode -> Tự động đồng bộ ngay lập tức!
      setTimeout(() => {
        triggerAutoSync();
      }, 300);
    }
  };

  /**
   * Cập nhật MockAPI URL
   */
  const setMockApiUrl = async (url: string) => {
    setMockApiUrlState(url);
    await storageService.saveMockApiUrl(url);
  };

  /**
   * Cập nhật filter state và lưu
   */
  const setFilterState = (updater: FilterState | ((prev: FilterState) => FilterState)) => {
    setFilterStateInternal((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storageService.saveFilterState(next);
      return next;
    });
  };

  const resetFilterState = () => {
    setFilterState(DEFAULT_FILTER_STATE);
  };

  // Đếm số bộ lọc đang kích hoạt
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.searchQuery.trim().length > 0) count++;
    if (filterState.categoryId !== 'all') count++;
    if (filterState.availability !== 'all') count++;
    if (filterState.minPrice.trim().length > 0) count++;
    if (filterState.maxPrice.trim().length > 0) count++;
    if (filterState.sortBy !== 'default') count++;
    return count;
  }, [filterState]);

  // Tìm kiếm, lọc và sắp xếp món ăn (Section 4.2)
  const filteredDishes = useMemo(() => {
    return dishes
      .filter((dish) => {
        // 1. Tìm theo một phần tên món (Search query)
        if (filterState.searchQuery.trim()) {
          const query = filterState.searchQuery.toLowerCase().trim();
          const matchName = dish.BIT240091_Name.toLowerCase().includes(query);
          if (!matchName) return false;
        }

        // 2. Lọc theo loại món (Category filter)
        if (filterState.categoryId !== 'all') {
          if (dish.BIT240091_DishCategoryId !== filterState.categoryId) return false;
        }

        // 3. Lọc theo trạng thái đang bán (Availability filter)
        // Yêu cầu: Món ngừng bán vẫn xuất hiện trong danh sách chung, nhưng không xuất hiện khi lọc "đang bán"
        if (filterState.availability === 'available') {
          if (!dish.BIT240091_IsAvailable) return false;
        } else if (filterState.availability === 'unavailable') {
          if (dish.BIT240091_IsAvailable) return false;
        }

        // 4. Lọc theo khoảng giá (Price range)
        const minP = parseFloat(filterState.minPrice);
        const maxP = parseFloat(filterState.maxPrice);
        if (!isNaN(minP) && minP >= 0) {
          if (dish.BIT240091_Price < minP) return false;
        }
        if (!isNaN(maxP) && maxP >= 0) {
          if (dish.BIT240091_Price > maxP) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // 5. Sắp xếp (Sorting)
        switch (filterState.sortBy) {
          case 'price_asc':
            return a.BIT240091_Price - b.BIT240091_Price;
          case 'price_desc':
            return b.BIT240091_Price - a.BIT240091_Price;
          case 'prep_time_asc':
            return a.BIT240091_PreparationTime - b.BIT240091_PreparationTime;
          case 'default':
          default:
            return (b.BIT240091_UpdatedAt || 0) - (a.BIT240091_UpdatedAt || 0);
        }
      });
  }, [dishes, filterState]);

  /**
   * Helper tìm kiếm
   */
  const getDishById = (id: string) => dishes.find((d) => d.BIT240091_Id === id);
  const getCategoryById = (id: string) => categories.find((c) => c.BIT240091_Id === id);

  /**
   * Thêm món ăn mới với đầy đủ Validation
   */
  const addDish = async (
    dishData: Omit<BIT240091_Dish, 'BIT240091_Id' | 'BIT240091_UpdatedAt' | 'BIT240091_SyncStatus'>
  ): Promise<{ success: boolean; error?: string; dish?: BIT240091_Dish }> => {
    // 1. Kiểm tra Name không rỗng
    if (!dishData.BIT240091_Name || dishData.BIT240091_Name.trim().length === 0) {
      return { success: false, error: t.nameRequired };
    }

    // 2. Kiểm tra Price > 0
    if (isNaN(dishData.BIT240091_Price) || dishData.BIT240091_Price <= 0) {
      return { success: false, error: t.pricePositive };
    }

    // 3. Kiểm tra PreparationTime > 0
    if (isNaN(dishData.BIT240091_PreparationTime) || dishData.BIT240091_PreparationTime <= 0) {
      return { success: false, error: t.prepTimePositive };
    }

    // 4. Kiểm tra DishCategoryId hợp lệ
    const catExists = categories.some((c) => c.BIT240091_Id === dishData.BIT240091_DishCategoryId);
    if (!catExists) {
      return { success: false, error: t.categoryRequired };
    }

    // 5. Kiểm tra tên món không trùng trong cùng một loại
    const duplicate = dishes.some(
      (d) =>
        d.BIT240091_DishCategoryId === dishData.BIT240091_DishCategoryId &&
        d.BIT240091_Name.trim().toLowerCase() === dishData.BIT240091_Name.trim().toLowerCase()
    );
    if (duplicate) {
      return { success: false, error: t.duplicateDishNameInCategory };
    }

    // Xử lý thumbnail: Đảm bảo tối đa 1 ảnh có IsThumbnail = true
    let processedImages = [...dishData.BIT240091_DishImages];
    const hasThumbnail = processedImages.some((img) => img.BIT240091_IsThumbnail);
    if (processedImages.length > 0 && !hasThumbnail) {
      processedImages[0].BIT240091_IsThumbnail = true;
    }

    const newDish: BIT240091_Dish = {
      ...dishData,
      BIT240091_DishImages: processedImages,
      BIT240091_Id: `dish_${Date.now()}`,
      BIT240091_UpdatedAt: Date.now(),
      BIT240091_SyncStatus: isOnline ? 'synced' : 'created_offline',
    };

    const updatedDishes = [newDish, ...dishes];
    setDishes(updatedDishes);
    await storageService.saveDishes(updatedDishes);

    // Xử lý đồng bộ hoặc lưu queue nếu offline
    const queueItem: SyncQueueItem = {
      id: `sync_${Date.now()}`,
      action: 'CREATE_DISH',
      targetId: newDish.BIT240091_Id,
      payload: newDish,
      timestamp: Date.now(),
    };

    if (!isOnline) {
      const queue = await storageService.getSyncQueue();
      queue.push(queueItem);
      await storageService.saveSyncQueue(queue);
      setPendingSyncCount(queue.length);
      setSyncStatus('pending');
    } else {
      // Đang online -> Gửi lên API luôn
      const success = await mockApiService.createDishApi(mockApiUrl, newDish);
      if (!success) {
        // Nếu API lỗi -> đưa vào queue offline dự phòng
        const queue = await storageService.getSyncQueue();
        queue.push(queueItem);
        await storageService.saveSyncQueue(queue);
        setPendingSyncCount(queue.length);
      }
    }

    return { success: true, dish: newDish };
  };

  /**
   * Chỉnh sửa món ăn
   */
  const updateDish = async (dish: BIT240091_Dish): Promise<{ success: boolean; error?: string }> => {
    // 1. Kiểm tra Name không rỗng
    if (!dish.BIT240091_Name || dish.BIT240091_Name.trim().length === 0) {
      return { success: false, error: t.nameRequired };
    }

    // 2. Kiểm tra Price > 0
    if (isNaN(dish.BIT240091_Price) || dish.BIT240091_Price <= 0) {
      return { success: false, error: t.pricePositive };
    }

    // 3. Kiểm tra PreparationTime > 0
    if (isNaN(dish.BIT240091_PreparationTime) || dish.BIT240091_PreparationTime <= 0) {
      return { success: false, error: t.prepTimePositive };
    }

    // 4. Kiểm tra DishCategoryId hợp lệ
    const catExists = categories.some((c) => c.BIT240091_Id === dish.BIT240091_DishCategoryId);
    if (!catExists) {
      return { success: false, error: t.categoryRequired };
    }

    // 5. Kiểm tra tên món không trùng trong cùng một loại (ngoại trừ chính món này)
    const duplicate = dishes.some(
      (d) =>
        d.BIT240091_Id !== dish.BIT240091_Id &&
        d.BIT240091_DishCategoryId === dish.BIT240091_DishCategoryId &&
        d.BIT240091_Name.trim().toLowerCase() === dish.BIT240091_Name.trim().toLowerCase()
    );
    if (duplicate) {
      return { success: false, error: t.duplicateDishNameInCategory };
    }

    // Xử lý thumbnail: tối đa 01 ảnh
    let processedImages = [...dish.BIT240091_DishImages];
    const hasThumbnail = processedImages.some((img) => img.BIT240091_IsThumbnail);
    if (processedImages.length > 0 && !hasThumbnail) {
      processedImages[0].BIT240091_IsThumbnail = true;
    }

    const updatedDish: BIT240091_Dish = {
      ...dish,
      BIT240091_DishImages: processedImages,
      BIT240091_UpdatedAt: Date.now(),
      BIT240091_SyncStatus: isOnline ? 'synced' : 'updated_offline',
    };

    const updatedDishes = dishes.map((d) => (d.BIT240091_Id === dish.BIT240091_Id ? updatedDish : d));
    setDishes(updatedDishes);
    await storageService.saveDishes(updatedDishes);

    // Đồng bộ hoặc queue
    const queueItem: SyncQueueItem = {
      id: `sync_${Date.now()}`,
      action: 'UPDATE_DISH',
      targetId: dish.BIT240091_Id,
      payload: updatedDish,
      timestamp: Date.now(),
    };

    if (!isOnline) {
      const queue = await storageService.getSyncQueue();
      queue.push(queueItem);
      await storageService.saveSyncQueue(queue);
      setPendingSyncCount(queue.length);
      setSyncStatus('pending');
    } else {
      const success = await mockApiService.updateDishApi(mockApiUrl, updatedDish);
      if (!success) {
        const queue = await storageService.getSyncQueue();
        queue.push(queueItem);
        await storageService.saveSyncQueue(queue);
        setPendingSyncCount(queue.length);
      }
    }

    return { success: true };
  };

  /**
   * Xóa món ăn
   */
  const deleteDish = async (dishId: string): Promise<{ success: boolean; error?: string }> => {
    const dishExists = dishes.some((d) => d.BIT240091_Id === dishId);
    if (!dishExists) {
      return { success: false, error: t.dishNotFound };
    }

    const updatedDishes = dishes.filter((d) => d.BIT240091_Id !== dishId);
    setDishes(updatedDishes);
    await storageService.saveDishes(updatedDishes);

    const queueItem: SyncQueueItem = {
      id: `sync_${Date.now()}`,
      action: 'DELETE_DISH',
      targetId: dishId,
      timestamp: Date.now(),
    };

    if (!isOnline) {
      const queue = await storageService.getSyncQueue();
      queue.push(queueItem);
      await storageService.saveSyncQueue(queue);
      setPendingSyncCount(queue.length);
      setSyncStatus('pending');
    } else {
      const success = await mockApiService.deleteDishApi(mockApiUrl, dishId);
      if (!success) {
        const queue = await storageService.getSyncQueue();
        queue.push(queueItem);
        await storageService.saveSyncQueue(queue);
        setPendingSyncCount(queue.length);
      }
    }

    return { success: true };
  };

  /**
   * Thay đổi ảnh đại diện (Thumbnail) của món ăn
   */
  const setThumbnailImage = async (dishId: string, imageUrl: string) => {
    const dish = dishes.find((d) => d.BIT240091_Id === dishId);
    if (!dish) return;

    const updatedImages = dish.BIT240091_DishImages.map((img) => ({
      ...img,
      BIT240091_IsThumbnail: img.BIT240091_ImageUrl === imageUrl,
    }));

    await updateDish({
      ...dish,
      BIT240091_DishImages: updatedImages,
    });
  };

  /**
   * Thêm loại món ăn mới
   */
  const addCategory = async (
    name: string,
    description: string
  ): Promise<{ success: boolean; error?: string; category?: BIT240091_DishCategory }> => {
    if (!name || name.trim().length === 0) {
      return { success: false, error: t.categoryNameRequired };
    }

    const newCategory: BIT240091_DishCategory = {
      BIT240091_Id: `cat_${Date.now()}`,
      BIT240091_Name: name.trim(),
      BIT240091_Description: description.trim(),
      BIT240091_UpdatedAt: Date.now(),
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    await storageService.saveCategories(updatedCategories);

    return { success: true, category: newCategory };
  };

  /**
   * Xóa loại món ăn
   * RÀNG BUỘC NGHIỆP VỤ (Section 4.4): Không cho xóa loại món đang được sử dụng!
   */
  const deleteCategory = async (categoryId: string): Promise<{ success: boolean; error?: string }> => {
    // Kiểm tra xem có món ăn nào đang thuộc loại này không
    const isCategoryInUse = dishes.some((d) => d.BIT240091_DishCategoryId === categoryId);
    if (isCategoryInUse) {
      return {
        success: false,
        error: t.categoryInUseCannotDelete,
      };
    }

    const updatedCategories = categories.filter((c) => c.BIT240091_Id !== categoryId);
    setCategories(updatedCategories);
    await storageService.saveCategories(updatedCategories);

    return { success: true };
  };

  /**
   * Khôi phục toàn bộ về dữ liệu mẫu (Seed Data)
   */
  const resetAllData = async () => {
    setIsLoading(true);
    const { categories: initCats, dishes: initDishes } = await storageService.resetToInitial();
    setCategories(initCats);
    setDishes(initDishes);
    setPendingSyncCount(0);
    setSyncStatus('synced');
    setIsLoading(false);
  };

  return (
    <FoodContext.Provider
      value={{
        categories,
        dishes,
        filteredDishes,
        filterState,
        setFilterState,
        resetFilterState,
        activeFilterCount,

        language,
        setLanguage,
        toggleLanguage,
        t,

        isOnline,
        simulateOffline,
        setSimulateOffline,
        syncStatus,
        pendingSyncCount,
        triggerAutoSync,
        mockApiUrl,
        setMockApiUrl,

        addDish,
        updateDish,
        deleteDish,
        setThumbnailImage,
        getDishById,
        getCategoryById,

        addCategory,
        deleteCategory,

        resetAllData,
        isLoading,
      }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = (): FoodContextType => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFood must be used within a FoodProvider');
  }
  return context;
};
