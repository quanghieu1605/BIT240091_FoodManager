/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * MOCKAPI REST SERVICE & AUTOMATIC SYNC WORKER
 * Hỗ trợ giao tiếp 02 Resource: BIT240091_Dish và BIT240091_DishCategory
 */

import { BIT240091_Dish, BIT240091_DishCategory, SyncQueueItem } from '@/types/dish';
import { storageService } from './storage';

export function getMockEndpoints(inputUrl: string) {
  let base = (inputUrl || '').trim().replace(/\/+$/, '');
  base = base.replace(/\/BIT240091_Dish$/i, '').replace(/\/BIT240091_DishCategory$/i, '');
  return {
    baseUrl: base,
    dishUrl: `${base}/BIT240091_Dish`,
    categoryUrl: `${base}/BIT240091_DishCategory`,
  };
}

export const mockApiService = {
  /**
   * Tìm bản ghi tương ứng trên MockAPI theo BIT240091_Id hoặc id
   */
  async findMockApiItem(resourceUrl: string, targetId: string): Promise<any | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(resourceUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) return null;
      const list = await response.json();
      if (!Array.isArray(list)) return null;
      return list.find((item: any) => item.BIT240091_Id === targetId || item.id === targetId) || null;
    } catch {
      return null;
    }
  },

  // ==================== 1. DISH RESOURCE (BIT240091_Dish) ====================

  /**
   * Đẩy món mới lên MockAPI
   */
  async createDishApi(apiUrl: string, dish: BIT240091_Dish): Promise<boolean> {
    try {
      const { dishUrl } = getMockEndpoints(apiUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(dishUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: dish.BIT240091_Id,
          ...dish,
          BIT240091_SyncStatus: 'synced',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('MockAPI unreachable (createDish):', error);
      return false;
    }
  },

  /**
   * Cập nhật món trên MockAPI
   */
  async updateDishApi(apiUrl: string, dish: BIT240091_Dish): Promise<boolean> {
    try {
      const { dishUrl } = getMockEndpoints(apiUrl);
      const existing = await this.findMockApiItem(dishUrl, dish.BIT240091_Id);
      const targetId = existing?.id || dish.BIT240091_Id;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const targetUrl = `${dishUrl}/${targetId}`;
      const response = await fetch(targetUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dish,
          BIT240091_SyncStatus: 'synced',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (response.ok) return true;

      // Nếu trên MockAPI chưa có bản ghi (ví dụ tạo offline), thử POST mới
      if (!existing && response.status === 404) {
        return await this.createDishApi(apiUrl, dish);
      }

      return false;
    } catch (error) {
      console.log('MockAPI unreachable (updateDish):', error);
      return false;
    }
  },

  /**
   * Xóa món trên MockAPI
   */
  async deleteDishApi(apiUrl: string, dishId: string): Promise<boolean> {
    try {
      const { dishUrl } = getMockEndpoints(apiUrl);
      const existing = await this.findMockApiItem(dishUrl, dishId);
      const targetId = existing?.id || dishId;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const targetUrl = `${dishUrl}/${targetId}`;
      const response = await fetch(targetUrl, {
        method: 'DELETE',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok || response.status === 404;
    } catch (error) {
      console.log('MockAPI unreachable (deleteDish):', error);
      return false;
    }
  },

  // ==================== 2. CATEGORY RESOURCE (BIT240091_DishCategory) ====================

  /**
   * Đẩy loại món mới lên MockAPI
   */
  async createCategoryApi(apiUrl: string, category: BIT240091_DishCategory): Promise<boolean> {
    try {
      const { categoryUrl } = getMockEndpoints(apiUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(categoryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: category.BIT240091_Id,
          ...category,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('MockAPI unreachable (createCategory):', error);
      return false;
    }
  },

  /**
   * Xóa loại món trên MockAPI
   */
  async deleteCategoryApi(apiUrl: string, categoryId: string): Promise<boolean> {
    try {
      const { categoryUrl } = getMockEndpoints(apiUrl);
      const existing = await this.findMockApiItem(categoryUrl, categoryId);
      const targetId = existing?.id || categoryId;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const targetUrl = `${categoryUrl}/${targetId}`;
      const response = await fetch(targetUrl, {
        method: 'DELETE',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok || response.status === 404;
    } catch (error) {
      console.log('MockAPI unreachable (deleteCategory):', error);
      return false;
    }
  },

  // ==================== 3. SYNC QUEUE WORKER ====================

  /**
   * Tự động đồng bộ hàng đợi thay đổi từ Local lên MockAPI
   * Đồng bộ cho cả 2 tài nguyên: Dish và DishCategory
   */
  async processSyncQueue(
    apiUrl: string,
    onProgress?: (syncedCount: number, total: number) => void
  ): Promise<{ success: boolean; syncedCount: number; errors: number }> {
    const queue = await storageService.getSyncQueue();
    if (queue.length === 0) {
      return { success: true, syncedCount: 0, errors: 0 };
    }

    const localDishes = await storageService.getDishes();
    const localCategories = await storageService.getCategories();
    const remainingQueue: SyncQueueItem[] = [];
    let syncedCount = 0;
    let errors = 0;

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      let itemSuccess = false;

      try {
        switch (item.action) {
          case 'CREATE_DISH': {
            const dish = localDishes.find((d) => d.BIT240091_Id === item.targetId) || item.payload;
            itemSuccess = dish ? await this.createDishApi(apiUrl, dish) : true;
            break;
          }
          case 'UPDATE_DISH': {
            const dish = localDishes.find((d) => d.BIT240091_Id === item.targetId) || item.payload;
            itemSuccess = dish ? await this.updateDishApi(apiUrl, dish) : true;
            break;
          }
          case 'DELETE_DISH': {
            itemSuccess = await this.deleteDishApi(apiUrl, item.targetId);
            break;
          }
          case 'CREATE_CATEGORY': {
            const cat = localCategories.find((c) => c.BIT240091_Id === item.targetId) || item.payload;
            itemSuccess = cat ? await this.createCategoryApi(apiUrl, cat) : true;
            break;
          }
          case 'DELETE_CATEGORY': {
            itemSuccess = await this.deleteCategoryApi(apiUrl, item.targetId);
            break;
          }
          default:
            itemSuccess = true;
            break;
        }
      } catch {
        itemSuccess = false;
      }

      if (itemSuccess) {
        syncedCount++;
        // Cập nhật trạng thái bản ghi trong local thành 'synced'
        const dishIndex = localDishes.findIndex((d) => d.BIT240091_Id === item.targetId);
        if (dishIndex !== -1) {
          localDishes[dishIndex].BIT240091_SyncStatus = 'synced';
        }
      } else {
        errors++;
        remainingQueue.push(item);
      }

      if (onProgress) {
        onProgress(syncedCount, queue.length);
      }
    }

    // Lưu lại hàng đợi còn lại
    await storageService.saveSyncQueue(remainingQueue);
    await storageService.saveDishes(localDishes);

    return {
      success: errors === 0,
      syncedCount,
      errors,
    };
  },
};
