/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * MOCKAPI REST SERVICE & AUTOMATIC SYNC WORKER
 * Hỗ trợ giao tiếp REST API (GET, POST, PUT, DELETE) và tự động đồng bộ khi có mạng lại.
 */

import { BIT240091_Dish, SyncQueueItem } from '@/types/dish';
import { storageService } from './storage';

export const mockApiService = {
  /**
   * Gọi MockAPI lấy danh sách món ăn
   */
  async fetchDishesFromApi(apiUrl: string): Promise<BIT240091_Dish[] | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return Array.isArray(data) ? data : null;
    } catch (error) {
      console.log('MockAPI unreachable (fetchDishes):', error);
      return null;
    }
  },

  /**
   * Đẩy món mới lên MockAPI
   */
  async createDishApi(apiUrl: string, dish: BIT240091_Dish): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      // Thử PUT theo id
      const targetUrl = `${apiUrl}/${dish.BIT240091_Id}`;
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
      return response.ok;
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const targetUrl = `${apiUrl}/${dishId}`;
      const response = await fetch(targetUrl, {
        method: 'DELETE',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('MockAPI unreachable (deleteDish):', error);
      return false;
    }
  },

  /**
   * Tự động đồng bộ hàng đợi thay đổi từ Local lên MockAPI
   * Được gọi tự động mỗi khi phát hiện có mạng trở lại (không cần bấm nút)
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
            if (dish) {
              itemSuccess = await this.createDishApi(apiUrl, dish);
            } else {
              itemSuccess = true; // Món không còn tồn tại, bỏ qua
            }
            break;
          }
          case 'UPDATE_DISH': {
            const dish = localDishes.find((d) => d.BIT240091_Id === item.targetId) || item.payload;
            if (dish) {
              itemSuccess = await this.updateDishApi(apiUrl, dish);
            } else {
              itemSuccess = true;
            }
            break;
          }
          case 'DELETE_DISH': {
            itemSuccess = await this.deleteDishApi(apiUrl, item.targetId);
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

    // Lưu lại hàng đợi còn lại (nếu có lỗi mạng dở chừng)
    await storageService.saveSyncQueue(remainingQueue);
    await storageService.saveDishes(localDishes);

    return {
      success: errors === 0,
      syncedCount,
      errors,
    };
  },
};
