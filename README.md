# SITTA-UT (Sistem Informasi Tiras dan Transaksi Bahan Ajar)

SITTA-UT adalah sebuah aplikasi purwarupa *Single Page Application* (SPA) berbasis web yang dirancang khusus untuk memanajemen inventaris bahan ajar dan pelacakan pengiriman (Delivery Order) antar cabang di lingkungan Universitas Terbuka. Aplikasi ini mengandalkan ekosistem **Vue.js 2** untuk menyajikan antarmuka pengguna yang dinamis, cepat, dan reaktif.

Aplikasi ini merupakan hasil pengembangan (Refaktoring) dari Tugas 2, di mana arsitektur dirombak total menjadi arsitektur berbasis *Vue Component* dan *Template* untuk memenuhi kriteria Tugas Praktik 3 - Pemrograman Berbasis Web.

## 🚀 Fitur yang Berubah (Dibandingkan dengan Tugas 2)

Jika pada Tugas 2 aplikasi ditulis dalam satu file HTML (*monolithic*), pada versi terbaru ini (Tugas 3) aplikasi telah mengalami perombakan besar *(Refactoring)*:

1. **Arsitektur Modular (Komponen & Template)**: Pemecahan antarmuka menjadi komponen terpisah seperti `<app-navbar>`, `<stok-table>`, `<do-tracking>`, dsb. Setiap komponen memiliki file JS dan template HTML-nya sendiri.
2. **Pemindahan Data ke JSON**: Seluruh data statis yang tadinya ditanam di Javascript (hardcoded array) kini dipisahkan ke dalam satu pusat data `data/dataBahanAjar.json`.
3. **Penerapan Service Layer (API)**: Memanggil template komponen dan data JSON secara asinkron menggunakan fungsi `fetch()` melalui modul `js/services/api.js`.
4. **Single Page Application (SPA)**: Perpindahan halaman antar menu (Login -> Dashboard -> Stok -> Tracking) tidak lagi melakukan *reload* halaman, melainkan hanya *mounting/unmounting* komponen Vue yang sesuai berdasarkan state URL *(hash routing)*.
5. **Fitur Tooltip Reaktif**: Catatan bahan ajar yang berisi format tag HTML kini tidak lagi memakan banyak ruang di tabel, melainkan disembunyikan dan akan muncul secara mulus sebagai *tooltip* saat kursor diarahkan *(hover)* ke status badge.
6. **Integrasi Event Keyboard**: Penambahan fungsionalitas mumpuni untuk *User Experience*, seperti kemampuan menyimpan formulir dengan menekan tombol **Enter**, atau membersihkan kolom pencarian dengan tombol **Esc**.
7. **Penambahan Fitur Baru**: Penambahan fitur konfirmasi hapus data stok menggunakan SweetAlert2, dan formulir untuk meng-*update* sejarah riwayat (progress) pelacakan paket Delivery Order.

## 📁 Struktur Direktori

Aplikasi ini disusun sedemikian rupa agar modular dan mudah dirawat:

```text
SITTA-UT/
│
├── index.html                   # Entry point utama aplikasi (Shell SPA)
├── README.md                    # Dokumentasi repositori
│
├── assets/
│   ├── css/
│   │   └── style.css            # Gaya CSS gabungan
│   └── img/                     # Ikon/gambar (opsional)
│
├── data/
│   └── dataBahanAjar.json       # Sumber data (JSON)
│
├── js/
│   ├── app.js                   # Inisialisasi Vue root
│   ├── services/
│   │   └── api.js               # fetch JSON (data service), menangani data akses
│   └── components/              # Tempat logika Custom Element Vue
│       ├── app-dashboard.js
│       ├── app-login.js
│       ├── app-modal.js
│       ├── app-navbar.js
│       ├── do-tracking.js
│       ├── order-form.js
│       ├── status-badge.js
│       └── stok-table.js
│
└── templates/                   # Tempat struktur UI (HTML) masing-masing komponen
    ├── app-dashboard.html
    ├── app-login.html
    ├── app-modal.html
    ├── app-navbar.html
    ├── do-tracking.html
    ├── order-form.html
    ├── status-badge.html
    └── stok-table.html
```

## 🛠️ Cara Menjalankan Aplikasi

Karena aplikasi ini menggunakan fungsi `fetch()` untuk mengambil file JSON lokal dan me-*load* *template* HTML secara asinkron, **browser akan memblokir proses tersebut jika file dijalankan secara langsung dengan double-click pada `index.html` (protokol `file:///`)**. Hal ini disebabkan oleh mekanisme keamanan *Cross-Origin Resource Sharing (CORS)*.

Oleh karena itu, Anda **wajib menggunakan Local Web Server**. 

### Menggunakan Visual Studio Code (Rekomendasi)
1. Buka folder repositori ini ke dalam Visual Studio Code.
2. Pastikan Anda telah menginstal ekstensi **"Live Server"** buatan Ritwick Dey.
3. Klik tombol **"Go Live"** di bilah status kanan bawah VS Code.
4. Browser akan otomatis terbuka dan menampilkan aplikasi secara normal.

### Login Kredensial
Untuk masuk ke dalam sistem, gunakan kredensial bawaan berikut:
- **Email:** `admin@ut.ac.id`
- **Password:** `admin123`

---
*Dikembangkan untuk Tugas Praktikum 3 - Pemrograman Berbasis Web.*
