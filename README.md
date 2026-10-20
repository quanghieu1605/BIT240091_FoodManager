# BIT240091_FoodManager - Ứng Dụng Quản Lý Món Ăn
> **ĐỀ KIỂM TRA GIỮA KỲ | MÔN: PHÁT TRIỂN ỨNG DỤNG DI ĐỘNG**  
> **Sinh viên thực hiện:** BIT240091  
> **Tên dự án:** BIT240091_FoodManager  
> **Công nghệ:** React Native (Expo SDK 58, Expo Router) + TypeScript  
> **Hình thức lưu trữ:** Local AsyncStorage + MockAPI REST (Tự động đồng bộ hai chiều)  

---

## 1. Thiết Kế Dữ Liệu & Quy Định Đặt Tên (MSSV: BIT240091)

Tất cả các bảng (Storage Table) và trường dữ liệu (Field/Column) khi lưu trữ đều có tiền tố **`BIT240091_`** theo đúng quy định đề bài:

### Bảng 1: `BIT240091_DishCategory` (Loại món ăn)
- `BIT240091_Id`: Mã loại món ăn (string).
- `BIT240091_Name`: Tên loại món ăn (string, không rỗng).
- `BIT240091_Description`: Mô tả loại món ăn (string).
- `BIT240091_UpdatedAt`: Thời điểm cập nhật (number timestamp).

### Bảng 2: `BIT240091_Dish` (Món ăn)
- `BIT240091_Id`: Mã món ăn (string).
- `BIT240091_Name`: Tên món ăn (string, không rỗng, không trùng trong cùng 1 loại).
- `BIT240091_Price`: Giá bán (number, > 0).
- `BIT240091_PreparationTime`: Thời gian chế biến tính bằng phút (number, > 0).
- `BIT240091_IsAvailable`: Trạng thái đang bán (boolean).
- `BIT240091_Description`: Mô tả chi tiết món ăn (string).
- `BIT240091_DishCategoryId`: Khóa ngoại liên kết tới loại món ăn (string, hợp lệ).
- `BIT240091_DishImages`: Danh sách hình ảnh gồm:
  - `BIT240091_ImageUrl`: Đường dẫn ảnh (string).
  - `BIT240091_IsThumbnail`: Đánh dấu ảnh đại diện (boolean, tối đa 01 ảnh là true).
- `BIT240091_UpdatedAt`: Thời gian cập nhật.
- `BIT240091_SyncStatus`: Trạng thái đồng bộ (`'synced' | 'created_offline' | 'updated_offline' | 'deleted_offline'`).

---

## 2. Cấu Trúc Thư Mục Dự Án

```
BIT240091_FoodManger/
├── src/
│   ├── app/                         # Expo Router screens
│   │   ├── _layout.tsx              # Root Stack Navigator & FoodProvider
│   │   ├── index.tsx                # Màn hình Danh sách món ăn (Tìm kiếm, Lọc, Sắp xếp, FAB)
│   │   ├── categories.tsx           # Màn hình Quản lý loại món (Chặn xóa khi đang sử dụng)
│   │   ├── settings.tsx             # Màn hình Cài đặt, Đa ngôn ngữ, Giả lập Offline & Auto Sync
│   │   └── dish/
│   │       ├── [id].tsx             # Màn hình Chi tiết món ăn (Gallery ảnh, Đổi thumbnail, Xóa)
│   │       ├── create.tsx           # Màn hình Thêm món ăn mới (Form + Validation)
│   │       └── edit/[id].tsx        # Màn hình Chỉnh sửa món ăn (Pre-fill + Validation)
│   ├── components/                  # UI Components tái sử dụng
│   │   ├── StudentBanner.tsx        # Banner hiển thị MSSV: BIT240091, mạng và nút chuyển ngôn ngữ
│   │   ├── DishCard.tsx             # Thẻ món ăn (Badge Quick/Regular, Trạng thái bán, Giá)
│   │   └── FilterModal.tsx          # Modal phối hợp đồng thời tìm kiếm, lọc loại, giá, sắp xếp
│   ├── constants/
│   │   ├── initialData.ts           # Dữ liệu ban đầu (04 loại món ăn, 06 món ăn phong phú)
│   │   └── translations.ts          # Từ điển song ngữ (English mặc định & Tiếng Việt)
│   ├── context/
│   │   └── FoodContext.tsx          # Global Context quản lý state, filters, validation, sync
│   ├── services/
│   │   ├── storage.ts               # Local AsyncStorage service với tiền tố BIT240091_
│   │   └── mockApi.ts               # Giao tiếp MockAPI REST & Auto Sync Queue Worker
│   └── types/
│       └── dish.ts                  # TypeScript Interfaces chuẩn tiền tố BIT240091_
├── app.json                         # Cấu hình Expo (Tên dự án BIT240091_FoodManger)
└── package.json
```

---

## 3. Các Chức Năng Đã Hoàn Thành Theo Barem Điểm (10/10)

| STT | Nội dung đánh giá | Điểm | Hiện thực trong mã nguồn |
|:---:|:---|:---:|:---|
| **1** | Thiết kế 02 model, dữ liệu tối thiểu, validation và lưu/đọc dữ liệu | **0.75** | `src/types/dish.ts`, `src/constants/initialData.ts`, `src/services/storage.ts` |
| **2** | Giao diện danh sách/chi tiết; thêm, sửa, xóa; chọn loại món và cập nhật | **1.25** | `src/app/index.tsx`, `src/app/dish/[id].tsx`, `create.tsx`, `edit/[id].tsx` |
| **3** | Tìm kiếm, lọc nhiều điều kiện, sắp xếp và giữ trạng thái bộ lọc | **0.75** | `src/components/FilterModal.tsx`, `src/context/FoodContext.tsx` |
| **4** | Quản lý nhiều ảnh, lựa chọn/thay đổi ảnh đại diện | **0.50** | `src/app/dish/[id].tsx`, `src/app/dish/create.tsx`, `edit/[id].tsx` |
| **5** | Phân loại thời gian (Quick/Regular), ràng buộc nghiệp vụ, xử lý lỗi | **0.50** | `src/types/dish.ts` (`getPreparationTimeType`), `src/app/categories.tsx` |
| **6** | Giao diện English mặc định, chuyển đổi Tiếng Việt và duy trì ngôn ngữ | **0.75** | `src/constants/translations.ts`, AsyncStorage `BIT240091_Language` |
| **7** | Nâng cao: Hoạt động offline (0.5đ) & Tự động đồng bộ local ↔ MockAPI (1.0đ) | **1.50** | `@react-native-community/netinfo`, `src/services/mockApi.ts`, Toggle Offline |
| **8** | Video 1 (Demo ứng dụng) & Video 2 (Thuyết minh mã nguồn) | **4.00** | Có kịch bản chi tiết bên dưới |

---

## 4. Hướng Dẫn Chạy Ứng Dụng

```bash
# Cài đặt thư viện (nếu cần)
npm install

# Kiểm tra TypeScript
npx tsc --noEmit

# Kiểm tra Linting
npx expo lint

# Khởi động ứng dụng
npx expo start
```
- Nhấn `w` để mở trên Web trình duyệt.
- Quét mã QR bằng ứng dụng Expo Go trên thiết bị Android / iOS thật.
- Nhấn `a` để mở trên Android Emulator.

---

## 5. Kịch Bản Quay Video Nộp Bài

### 🎬 Video 1: Quay Màn Hình Demo Ứng Dụng (2.0 Điểm) - *Nộp Trong Ca Học*
1. **Mở đầu (0:00 - 0:20):**
   - Chỉ vào Banner trên cùng của app: Thấy rõ MSSV: **`BIT240091`** và tên dự án **`BIT240091_FoodManager`**.
   - Bấm nút chuyển ngôn ngữ **EN ↔ VI** ở góc phải để chứng minh giao diện mặc định English và chuyển mượt mà sang Tiếng Việt.
2. **Danh sách, Phân loại thời gian & Tìm kiếm / Lọc (0:20 - 1:00):**
   - Lướt danh sách món ăn: Chỉ vào các nhãn thời gian **"⚡ Quick (≤15m)"** (ví dụ Phở Bò 12m) và **"⏱️ Regular (>15m)"** (Cơm Tấm 20m).
   - Nhập tìm kiếm một phần tên: Gõ `"Phở"` -> danh sách lọc còn 1 món -> xóa ô tìm kiếm.
   - Bấm nút Bộ Lọc (Filter):
     - Chọn Loại: `"Khai vị"`.
     - Chọn Trạng thái: `"Đang bán"`.
     - Nhập Khoảng giá: `30000` đến `50000`.
     - Chọn Sắp xếp: `"Giá: Tăng dần"`.
     - Bấm Áp dụng -> Thấy kết quả lọc đúng.
     - Bấm vào xem 1 món rồi bấm Back -> Bộ lọc vẫn được giữ nguyên.
3. **Chi tiết & Quản lý Ảnh (1:00 - 1:30):**
   - Mở chi tiết món `"Phở Bò Tái Nạm Đặc Biệt"`.
   - Xem bộ sưu tập ảnh (Gallery) gồm nhiều ảnh.
   - Bấm chọn ảnh thứ 2 và bấm nút **"Chọn làm ảnh đại diện" (Set as Thumbnail)** -> Thấy huy hiệu ngôi sao chuyển sang ảnh mới.
4. **Thêm món & Kiểm tra Validation (1:30 - 2:00):**
   - Bấm nút **"+" Thêm món**.
   - Thử bấm Lưu khi chưa nhập tên -> Báo lỗi: *"Tên món không được để trống"*.
   - Nhập tên trùng trong cùng loại -> Báo lỗi: *"Tên món đã tồn tại trong cùng loại món ăn này"*.
   - Nhập món mới: *"Bún Bò Huế"*, chọn Loại Món Chính, Giá `60000`, Thời gian `10` phút (thấy huy hiệu preview chuyển thành **Quick**). Thêm URL ảnh.
   - Bấm Lưu -> Món mới xuất hiện ngay trên danh sách.
5. **Chỉnh sửa & Xóa món (2:00 - 2:30):**
   - Mở món vừa tạo, bấm **Chỉnh sửa**, sửa giá thành `62000`, bấm Cập nhật.
   - Bấm **Xóa** -> Xuất hiện Alert xác nhận -> Xác nhận xóa -> Món biến mất khỏi danh sách.
6. **Quản lý loại món & Ràng buộc nghiệp vụ (2:30 - 3:00):**
   - Bấm icon Danh mục ở thanh trên cùng.
   - Thử bấm icon Thùng rác xóa *"Món chính"* (đang có 2 món ăn) -> App cảnh báo ngay: *"Không thể xóa loại món đang có món ăn sử dụng"*.
   - Thêm một loại món mới không có món ăn nào, sau đó xóa thành công.
7. **Demo Nâng Cao: Hoạt động Offline & Tự Động Đồng Bộ (3:00 - 3:45):**
   - Mở màn hình **Cài đặt & Đồng bộ** (icon bánh răng).
   - Bật công tắc **"Simulate Offline Mode (For Demo)"** -> Đèn chuyển sang màu vàng **"Offline"**.
   - Quay lại màn hình chính, bấm **Thêm món** mới trong khi đang Offline: *"Mì Quảng Đặc Biệt"* -> Món được lưu ngay vào bộ nhớ Local (AsyncStorage), hiển thị biểu tượng Offline Sync.
   - Quay lại Cài đặt: Thấy thông báo *"1 thay đổi chờ đồng bộ lên server"*.
   - **Tắt công tắc Offline Mode** (Giả lập có mạng trở lại):
   - Quan sát thấy app **TỰ ĐỘNG ĐỒNG BỘ** (Syncing -> Synced) mà không cần người dùng bấm nút Đồng bộ!
   - Dữ liệu nhất quán, không trùng lặp.

---

### 🎥 Video 2: Thuyết Minh Mã Nguồn (2.0 Điểm) - *Hạn 23/10/2026*
1. **Cấu trúc & Tiền tố MSSV (0:00 - 1:00):**
   - Mở `src/types/dish.ts` và `src/services/storage.ts`: Chỉ rõ tên bảng `BIT240091_DishCategory`, `BIT240091_Dish` và các trường `BIT240091_Id`, `BIT240091_Name`, `BIT240091_Price`, v.v. đều có tiền tố MSSV `BIT240091_`.
2. **Xử lý Validation & Ràng buộc (1:00 - 2:00):**
   - Mở `src/context/FoodContext.tsx`:
     - Hàm `addDish`: kiểm tra Name rỗng, Price > 0, PrepTime > 0, và tên món trùng trong cùng loại:
       `d.BIT240091_DishCategoryId === dishData.BIT240091_DishCategoryId && d.BIT240091_Name.toLowerCase() === dishData.BIT240091_Name.toLowerCase()`.
     - Hàm `deleteCategory`: giải thích kiểm tra ràng buộc không cho xóa loại món đang có món ăn sử dụng:
       `dishes.some(d => d.BIT240091_DishCategoryId === categoryId)`.
3. **Phân loại thời gian & Đa ngôn ngữ (2:00 - 3:00):**
   - Mở hàm `getPreparationTimeType`: `<= 15` là Quick, ngược lại Regular (tính toán runtime, không lưu cột thừa).
   - Mở `src/constants/translations.ts`: Giải thích cơ chế i18n không cần thư viện ngoài, lưu ngôn ngữ đã chọn vào AsyncStorage `BIT240091_Language`.
4. **Cơ chế Offline & Tự động đồng bộ MockAPI (3:00 - 4:00):**
   - Mở `src/services/mockApi.ts` và `src/context/FoodContext.tsx`:
     - Giải thích `NetInfo.addEventListener` phát hiện có mạng trở lại.
     - Khi offline: lưu AsyncStorage và ghi vào `SyncQueueItem` (`BIT240091_SyncQueue`).
     - Khi có mạng: `triggerAutoSync()` tự động kích hoạt, duyệt qua queue gọi REST API (POST/PUT/DELETE) lên MockAPI, cập nhật `BIT240091_SyncStatus = 'synced'`.
