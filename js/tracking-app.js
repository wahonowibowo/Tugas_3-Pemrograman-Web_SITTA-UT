/**
 * ===================================================
 * TRACKING DELIVERY ORDER - Vue.js Application
 * Tugas Praktik 2 - Pemrograman Berbasis Web
 * SITTA-UT (Sistem Informasi Tiras & Transaksi BA)
 * ===================================================
 * Kriteria: Data Binding, Directives, Conditional,
 * Computed, Watchers, Form & Validasi
 * ===================================================
 */

var trackingApp = new Vue({
  el: '#trackingApp',

  // =====================
  // DATA
  // =====================
  data: {
    // Memuat data dari data.js & dataBahanAjar.js
    upbjjList: upbjjList,
    paketList: dataPaket,
    // Gunakan salinan reaktif dari dataTracking eksisting
    trackingList: JSON.parse(JSON.stringify(dataTracking)),

    // Pelacakan (v-model)
    searchQuery: '',
    foundDO: null,
    hasSearched: false,

    // Modal state
    showFormDO: false,

    // Form input DO baru (v-model)
    formDO: {
      nim: '',
      nama: '',
      upbjj: '',
      ekspedisi: '',
      paketKode: '',
      tanggalKirim: ''
    },

    // Peringatan error validasi
    errors: {},

    // Watcher log status
    lastActionLog: '',
    searchDebounceLog: ''
  },

  // =====================
  // MOUNTED / INITIALIZATION
  // =====================
  mounted: function() {
    // Set default tanggal kirim ke hari ini menggunakan fungsi Date lokal
    this.setDefaultDate();
  },

  // =====================
  // COMPUTED PROPERTIES
  // (cached, recompute hanya jika dependency berubah)
  // =====================
  computed: {
    /**
     * Computed: nextNumberDO
     * Menghasilkan Nomor DO otomatis reaktif berdasarkan tahun berjalan & data sequence terakhir.
     * format: DO[Tahun]-[Sequence] (cth: DO2025-003)
     */
    nextNumberDO: function() {
      var year = new Date().getFullYear();
      var prefix = "DO" + year + "-";
      var maxSeq = 0;

      // Scan seluruh nomor DO di list tracking
      for (var key in this.trackingList) {
        if (key.indexOf(prefix) === 0) {
          var seqStr = key.substring(prefix.length);
          var seqNum = parseInt(seqStr, 10);
          if (!isNaN(seqNum) && seqNum > maxSeq) {
            maxSeq = seqNum;
          }
        }
      }

      // Sequence berikutnya
      var nextSeq = maxSeq + 1;
      // Padding 3 digit (cth: 001, 002)
      var seqStrFormatted = ("000" + nextSeq).slice(-3);
      return prefix + seqStrFormatted;
    },

    /**
     * Computed: selectedPaketDetail
     * Mengambil detail isi paket terpilih untuk di-render di bawah dropdown paket
     */
    selectedPaketDetail: function() {
      var self = this;
      if (!this.formDO.paketKode) return null;
      return this.paketList.find(function(pkt) {
        return pkt.kode === self.formDO.paketKode;
      });
    },

    /**
     * Computed: computedTotalHarga
     * Mengambil harga otomatis dari data array paket -> harga
     */
    computedTotalHarga: function() {
      if (this.selectedPaketDetail) {
        return this.selectedPaketDetail.harga;
      }
      return 0;
    },

    /**
     * Computed: availableEkspedisi (Dependent Options)
     * Ekspedisi JNE Regular / JNE Express disaring berdasarkan UPBJJ terpilih.
     * Cth: UPBJJ Jakarta, Surabaya, Makassar mendukung paket kilat (Express & Regular),
     * sedangkan Padang & Denpasar hanya mendukung JNE Regular.
     */
    availableEkspedisi: function() {
      if (!this.formDO.upbjj) return [];
      
      var kotaKilat = ["Jakarta", "Surabaya", "Makassar"];
      if (kotaKilat.indexOf(this.formDO.upbjj) !== -1) {
        return ["JNE Regular", "JNE Express"];
      } else {
        return ["JNE Regular"];
      }
    }
  },

  // =====================
  // WATCHERS
  // =====================
  watch: {
    /**
     * Watcher 1: formDO.upbjj
     * Mereset pilihan ekspedisi ketika pilihan wilayah UPBJJ berubah
     */
    'formDO.upbjj': function(newVal, oldVal) {
      this.formDO.ekspedisi = '';
      if (newVal) {
        this.lastActionLog = 'UPBJJ Tujuan dipilih: ' + newVal + 
          '. Opsi ekspedisi yang tersedia diperbarui.';
      }
    },

    /**
     * Watcher 2: formDO.paketKode
     * Mencatat perubahan pemilihan paket bahan ajar
     */
    'formDO.paketKode': function(newVal) {
      if (newVal) {
        var pkt = this.selectedPaketDetail;
        this.lastActionLog = 'Paket dipilih: ' + pkt.nama + 
          ' dengan total biaya ' + this.formatRupiah(pkt.harga);
      }
    },

    /**
     * Watcher 3: searchQuery
     * Memantau ketikan pencarian nomor DO
     */
    searchQuery: function(newVal) {
      if (newVal) {
        this.searchDebounceLog = 'Mengetik pencarian untuk: "' + newVal.trim().toUpperCase() + '"...';
      } else {
        this.searchDebounceLog = '';
      }
    }
  },

  // =====================
  // METHODS
  // =====================
  methods: {
    /** Method: Lacak Nomor DO */
    lacakDO: function() {
      var q = this.searchQuery.trim().toUpperCase();
      this.hasSearched = true;

      if (!q) {
        this.foundDO = null;
        if (typeof Swal !== 'undefined') {
          Swal.fire({ title: 'Masukkan Nomor DO', text: 'Nomor DO tidak boleh kosong.', icon: 'warning', confirmButtonColor: '#f97316' });
        }
        return;
      }

      var data = this.trackingList[q];
      if (data) {
        this.foundDO = data;
      } else {
        this.foundDO = null;
        if (typeof Swal !== 'undefined') {
          Swal.fire({ title: 'Tidak Ditemukan', text: 'Nomor DO ' + q + ' tidak terdaftar dalam sistem.', icon: 'error', confirmButtonColor: '#1e3a8a' });
        }
      }
    },

    /** Method: Set Tanggal Default ke Hari ini (Date Function) */
    setDefaultDate: function() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
      var yyyy = today.getFullYear();
      this.formDO.tanggalKirim = yyyy + '-' + mm + '-' + dd;
    },

    /** Method: Format Rupiah */
    formatRupiah: function(nominal) {
      return 'Rp ' + Number(nominal).toLocaleString('id-ID');
    },

    /** Method: Format Nama Ekspedisi dengan Icon */
    getEkspedisiLabel: function(doItem) {
      return doItem.ekspedisi + ' (' + doItem.upbjj + ')';
    },

    /** Method: Tentukan Kelas Warna Status Pengiriman */
    getStatusClass: function(status) {
      var s = status.toLowerCase();
      if (s.indexOf('selesai') !== -1) return 'status-selesai';
      if (s.indexOf('perjalanan') !== -1) return 'status-perjalanan';
      return 'status-proses';
    },

    // --- VALIDASI FORMULIR ---
    validateFormDO: function() {
      var e = {};
      var f = this.formDO;

      if (!f.nim || !f.nim.trim()) {
        e.nim = 'NIM mahasiswa wajib diisi';
      } else if (!/^\d{9}$/.test(f.nim.trim())) {
        e.nim = 'NIM harus berupa 9 digit angka';
      }

      if (!f.nama || f.nama.trim().length < 3) {
        e.nama = 'Nama mahasiswa minimal 3 karakter';
      }

      if (!f.upbjj) {
        e.upbjj = 'Pilih wilayah UT-Daerah tujuan';
      }

      if (!f.ekspedisi) {
        e.ekspedisi = 'Pilih metode ekspedisi pengiriman';
      }

      if (!f.paketKode) {
        e.paketKode = 'Pilih paket bahan ajar';
      }

      if (!f.tanggalKirim) {
        e.tanggalKirim = 'Tanggal kirim harus ditentukan';
      }

      this.errors = e;
      return Object.keys(e).length === 0;
    },

    // --- TAMBAH DO BARU ---
    simpanDOBaru: function() {
      if (!this.validateFormDO()) return;

      var f = this.formDO;
      var generatedDO = this.nextNumberDO;
      var todayStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // Bentuk entitas tracking baru
      var newDO = {
        nomorDO: generatedDO,
        nim: f.nim.trim(),
        nama: f.nama.trim(),
        upbjj: f.upbjj,
        status: "Proses Pengemasan",
        ekspedisi: f.ekspedisi,
        tanggalKirim: f.tanggalKirim,
        paketKode: f.paketKode,
        total: this.computedTotalHarga,
        perjalanan: [
          {
            waktu: todayStr,
            keterangan: "DO Baru Berhasil Terdaftar. Lokasi: UT-Pusat (Pondok Cabe). Status: Proses Pengemasan."
          }
        ]
      };

      // Simpan secara reaktif ke trackingList
      this.$set(this.trackingList, generatedDO, newDO);

      // Reset form input
      this.formDO = {
        nim: '',
        nama: '',
        upbjj: '',
        ekspedisi: '',
        paketKode: '',
        tanggalKirim: ''
      };
      this.setDefaultDate();
      this.errors = {};
      this.showFormDO = false;

      // Notifikasi sukses
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'DO Berhasil Dibuat!',
          html: 'Nomor DO Anda: <strong class="text-orange-600 font-mono text-lg">' + generatedDO + '</strong>',
          icon: 'success',
          confirmButtonColor: '#f97316',
          confirmButtonText: 'Lacak Sekarang'
        }).then(function() {
          // Arahkan form pencarian ke DO yang baru dibuat
          trackingApp.searchQuery = generatedDO;
          trackingApp.lacakDO();
        });
      }
    }
  }
});
