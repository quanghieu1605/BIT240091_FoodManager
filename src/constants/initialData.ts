/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * DỮ LIỆU BAN ĐẦU (SEED DATA)
 * Đảm bảo tối thiểu: >= 03 loại món ăn, >= 05 món ăn
 * Mỗi món thuộc một loại, một món có nhiều ảnh với 1 thumbnail
 */

import { BIT240091_Dish, BIT240091_DishCategory } from '@/types/dish';

export const INITIAL_CATEGORIES: BIT240091_DishCategory[] = [
  {
    BIT240091_Id: 'cat_1',
    BIT240091_Name: 'Món chính (Main Course)',
    BIT240091_Description: 'Các món ăn no đậm đà hương vị truyền thống và hiện đại',
    BIT240091_UpdatedAt: Date.now(),
  },
  {
    BIT240091_Id: 'cat_2',
    BIT240091_Name: 'Khai vị (Appetizers)',
    BIT240091_Description: 'Món nhẹ kích thích vị giác trước bữa ăn',
    BIT240091_UpdatedAt: Date.now(),
  },
  {
    BIT240091_Id: 'cat_3',
    BIT240091_Name: 'Đồ uống (Beverages)',
    BIT240091_Description: 'Trà hoa quả, nước ép tươi và cà phê',
    BIT240091_UpdatedAt: Date.now(),
  },
  {
    BIT240091_Id: 'cat_4',
    BIT240091_Name: 'Tráng miệng (Desserts)',
    BIT240091_Description: 'Bánh ngọt, kem và chè tráng miệng thanh mát',
    BIT240091_UpdatedAt: Date.now(),
  },
];

export const INITIAL_DISHES: BIT240091_Dish[] = [
  {
    BIT240091_Id: 'dish_1',
    BIT240091_Name: 'Phở Bò Tái Nạm Đặc Biệt',
    BIT240091_Price: 65000,
    BIT240091_PreparationTime: 12, // Quick (<= 15 min)
    BIT240091_IsAvailable: true,
    BIT240091_Description: 'Nước dùng hầm xương 24h thơm nức mùi quế hồi, thịt bò tái mềm ngọt kèm nạm giòn.',
    BIT240091_DishCategoryId: 'cat_1',
    BIT240091_DishImages: [
      {
        BIT240091_ImageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80',
        BIT240091_IsThumbnail: true,
      },
      {
        BIT240091_ImageUrl: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=800&auto=format&fit=crop&q=80',
        BIT240091_IsThumbnail: false,
      },
    ],
    BIT240091_UpdatedAt: Date.now(),
    BIT240091_SyncStatus: 'synced',
  },
  {
    BIT240091_Id: 'dish_2',
    BIT240091_Name: 'Cơm Tấm Sườn Bì Chả Nướng Than',
    BIT240091_Price: 55000,
    BIT240091_PreparationTime: 20, // Regular (> 15 min)
    BIT240091_IsAvailable: true,
    BIT240091_Description: 'Sườn cốt lết ướp đậm đà nướng than hoa, kèm chả trứng hấp, bì heo thơm thính và mỡ hành.',
    BIT240091_DishCategoryId: 'cat_1',
    BIT240091_DishImages: [
      {
        BIT240091_ImageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        BIT240091_IsThumbnail: true,
      },
      {
        BIT240091_ImageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
        BIT240091_IsThumbnail: false,
      },
    ],
    BIT240091_UpdatedAt: Date.now(),
    BIT240091_SyncStatus: 'synced',
  },
  {
    BIT240091_Id: 'dish_3',
    BIT240091_Name: 'Gỏi Cuốn Tôm Thịt Tươi',
    BIT240091_Price: 40000,
    BIT240091_PreparationTime: 10, // Quick (<= 15 min)
    BIT240091_IsAvailable: true,
    BIT240091_Description: 'Tôm sú tươi ngọt, thịt ba chỉ luộc, bún tươi và rau sống gói bánh tráng dẻo, chấm tương bơ đậu phộng.',
    BIT240091_DishCategoryId: 'cat_2',
    BIT240091_DishImages: [
      {
        BIT240091_ImageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
        BIT240091_IsThumbnail: true,
      },
      {
        BIT240091_ImageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
        BIT240091_IsThumbnail: false,
      },
    ],
    BIT240091_UpdatedAt: Date.now(),
    BIT240091_SyncStatus: 'synced',
  },
  {
    BIT240091_Id: 'dish_4',
    BIT240091_Name: 'Chả Giò Hải Sản Giòn Rụm',
    BIT240091_Price: 48000,
    BIT240091_PreparationTime: 18, // Regular (> 15 min)
    BIT240091_IsAvailable: false, // Món ngừng bán (để test lọc đang bán)
    BIT240091_Description: 'Vỏ rế giòn tan bọc nhân mực tôm khoai môn, chấm sốt mayonnaise chua ngọt đặc biệt.',
    BIT240091_DishCategoryId: 'cat_2',
    BIT240091_DishImages: [
      {
        BIT240091_ImageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
        BIT240091_IsThumbnail: true,
      },
    ],
    BIT240091_UpdatedAt: Date.now(),
    BIT240091_SyncStatus: 'synced',
  },
  {
    BIT240091_Id: 'dish_5',
    BIT240091_Name: 'Trà Đào Cam Sả Tươi Mát',
    BIT240091_Price: 35000,
    BIT240091_PreparationTime: 5, // Quick (<= 15 min)
    BIT240091_IsAvailable: true,
    BIT240091_Description: 'Trà đen ủ lạnh kết hợp nước cam vắt nguyên chất, hương sả thơm lừng và miếng đào giòn ngâm.',
    BIT240091_DishCategoryId: 'cat_3',
    BIT240091_DishImages: [
      {
        BIT240091_ImageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
        BIT240091_IsThumbnail: true,
      },
      {
        BIT240091_ImageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
        BIT240091_IsThumbnail: false,
      },
    ],
    BIT240091_UpdatedAt: Date.now(),
    BIT240091_SyncStatus: 'synced',
  },
  {
    BIT240091_Id: 'dish_6',
    BIT240091_Name: 'Bánh Flan Trứng Sữa Caramel',
    BIT240091_Price: 22000,
    BIT240091_PreparationTime: 8, // Quick (<= 15 min)
    BIT240091_IsAvailable: true,
    BIT240091_Description: 'Bánh flan béo ngậy vị trứng gà và sữa tươi nguyên kem, phủ sốt caramel nâu óng và cà phê đậm đà.',
    BIT240091_DishCategoryId: 'cat_4',
    BIT240091_DishImages: [
      {
        BIT240091_ImageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
        BIT240091_IsThumbnail: true,
      },
    ],
    BIT240091_UpdatedAt: Date.now(),
    BIT240091_SyncStatus: 'synced',
  },
];
