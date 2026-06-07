Vue.component('do-tracking', {
  props: {
    trackingData: { type: Object, required: true },
    paketList: { type: Array, required: true },
    upbjjList: { type: Array, required: true }
  },
  data() {
    return {
      searchQuery: '',
      foundDO: null,
      hasSearched: false,
      
      showFormDO: false,
      formDO: { nim: '', nama: '', upbjj: '', ekspedisi: '', tanggalKirim: '', paketKode: '' },
      formProgress: { keterangan: '' },
      errors: {},
      
      lastActionLog: '',
      searchDebounceLog: '',
      searchTimeout: null
    };
  },
  computed: {
    nextNumberDO() {
      const existingIds = Object.keys(this.trackingData);
      const counter = existingIds.length + 1;
      return `DO2025-${counter.toString().padStart(3, '0')}`;
    },
    selectedPaketDetail() {
      if (!this.formDO.paketKode) return null;
      return this.paketList.find(p => p.kode === this.formDO.paketKode);
    },
    computedTotalHarga() {
      return this.selectedPaketDetail ? this.selectedPaketDetail.harga : 0;
    },
    availableEkspedisi() {
      if (!this.formDO.upbjj) return [];
      const daerah = this.formDO.upbjj.toLowerCase();
      if (daerah === 'jakarta' || daerah === 'surabaya') {
        return ['JNE Express', 'JNE Regular', 'Sicepat BEST', 'Pos Indonesia Express'];
      }
      return ['JNE Regular', 'Pos Indonesia Kilat Khusus', 'Cargo Darat UT'];
    }
  },
  watch: {
    'formDO.upbjj': function(newVal, oldVal) {
      if (oldVal !== '' && newVal !== oldVal) {
        this.formDO.ekspedisi = '';
      }
    },
    'formDO.paketKode': function(newVal) {
      if (newVal) {
        this.lastActionLog = `Paket ${newVal} dipilih (Rp ${this.computedTotalHarga.toLocaleString('id-ID')})`;
        setTimeout(() => { this.lastActionLog = ''; }, 4000);
      }
    },
    searchQuery(newVal) {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        if (newVal.length > 2) {
          this.searchDebounceLog = `Mencari data untuk: "${newVal}"...`;
        } else {
          this.searchDebounceLog = '';
        }
      }, 400);
    }
  },
  methods: {
    lacakDO() {
      if (!this.searchQuery.trim()) {
        Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Masukkan Nomor DO atau NIM terlebih dahulu!' });
        return;
      }
      this.hasSearched = true;
      this.searchDebounceLog = '';
      
      const q = this.searchQuery.trim().toUpperCase();
      let res = this.trackingData[q];
      
      // Jika tidak ketemu pakai nomor DO, cari pakai NIM
      if (!res) {
          const found = Object.values(this.trackingData).find(d => d.nim === q);
          if (found) res = found;
      }

      if (res) {
        this.foundDO = res;
        this.lastActionLog = `DO ditemukan dengan status: ${res.status}`;
      } else {
        this.foundDO = null;
        this.lastActionLog = 'Data DO tidak ditemukan.';
      }
    },
    resetPencarian() {
        this.searchQuery = '';
        this.foundDO = null;
        this.hasSearched = false;
        this.lastActionLog = 'Pencarian direset.';
        setTimeout(() => { this.lastActionLog = ''; }, 3000);
    },
    tambahProgress() {
        if (!this.formProgress.keterangan.trim()) return;
        
        const tgl = new Date().toLocaleString('id-ID', {
            year:'numeric', month:'2-digit', day:'2-digit',
            hour:'2-digit', minute:'2-digit', second:'2-digit'
        }).replace(/\./g, ':');
        
        const newLog = {
            waktu: tgl,
            keterangan: this.formProgress.keterangan.trim()
        };
        
        this.$emit('update-progress', {
            id: this.foundDO.nomorDO,
            log: newLog
        });
        
        this.formProgress.keterangan = '';
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Status progress berhasil ditambahkan', timer: 1500, showConfirmButton: false });
    },
    getEkspedisiLabel(item) {
      return item.ekspedisi ? `${item.ekspedisi} - Tujuan: ${item.upbjj}` : `Tujuan: ${item.upbjj}`;
    },
    setDefaultDate() {
      const today = new Date();
      this.formDO.tanggalKirim = today.toISOString().split('T')[0];
    },
    validateFormDO() {
      let e = {};
      let f = this.formDO;
      
      // Validasi NIM: Wajib diisi, harus angka, dan berjumlah 9 digit
      const nimVal = f.nim ? String(f.nim).trim() : '';
      if (!nimVal) {
        e.nim = 'NIM wajib diisi';
      } else if (!/^[0-9]+$/.test(nimVal)) {
        e.nim = 'NIM hanya boleh berisi angka';
      } else if (nimVal.length !== 9) {
        e.nim = 'NIM harus terdiri dari 9 digit angka';
      }

      // Validasi Nama: Wajib diisi, hanya huruf (dan karakter nama umum), min 3 karakter
      const namaVal = f.nama ? String(f.nama).trim() : '';
      if (!namaVal) {
        e.nama = 'Nama wajib diisi';
      } else if (!/^[a-zA-Z\s.',]+$/.test(namaVal)) {
        e.nama = 'Nama hanya boleh berisi huruf';
      } else if (namaVal.length < 3) {
        e.nama = 'Nama minimal 3 karakter';
      }

      if (!f.upbjj) e.upbjj = 'Pilih UT-Daerah';
      if (!f.ekspedisi) e.ekspedisi = 'Pilih Ekspedisi';
      if (!f.tanggalKirim) e.tanggalKirim = 'Tanggal wajib diisi';
      if (!f.paketKode) e.paketKode = 'Pilih Paket';
      
      this.errors = e;
      return Object.keys(e).length === 0;
    },
    simpanDOBaru() {
      if (!this.validateFormDO()) return;
      
      const numDO = this.nextNumberDO;
      const tgl = new Date().toLocaleString('id-ID', {
        year:'numeric', month:'2-digit', day:'2-digit',
        hour:'2-digit', minute:'2-digit', second:'2-digit'
      }).replace(/\./g, ':');

      const payload = {
        nomorDO: numDO,
        nim: this.formDO.nim.trim(),
        nama: this.formDO.nama.trim(),
        upbjj: this.formDO.upbjj,
        status: 'Proses Gudang',
        ekspedisi: this.formDO.ekspedisi,
        tanggalKirim: this.formDO.tanggalKirim,
        paketKode: this.formDO.paketKode,
        total: this.computedTotalHarga,
        perjalanan: [
          { waktu: tgl, keterangan: `DO ${numDO} berhasil dibuat. Menunggu proses packing di gudang pusat.` }
        ]
      };

      this.$emit('tambah-tracking', { id: numDO, data: payload });
      
      this.showFormDO = false;
      this.formDO = { nim: '', nama: '', upbjj: '', ekspedisi: '', tanggalKirim: '', paketKode: '' };
      
      Swal.fire({
        icon: 'success',
        title: 'DO Berhasil Dibuat!',
        text: `Nomor DO Anda: ${numDO}`,
        confirmButtonText: 'Lacak Sekarang'
      }).then(() => {
        this.searchQuery = numDO;
        this.lacakDO();
      });
    }
  },
  mounted() {
    this.setDefaultDate();
  },
  template: '#tmpl-do-tracking'
});
