/**
 * DATA BAHAN AJAR - SITTA UT (Tugas 2 Vue.js)
 * Data stok bahan ajar untuk seluruh UT-Daerah
 */
var upbjjList = ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"];
var kategoriList = ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"];

var dataStokBahanAjar = [
  { kode: "EKMA4116", judul: "Pengantar Manajemen", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>" },
  { kode: "EKMA4115", judul: "Pengantar Akuntansi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>" },
  { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah" },
  { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder" },
  { kode: "MKDU4111", judul: "Pendidikan Kewarganegaraan", kategori: "MK Wajib", upbjj: "Padang", lokasiRak: "R1-D1", harga: 50000, qty: 0, safety: 12, catatanHTML: "<strong style='color:red'>KOSONG!</strong> Segera reorder" },
  { kode: "PAUD4401", judul: "Perkembangan Anak Usia Dini", kategori: "Problem-Based", upbjj: "Denpasar", lokasiRak: "R4-E2", harga: 72000, qty: 35, safety: 15, catatanHTML: "Edisi revisi <em>2025</em>" },
  { kode: "EKMA4216", judul: "Manajemen Pemasaran", kategori: "MK Pilihan", upbjj: "Surabaya", lokasiRak: "R2-B3", harga: 68000, qty: 5, safety: 10, catatanHTML: "Perlu <u>update materi</u> bab 7" },
  { kode: "ISIP4130", judul: "Pengantar Ilmu Hukum", kategori: "MK Wajib", upbjj: "Makassar", lokasiRak: "R1-C3", harga: 58000, qty: 0, safety: 10, catatanHTML: "<strong>KOSONG!</strong> Menunggu cetak ulang" },
  { kode: "PDGK4301", judul: "Evaluasi Pembelajaran di SD", kategori: "Problem-Based", upbjj: "Jakarta", lokasiRak: "R4-A1", harga: 62000, qty: 18, safety: 12, catatanHTML: "Dilengkapi <em>instrumen asesmen</em>" },
  { kode: "SATS4121", judul: "Metode Statistika", kategori: "Praktikum", upbjj: "Padang", lokasiRak: "R3-D2", harga: 75000, qty: 3, safety: 8, catatanHTML: "Kit praktikum <u>belum dikirim</u>" },
  { kode: "SKOM4101", judul: "Pengantar Ilmu Komunikasi", kategori: "MK Wajib", upbjj: "Denpasar", lokasiRak: "R1-E1", harga: 53000, qty: 22, safety: 15, catatanHTML: "Edisi terbaru <em>2024</em>" },
  { kode: "MATA4110", judul: "Kalkulus I", kategori: "MK Wajib", upbjj: "Surabaya", lokasiRak: "R1-B1", harga: 70000, qty: 0, safety: 10, catatanHTML: "<strong>Stok habis</strong>, estimasi cetak 2 minggu" },
  { kode: "ADBI4235", judul: "Keselamatan dan Kesehatan Kerja", kategori: "MK Pilihan", upbjj: "Jakarta", lokasiRak: "R2-A5", harga: 63000, qty: 14, safety: 10, catatanHTML: "Termasuk <em>modul praktik lapangan</em>" },
  { kode: "BIOL4310", judul: "Genetika", kategori: "Praktikum", upbjj: "Denpasar", lokasiRak: "R3-E1", harga: 85000, qty: 6, safety: 12, catatanHTML: "Kit lab <u>simpan di suhu ruang</u>" },
  { kode: "HKUM4209", judul: "Ilmu Negara", kategori: "MK Pilihan", upbjj: "Padang", lokasiRak: "R2-D3", harga: 57000, qty: 25, safety: 10, catatanHTML: "Edisi <em>revisi 2023</em>" },
  { kode: "PGSD4302", judul: "Pembelajaran Terpadu di SD", kategori: "Problem-Based", upbjj: "Makassar", lokasiRak: "R4-C2", harga: 66000, qty: 1, safety: 8, catatanHTML: "Hampir habis, <i>segera order</i>" },
  { kode: "KIMIA4210", judul: "Kimia Anorganik (Praktikum)", kategori: "Praktikum", upbjj: "Padang", lokasiRak: "R3-D4", harga: 90000, qty: 9, safety: 8, catatanHTML: "Kit berisi <u>bahan kimia</u>, simpan di lemari khusus" },
  { kode: "ESPA4122", judul: "Matematika Ekonomi", kategori: "MK Wajib", upbjj: "Denpasar", lokasiRak: "R1-E3", harga: 61000, qty: 4, safety: 10, catatanHTML: "Perlu <em>suplemen soal latihan</em>" }
];

var dataPaket = [
  { kode: "PKT-MAN-01", nama: "Paket Dasar Manajemen (EKMA)", isi: ["EKMA4116 - Pengantar Manajemen", "EKMA4115 - Pengantar Akuntansi"], harga: 125000 },
  { kode: "PKT-SCI-02", nama: "Paket Praktikum Sains (BIOL)", isi: ["BIOL4201 - Biologi Umum (Praktikum)", "SATS4121 - Metode Statistika (Praktikum)"], harga: 155000 },
  { kode: "PKT-FISIP-03", nama: "Paket Dasar Sosial & Hukum (ISIP)", isi: ["FISIP4001 - Dasar-Dasar Sosiologi", "ISIP4130 - Pengantar Ilmu Hukum"], harga: 113000 },
  { kode: "PKT-PAUD-04", nama: "Paket PAUD & Problem-Based (PAUD)", isi: ["PAUD4401 - Perkembangan Anak Usia Dini", "PDGK4301 - Evaluasi Pembelajaran SD"], harga: 134000 }
];