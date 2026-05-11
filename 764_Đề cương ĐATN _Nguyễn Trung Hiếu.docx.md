

| ![logo][image1] | TRƯỜNG ĐẠI HỌC THUỶ LỢI KHOA CÔNG NGHỆ THÔNG TIN  BẢN TÓM TẮT ĐỀ CƯƠNG ĐỒ ÁN TỐT NGHIỆP |
| :---: | :---: |

**Tên đề tài:**

**XÂY DỰNG HỆ THỐNG QUẢN LÝ CHO QUÁN BIDA MHBILLIARDS TÍCH HỢP AI NHẬN DIỆN KHÁCH HÀNG**

***Sinh viên thực hiện*****:** Nguyễn Trung Hiếu

***Lớp*****:** 63HTTT1

***Mã sinh viên:*** 2151160501

***Số điện thoại:*** 0868372886

Email: hieutrung1623@gmail.com

***Giáo viên hướng dẫn*****:** Đỗ Oanh Cường

**TÓM TẮT ĐỀ TÀI**

Trong thời đại chuyển đổi số (Digital Transformation), việc ứng dụng công nghệ thông tin vào hoạt động quản lý kinh doanh đang trở thành xu hướng tất yếu nhằm nâng cao hiệu quả vận hành, giảm chi phí nhân sự và tăng khả năng cạnh tranh. Đặc biệt đối với các mô hình kinh doanh dịch vụ giải trí như quán bida, việc quản lý thủ công bằng sổ sách hoặc các phần mềm rời rạc dễ dẫn đến nhiều hạn chế như:

* Khó kiểm soát trạng thái bàn theo thời gian thực  
* Dễ xảy ra sai sót trong tính tiền  
* Khó thống kê doanh thu chính xác  
* Không theo dõi được lịch sử khách hàng  
* Quản lý tồn kho dịch vụ chưa hiệu quả  
* Không hỗ trợ phân tích dữ liệu kinh doanh

Xuất phát từ thực tế đó, đề tài **"Xây dựng hệ thống quản lý cho quán bida MHBilliards tích hợp AI nhận diện khuôn mặt"** được thực hiện nhằm xây dựng một hệ thống quản lý tập trung, hiện đại và có khả năng mở rộng, giúp số hóa toàn bộ quy trình vận hành của quán bida.

Hệ thống được thiết kế dưới dạng một **web application**, cho phép nhân viên và quản lý truy cập thông qua trình duyệt mà không cần cài đặt phần mềm, giúp tăng tính linh hoạt trong sử dụng.

***Công nghệ sử dụng:***

* Ngôn ngữ lập trình Frontend: ReactJS \- NextJS

* Ngôn ngữ lập trình Backend: Java \- Java SpringBoot

* Database: MySQL

**MỤC TIÊU KPI**

1. Tự động hóa 100% quy trình tính tiền giờ.  
2. Giảm 50% thời gian check-in khách hàng thân thiết nhờ AI.  
3. Cung cấp hệ thống báo cáo doanh thu và hành vi khách hàng chính xác 100%.

**PHÂN TÍCH NGHIỆP VỤ & QUY TRÌNH (BPMN)**

Hệ thống tập trung vào 3 luồng nghiệp vụ chính (Business Processes):

* Quy trình Phục vụ: Mở bàn → Gọi dịch vụ/Combo → Thanh toán.  
* Quy trình Nhận diện (AI Workflow): Camera quét → Trích xuất Feature Vector → So khớp DB → Hiển thị Profile khách (Tên, hạng, sở thích).  
* Quy trình Quản trị: Quản lý kho , tính lương nhân viên , và kết xuất báo cáo.

Đối tượng người dùng và vai trò (User Role):

* Admin(Quản trị viên): Toàn quyền sử dụng hệ thống, xem báo cáo doanh thu toàn bộ chi nhánh, quản lý bàn, điều chỉnh giá tiền bàn, combo và các dịch vụ khác  
* Manager(Quản lý): Quản lý theo từng chi nhánh, Xem doanh thu theo chi nhánh quản lý, toàn quyền điều chỉnh theo chi nhánh đó   
* Employee(Nhân viên): Sử dụng chức năng quản lý bàn, thanh toán cho khách

**KIẾN TRÚC HỆ THỐNG & DỮ LIỆU**

**Mô hình:** Client-Server (Frontend: ReactJS/NextJS \- Backend: Java SpringBoot ).

**Dữ liệu:**

* Ingest: Tiếp nhận dữ liệu từ Camera và Transaction.

* Clean/Transform: Chuẩn hóa dữ liệu hóa đơn và xử lý ảnh khuôn mặt.  
* Store: Lưu trữ tập trung tại MySQL.

**Tính năng bổ sung:** Export báo cáo định dạng Excel/PDF.

* Hệ thống Logging & Error Handling để đảm bảo tính sẵn sàng..

**Các Công nghệ sử dụng:**

| Thành phần | Công nghệ | Vai trò | Thực thể/ Dữ liệu chính |
| :---- | :---- | :---- | :---- |
| Backend RESTful API | Java SpringBoot | Xử lý logic nghiệp vụ và Security | API Route, Business Logic |
| Frontend | NextJs | UI/UX & Dashboard trực quan | Dashboards |
| Database | MySQL | Lưu trữ dữ liệu cấu trúc | Table, TableSession, Branch, Invoice, Employee,User |
| Security | JWT | Phân quyền theo role người dùng | User, UserRole |
| DevOps | Docker | Container hóa & Triển khai | Deployment Image |

**Giải pháp Thông minh:** Tích hợp AI và Computer Vision trong Quản lý Quán Bida

Sự vượt trội của hệ thống nằm ở việc chuyển đổi từ quản lý thủ công sang quản lý tự động hóa trải nghiệm người dùng, tối ưu hóa quy trình chăm sóc khách hàng thông qua lớp xử lý hình ảnh thông minh.

* **Xử lý Dữ liệu Hình ảnh**: Hệ thống xây dựng Pipeline từ việc Capture luồng video tại quầy/cửa \-\> Detect (Phát hiện khuôn mặt) \-\> Pre-processing (Căn chỉnh, khử nhiễu) trước khi đưa vào mô hình trích xuất đặc trưng (Feature Extraction).

* **Nhận diện Khách hàng (Identity Recognition):** Ứng dụng thuật toán Deep Learning (như FaceNet hoặc ArcFace) để định danh khách hàng từ Dataset thành viên. Hệ thống tự động đối chiếu đặc trưng khuôn mặt với cơ sở dữ liệu để xác định hạng thẻ (VVIP, VIP, Standard) trong thời gian thực.

* **Phân phối Ưu đãi Thông minh (Prescriptive Analytics):** Dựa trên định danh, AI kết nối với module quản lý để tự động áp dụng Mã giảm giá cá nhân hóa. Nếu khách hàng là hội viên thân thiết hoặc có tần suất chơi cao, hệ thống sẽ đề xuất các voucher giảm giá giờ chơi hoặc dịch vụ đi kèm ngay tại màn hình check-in.

* **Phân tích Hành vi và Tần suất (Predictive Analytics):** Sử dụng mô hình thống kê để dự báo khung giờ khách hay đến và loại bàn ưa thích. Điều này giúp chủ quán chủ động sắp xếp tài nguyên và đưa ra các kịch bản khuyến mãi "giờ vàng" nhằm tối ưu hóa công suất hoạt động của quán.

**CÁC MỤC TIÊU CHỨC NĂNG CHÍNH**

1. Quản lý Bàn & Dịch vụ: Thêm/Sửa/Xóa, theo dõi trạng thái, quản lý Combo và giờ vàng.  
2. Quản lý Khách hàng & AI: Tự động nhận diện, phân loại khách hàng và lưu lịch sử giao dịch.  
3. Quản lý Nhân sự: Ca làm việc và tính lương thưởng.  
4. Thống kê Dashboard: Biểu đồ doanh thu theo ngày/tháng/năm và sản phẩm bán chạy.

**KẾT QUẢ DỰ KIẾN**

***Lý thuyết:***

- Kiến thức về phân tích và thiết kế hệ thống

- Kiến thức về thiết kế cơ sở dữ liệu

- Kiến thức về lập trình web hiện đại

- Kiến thức về bảo mật hệ thống

***Kỹ năng:***

- Rèn luyện kỹ năng quản lý thời gian và tiến độ phát triển phần mềm.

- Cải thiện kỹ năng phân tích, thiết kế và xây dựng hệ thống.

- Nâng cao kỹ năng lập trình và triển khai ứng dụng trên nhiều nền tảng.

***Sản phẩm:***

- Xây dựng thành công website quản lý cho quán bida **MHBilliards** với đầy đủ tính năng đã đề ra.

- Hoàn thiện báo cáo đồ án tốt nghiệp theo yêu cầu.

# 

# KẾ HOẠCH TIẾN ĐỘ THỰC HIỆN ĐỒ ÁN

| Giai đoạn | Thời gian | Công việc | Kết quả |
| :---: | ----- | ----- | ----- |
| Phân tích | Tuần 1 | Khảo sát yêu cầu | Danh sách yêu cầu hệ thống |
|  | Tuần 2 | Vẽ UML | Use Case, Activity Diagram |
|  | Tuần 3 | Thiết kế DB | ERD và cấu trúc API |
| Backend | Tuần 4 \+ 5 | Authentication & Core modules | \- API đăng nhập, phân quyền \- CRUD bàn, dịch vụ, nhân viên,… |
|  | Tuần 6 | Business logic | Hóa đơn, phiên chơi, thống kê,.. |
| Frontend | Tuần 7 | Layout & Các trang quản lý | \- Dashboard layout \- UI quản lý cho các module nhân viên, bàn, combo,…  |
|  | Tuần 8 | Dịch vụ & hóa đơn | UI thanh toán |
|  | Tuần 9 | Thống kê | Biểu đồ doanh thu |
| Tích hợp AI | Tuần 10 | Nghiên cứu & xây dựng nhận diện khuôn mặt | Hoàn thành module nhận diện khuôn mặt và API nhận diện khách hàng |
|  | Tuân 11 | Tích hợp vào hệ thống | Tích hợp AI vào hệ thống, nhận diện khách realtime và hiển thị thông tin khách |
| Testing & Fix bug | Tuần 12 | Test FE & BE | Test nghiệp vụ và giao diện |
|  | Tuần 13 | Fix bug | Sửa lỗi hệ thống |
| Báo cáo và slide thuyết trình | Tuần 14 | Viết báo cáo | File Word hoàn chỉnh |
|  | Tuần 15 | Làm slide | PowerPoint bảo vệ |

[image1]: <data:image/png;base64,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>