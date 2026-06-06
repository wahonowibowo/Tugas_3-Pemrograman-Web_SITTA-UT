var dataPengguna = [
  {
    id: 1,
    nama: "Rina Wulandari",
    email: "rina@ut.ac.id",
    password: "rina123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Jakarta"
  },
  {
    id: 2,
    nama: "Agus Pranoto",
    email: "agus@ut.ac.id",
    password: "agus123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Makassar"
  },
  {
    id: 3,
    nama: "Siti Marlina",
    email: "siti@ut.ac.id",
    password: "siti123",
    role: "Puslaba",
    lokasi: "Pusat"
  },
  {
    id: 4,
    nama: "Doni Setiawan",
    email: "doni@ut.ac.id",
    password: "doni123",
    role: "Fakultas",
    lokasi: "FISIP"
  },
  {
    id: 5,
    nama: "Admin SITTA",
    email: "admin@ut.ac.id",
    password: "admin123",
    role: "Administrator",
    lokasi: "Pusat"
  }
];

var dataBahanAjar = [
  {
    kodeLokasi: "0TMP01",
    kodeBarang: "ASIP4301",
    namaBarang: "Pengantar Ilmu Komunikasi",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 548,
    cover: "img/pengantar_komunikasi.jpg"
  },
  {
    kodeLokasi: "0JKT01",
    kodeBarang: "EKMA4216",
    namaBarang: "Manajemen Keuangan",
    jenisBarang: "BMP",
    edisi: "3",
    stok: 12,
    cover: "img/manajemen_keuangan.jpg"
  },
  {
    kodeLokasi: "0SBY02",
    kodeBarang: "EKMA4310",
    namaBarang: "Kepemimpinan",
    jenisBarang: "BMP",
    edisi: "1",
    stok: 278,
    cover: "img/kepemimpinan.jpg"
  },
  {
    kodeLokasi: "0MLG01",
    kodeBarang: "BIOL4211",
    namaBarang: "Mikrobiologi Dasar",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 165,
    cover: "img/mikrobiologi.jpg"
  },
  {
    kodeLokasi: "0UPBJJBDG",
    kodeBarang: "PAUD4401",
    namaBarang: "Perkembangan Anak Usia Dini",
    jenisBarang: "BMP",
    edisi: "4",
    stok: 204,
    cover: ""
  }
];

var dataTracking = {
  "DO2025-001": {
    nomorDO: "DO2025-001",
    nim: "041234567",
    nama: "Rina Wulandari",
    upbjj: "Jakarta",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE Express",
    tanggalKirim: "2025-08-25",
    paketKode: "PKT-MAN-01",
    total: 125000,
    perjalanan:[
      {
        waktu: "2025-08-25 10:12:20",
        keterangan: "Penerimaan di Loket: UT-Pusat (Pondok Cabe). Pengirim: Puslaba UT"
      },
      {
        waktu: "2025-08-25 14:07:56",
        keterangan: "Tiba di Hub Transit: JNE JAKARTA"
      },      
      {
        waktu: "2025-08-25 18:30:12",
        keterangan: "Diteruskan ke alamat penerima di Jakarta Selatan"
      }
    ]
  },
  "DO2025-002": {
    nomorDO: "DO2025-002",
    nim: "045678901",
    nama: "Agus Pranoto",
    upbjj: "Surabaya",
    status: "Selesai",
    ekspedisi: "JNE Regular",
    tanggalKirim: "2025-08-24",
    paketKode: "PKT-SCI-02",
    total: 155000,
    perjalanan:[
      {
        waktu: "2025-08-24 09:00:00",
        keterangan: "Penerimaan di Loket: UT-Pusat (Pondok Cabe). Pengirim: Puslaba UT"
      },
      {
        waktu: "2025-08-24 13:45:00",
        keterangan: "Tiba di Hub Transit: JNE JAKARTA"
      },      
      {
        waktu: "2025-08-25 08:30:00",
        keterangan: "Diteruskan ke Hub Transit: JNE SURABAYA"
      },
      {
        waktu: "2025-08-25 12:15:00",
        keterangan: "Paket dibawa kurir untuk pengiriman"
      },
      {
        waktu: "2025-08-25 16:30:00",
        keterangan: "Paket DITERIMA oleh ybs (Agus Pranoto)"
      }
    ]
  }
};