# Cau truc hinh anh

File anh trong `public/images` duoc goi bang URL bat dau bang `/images/...`.

## Nhom thu muc

- `brand/`: logo, favicon, tai san nhan dien thuong hieu.
- `banners/home/`: anh rieng cho slider trang chu.
- `projects/{project-slug}/master-plan/`: anh tong mat bang, phoi canh toan khu.
- `projects/{project-slug}/fancy-tower/`: anh toa Fancy Tower, ngoai that, tien ich, phoi canh.
- `projects/{project-slug}/supermarket/`: anh sieu thi trong khu do thi.
- `projects/{project-slug}/shopping-center/`: anh trung tam thuong mai.
- `projects/{project-slug}/hotel/`: anh khach san.
- `projects/{project-slug}/legacy/`: anh cu hoac anh chat luong thap can giu de tham chieu.
- `news/{year}/`: anh bai viet theo nam xuat ban.
- `news/legacy/`: anh tin tuc cu hoac placeholder chua dung production.

## Quy uoc ten file

- Viet thuong, khong dau, khong khoang trang.
- Dung dau gach ngang `-` de ngan cach tu.
- Bat dau bang slug noi dung: `hung-phu`, `fancy-tower`, `home-banner`.
- Them vai tro anh: `master-plan`, `exterior`, `amenity`, `aerial`, `legacy`.
- Ket thuc bang so thu tu 2 chu so khi co nhieu anh cung loai: `-01.jpg`, `-02.jpg`.
- Neu la anh tin tuc, them ngay hoac nam vao ten: `le-khoi-cong-fancy-tower-2021-04-07.jpg`.

## Vi du

- `/images/banners/home/home-banner-hung-phu-aerial-01.jpg`
- `/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-01.jpg`
- `/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-plaza-01.jpg`
- `/images/projects/hung-phu/fancy-tower/fancy-tower-amenity-pool-01.jpg`
- `/images/projects/hung-phu/supermarket/hung-phu-supermarket-interior-01.jpg`
- `/images/projects/hung-phu/shopping-center/hung-phu-shopping-center-exterior-01.jpg`
- `/images/projects/hung-phu/hotel/hung-phu-hotel-exterior-01.jpg`
- `/images/projects/hung-phu/hotel/hung-phu-hotel-bedroom-double-01.jpg`
- `/images/news/2021/le-khoi-cong-fancy-tower-2021-04-07.jpg`

## Luu y toi uu

Anh goc 8K nen duoc giu lam source noi bo, nhung khi dua vao UI production nen xuat ban web size rieng:

- Banner/hero: 1920px rong, WebP hoac JPG khoang 250-500 KB.
- Card du an/tin tuc: 1200px rong, khoang 120-250 KB.
- Khong dua file 20-35 MB truc tiep vao slider hoac card neu chua nen.
