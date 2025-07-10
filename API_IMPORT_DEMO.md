# API Import Demo

## Cách sử dụng chức năng Import từ RESTful API

### 1. Mở Import Modal

-   Vào trang Dashboard Editor
-   Click vào tab "Data" ở sidebar bên trái
-   Click button "Import Data"

### 2. Chọn tab "REST API"

-   Chuyển sang tab "REST API" trong modal

### 3. Điền thông tin API

#### Ví dụ 1: JSONPlaceholder Posts API

```
Dataset Name: JSONPlaceholder Posts
API URL: https://jsonplaceholder.typicode.com/posts
HTTP Method: GET
Max Records: 100
Timeout: 30
Flatten nested objects: ✓
```

#### Ví dụ 2: JSONPlaceholder Users API

```
Dataset Name: JSONPlaceholder Users
API URL: https://jsonplaceholder.typicode.com/users
HTTP Method: GET
Max Records: 10
Timeout: 30
Flatten nested objects: ✓
```

#### Ví dụ 3: API với Authentication

```
Dataset Name: GitHub Repos
API URL: https://api.github.com/users/octocat/repos
HTTP Method: GET
Max Records: 50
Timeout: 30
Flatten nested objects: ✓
Custom Headers: {
  "Authorization": "Bearer YOUR_GITHUB_TOKEN",
  "Accept": "application/vnd.github.v3+json"
}
```

#### Ví dụ 4: POST API với Body

```
Dataset Name: Test POST API
API URL: https://httpbin.org/post
HTTP Method: POST
Max Records: 10
Timeout: 30
Flatten nested objects: ✓
Request Body: {
  "name": "test",
  "email": "test@example.com"
}
```

### 4. API Endpoint được gọi

```bash
curl -X POST "https://localhost:7001/api/datasets/import/api" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "datasetName": "JSONPlaceholder Posts",
    "apiUrl": "https://jsonplaceholder.typicode.com/posts",
    "options": {
      "httpMethod": "GET",
      "maxRecords": 100,
      "timeoutSeconds": 30,
      "flattenNestedObjects": true
    }
  }'
```

### 5. Các tùy chọn có sẵn

#### HTTP Method

-   GET: Lấy dữ liệu từ API
-   POST: Gửi dữ liệu đến API
-   PUT: Cập nhật dữ liệu
-   DELETE: Xóa dữ liệu

#### Max Records

-   Giới hạn số lượng records được import
-   Mặc định: 100
-   Tối đa: 10,000

#### Timeout

-   Thời gian chờ API response (giây)
-   Mặc định: 30
-   Tối đa: 300

#### Flatten Nested Objects

-   Tự động làm phẳng các object lồng nhau
-   Ví dụ: `{user: {name: "John"}}` → `{user_name: "John"}`

#### Custom Headers

-   Thêm headers tùy chỉnh cho API request
-   Định dạng JSON
-   Ví dụ: Authorization, Content-Type, etc.

#### Request Body

-   Dữ liệu gửi kèm với POST/PUT/DELETE request
-   Định dạng JSON
-   Chỉ hiển thị khi HTTP Method không phải GET

### 6. Kết quả

Sau khi import thành công:

-   Dataset sẽ xuất hiện trong danh sách datasets
-   Có thể sử dụng để tạo charts trong dashboard
-   Dữ liệu được lưu trữ và có thể truy vấn

### 7. Xử lý lỗi

-   Kiểm tra URL API có hợp lệ không
-   Đảm bảo JSON format đúng cho Headers và Body
-   Kiểm tra network connection
-   Xem logs trong console để debug
