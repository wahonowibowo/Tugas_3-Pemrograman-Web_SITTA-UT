/**
 * ===================================================
 * STOK BAHAN AJAR - Vue.js Application
 * Tugas Praktik 2 - Pemrograman Berbasis Web
 * SITTA-UT (Sistem Informasi Tiras & Transaksi BA)
 * ===================================================
 * Kriteria: Data Binding, Directives, Conditional,
 * Computed, Watchers, Form & Validasi
 * ===================================================
 */

var stokApp = new Vue({
  el: '#stokApp',

  // =====================
  // DATA
  // =====================
  data: {
    // Master data dari dataBahanAjar.js
    upbjjList: upbjjList,
    kategoriList: kategoriList,
    stok: JSON.parse(JSON.stringify(dataStokBahanAjar)),

    // Filter & Sort (v-model)
    searchQuery: '',
    filterUpbjj: '',
    filterKategori: '',
    filterStokRendah: false,
    filterStokKosong: false,
    sortBy: '',
    sortOrder: 'asc',

    // Modal state
    showFormTambah: false,
    showFormEdit: false,

    // Form tambah bahan ajar baru (v-model)
    formTambah: {
      kode: '', judul: '', kategori: '', upbjj: '',
      lokasiRak: '', harga: '', qty: '', safety: '', catatanHTML: ''
    },

    // Form edit (v-model)
    formEdit: {
      index: -1, kode: '', judul: '', kategori: '', upbjj: '',
      lokasiRak: '', harga: '', qty: '', safety: '', catatanHTML: ''
    },

    // Validasi errors
    errors: {},
    editErrors: {},

    // Watcher log
    searchLog: '',
    lastFilterChange: ''
  },

  // =====================
  // COMPUTED PROPERTIES
  // (cached, tidak recompute kecuali dependency berubah)
  // =====================
  computed: {
    /**
     * Computed: Dependent options
     * List kategori yang tersedia berdasarkan UPBJJ yang dipilih
     */
    availableKategori: function() {
      if (!this.filterUpbjj) return [];
      var upbjj = this.filterUpbjj;
      var kategoris = {};
      this.stok.forEach(function(item) {
        if (item.upbjj === upbjj) {
          kategoris[item.kategori] = true;
        }
      });
      return Object.keys(kategoris).sort();
    },

    /**
     * Computed: filteredAndSortedStok
     * Filter + sort data stok (cached by Vue.js)
     */
    filteredAndSortedStok: function() {
      var self = this;
      var result = this.stok.slice();

      // Filter by search query
      if (this.searchQuery) {
        var q = this.searchQuery.toLowerCase();
        result = result.filter(function(item) {
          return item.kode.toLowerCase().indexOf(q) !== -1 ||
                 item.judul.toLowerCase().indexOf(q) !== -1;
        });
      }

      // Filter by UPBJJ
      if (this.filterUpbjj) {
        result = result.filter(function(item) {
          return item.upbjj === self.filterUpbjj;
        });
      }

      // Filter by Kategori
      if (this.filterKategori) {
        result = result.filter(function(item) {
          return item.kategori === self.filterKategori;
        });
      }

      // Filter stok rendah (qty < safety)
      if (this.filterStokRendah) {
        result = result.filter(function(item) {
          return item.qty < item.safety;
        });
      }

      // Filter stok kosong (qty === 0)
      if (this.filterStokKosong) {
        result = result.filter(function(item) {
          return item.qty === 0;
        });
      }

      // Sort
      if (this.sortBy) {
        var sortBy = this.sortBy;
        var order = this.sortOrder === 'asc' ? 1 : -1;
        result.sort(function(a, b) {
          var valA = a[sortBy];
          var valB = b[sortBy];
          if (typeof valA === 'string') {
            return valA.localeCompare(valB) * order;
          }
          return (valA - valB) * order;
        });
      }

      return result;
    },

    /** Computed: Total semua stok */
    totalItems: function() {
      return this.stok.length;
    },

    /** Computed: Total stok aman */
    totalAman: function() {
      return this.stok.filter(function(i) { return i.qty >= i.safety && i.qty > 0; }).length;
    },

    /** Computed: Total stok menipis */
    totalMenipis: function() {
      return this.stok.filter(function(i) { return i.qty > 0 && i.qty < i.safety; }).length;
    },

    /** Computed: Total stok kosong */
    totalKosong: function() {
      return this.stok.filter(function(i) { return i.qty === 0; }).length;
    },

    /** Computed: Jumlah data yang ditampilkan */
    jumlahDitampilkan: function() {
      return this.filteredAndSortedStok.length;
    }
  },

  // =====================
  // WATCHERS (min 2)
  // =====================
  watch: {
    /**
     * Watcher 1: filterUpbjj
     * Reset filterKategori saat UT-Daerah berubah (dependent options)
     */
    filterUpbjj: function(newVal, oldVal) {
      this.filterKategori = '';
      this.lastFilterChange = 'Filter UT-Daerah diubah: ' +
        (oldVal || 'Semua') + ' → ' + (newVal || 'Semua') +
        ' pada ' + new Date().toLocaleTimeString('id-ID');
      console.log('[Watcher filterUpbjj]', this.lastFilterChange);
    },

    /**
     * Watcher 2: searchQuery
     * Log perubahan pencarian
     */
    searchQuery: function(newVal) {
      if (newVal) {
        this.searchLog = 'Mencari: "' + newVal + '" — ' +
          this.filteredAndSortedStok.length + ' hasil ditemukan';
      } else {
        this.searchLog = '';
      }
      console.log('[Watcher searchQuery]', this.searchLog);
    },

    /**
     * Watcher 3 (bonus): deep watch stok array
     * Deteksi perubahan data stok
     */
    stok: {
      handler: function(newVal) {
        var kosong = newVal.filter(function(i) { return i.qty === 0; });
        if (kosong.length > 0) {
          console.log('[Watcher stok] PERINGATAN: ' + kosong.length + ' item stok KOSONG!');
        }
      },
      deep: true
    }
  },

  // =====================
  // METHODS
  // =====================
  methods: {
    /**
     * Method: Mendapatkan status stok
     * Digunakan oleh v-if / v-else-if / v-else di template
     */
    getStatus: function(item) {
      if (item.qty === 0) return 'Kosong';
      if (item.qty < item.safety) return 'Menipis';
      return 'Aman';
    },

    /** Method: Format harga ke Rupiah */
    formatHarga: function(harga) {
      return 'Rp ' + Number(harga).toLocaleString('id-ID');
    },

    /** Method: Toggle sort */
    toggleSort: function(field) {
      if (this.sortBy === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortOrder = 'asc';
      }
    },

    /** Method: Reset semua filter */
    resetFilter: function() {
      this.searchQuery = '';
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.filterStokRendah = false;
      this.filterStokKosong = false;
      this.sortBy = '';
      this.sortOrder = 'asc';
      this.searchLog = '';
      this.lastFilterChange = 'Filter di-reset pada ' + new Date().toLocaleTimeString('id-ID');
    },

    // --- VALIDASI FORM ---
    validateFormTambah: function() {
      var e = {};
      var f = this.formTambah;
      if (!f.kode || !f.kode.trim()) e.kode = 'Kode wajib diisi';
      else if (!/^[A-Z]{2,6}\d{3,5}$/.test(f.kode.trim())) e.kode = 'Format: huruf kapital + angka (cth: EKMA4116)';
      else {
        var exists = this.stok.some(function(s) { return s.kode === f.kode.trim(); });
        if (exists) e.kode = 'Kode sudah ada dalam database';
      }
      if (!f.judul || f.judul.trim().length < 3) e.judul = 'Judul min 3 karakter';
      if (!f.kategori) e.kategori = 'Pilih kategori';
      if (!f.upbjj) e.upbjj = 'Pilih UT-Daerah';
      if (!f.lokasiRak || !f.lokasiRak.trim()) e.lokasiRak = 'Lokasi rak wajib diisi';
      if (!f.harga || isNaN(f.harga) || Number(f.harga) <= 0) e.harga = 'Harga harus angka positif';
      if (f.qty === '' || isNaN(f.qty) || Number(f.qty) < 0) e.qty = 'Qty harus angka >= 0';
      if (f.safety === '' || isNaN(f.safety) || Number(f.safety) < 0) e.safety = 'Safety harus angka >= 0';
      this.errors = e;
      return Object.keys(e).length === 0;
    },

    validateFormEdit: function() {
      var e = {};
      var f = this.formEdit;
      if (!f.judul || f.judul.trim().length < 3) e.judul = 'Judul min 3 karakter';
      if (!f.kategori) e.kategori = 'Pilih kategori';
      if (!f.upbjj) e.upbjj = 'Pilih UT-Daerah';
      if (!f.lokasiRak || !f.lokasiRak.trim()) e.lokasiRak = 'Lokasi rak wajib diisi';
      if (!f.harga || isNaN(f.harga) || Number(f.harga) <= 0) e.harga = 'Harga harus angka positif';
      if (f.qty === '' || isNaN(f.qty) || Number(f.qty) < 0) e.qty = 'Qty harus angka >= 0';
      if (f.safety === '' || isNaN(f.safety) || Number(f.safety) < 0) e.safety = 'Safety harus angka >= 0';
      this.editErrors = e;
      return Object.keys(e).length === 0;
    },

    // --- TAMBAH BAHAN AJAR ---
    tambahBahanAjar: function() {
      if (!this.validateFormTambah()) return;
      var f = this.formTambah;
      this.stok.push({
        kode: f.kode.trim().toUpperCase(),
        judul: f.judul.trim(),
        kategori: f.kategori,
        upbjj: f.upbjj,
        lokasiRak: f.lokasiRak.trim(),
        harga: Number(f.harga),
        qty: Number(f.qty),
        safety: Number(f.safety),
        catatanHTML: f.catatanHTML || '-'
      });
      // Reset form
      this.formTambah = { kode:'', judul:'', kategori:'', upbjj:'', lokasiRak:'', harga:'', qty:'', safety:'', catatanHTML:'' };
      this.errors = {};
      this.showFormTambah = false;
      // SweetAlert notification
      if (typeof Swal !== 'undefined') {
        Swal.fire({ title:'Berhasil!', text:'Bahan ajar baru berhasil ditambahkan.', icon:'success', timer:2000, showConfirmButton:false });
      }
    },

    // --- EDIT STOK ---
    bukaFormEdit: function(index) {
      var item = this.stok[index];
      this.formEdit = {
        index: index,
        kode: item.kode,
        judul: item.judul,
        kategori: item.kategori,
        upbjj: item.upbjj,
        lokasiRak: item.lokasiRak,
        harga: item.harga,
        qty: item.qty,
        safety: item.safety,
        catatanHTML: item.catatanHTML
      };
      this.editErrors = {};
      this.showFormEdit = true;
    },

    simpanEdit: function() {
      if (!this.validateFormEdit()) return;
      var f = this.formEdit;
      var item = this.stok[f.index];
      item.judul = f.judul.trim();
      item.kategori = f.kategori;
      item.upbjj = f.upbjj;
      item.lokasiRak = f.lokasiRak.trim();
      item.harga = Number(f.harga);
      item.qty = Number(f.qty);
      item.safety = Number(f.safety);
      item.catatanHTML = f.catatanHTML;
      // Force reactivity
      this.$set(this.stok, f.index, item);
      this.showFormEdit = false;
      if (typeof Swal !== 'undefined') {
        Swal.fire({ title:'Tersimpan!', text:'Data stok berhasil diperbarui.', icon:'success', timer:2000, showConfirmButton:false });
      }
    },

    /** Method: Cari index asli dari item di stok */
    getOriginalIndex: function(item) {
      return this.stok.indexOf(item);
    }
  }
});
