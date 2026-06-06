Vue.component('stok-table', {
  props: {
    stokData: { type: Array, required: true },
    upbjjList: { type: Array, required: true },
    kategoriList: { type: Array, required: true }
  },
  data() {
    return {
      searchQuery: '',
      filterUpbjj: '',
      filterKategori: '',
      filterStokRendah: false,
      filterStokKosong: false,
      sortBy: '',
      sortOrder: 'asc', // asc or desc
      
      showFormTambah: false,
      showFormEdit: false,
      selectedItem: null,
      
      searchLog: '',
      lastFilterChange: '',
      searchTimeout: null
    };
  },
  computed: {
    availableKategori() {
      if (!this.filterUpbjj) return this.kategoriList;
      const categoriesInUpbjj = new Set(
        this.stokData
          .filter(item => item.upbjj === this.filterUpbjj)
          .map(item => item.kategori)
      );
      return Array.from(categoriesInUpbjj);
    },
    filteredAndSortedStok() {
      let result = this.stokData.filter(item => {
        // Search
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          const matchKode = item.kode.toLowerCase().includes(query);
          const matchJudul = item.judul.toLowerCase().includes(query);
          if (!matchKode && !matchJudul) return false;
        }
        
        // Upbjj & Kategori
        if (this.filterUpbjj && item.upbjj !== this.filterUpbjj) return false;
        if (this.filterKategori && item.kategori !== this.filterKategori) return false;
        
        // Stok Rendah & Kosong
        if (this.filterStokRendah && item.qty >= item.safety) return false;
        if (this.filterStokKosong && item.qty > 0) return false;
        
        return true;
      });

      // Sort
      if (this.sortBy) {
        result.sort((a, b) => {
          let valA = a[this.sortBy];
          let valB = b[this.sortBy];
          
          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();
          
          if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
          if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return result;
    },
    totalItems() { return this.filteredAndSortedStok.length; },
    totalAman() { return this.filteredAndSortedStok.filter(i => i.qty >= i.safety).length; },
    totalMenipis() { return this.filteredAndSortedStok.filter(i => i.qty > 0 && i.qty < i.safety).length; },
    totalKosong() { return this.filteredAndSortedStok.filter(i => i.qty === 0).length; },
    jumlahDitampilkan() { return this.filteredAndSortedStok.length; }
  },
  watch: {
    filterUpbjj(newVal) {
      this.filterKategori = '';
      if (newVal) {
        this.lastFilterChange = `Filter diubah ke Daerah: ${newVal}`;
      } else {
        this.lastFilterChange = `Filter Daerah dihapus (Semua Wilayah)`;
      }
    },
    searchQuery(newVal) {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        if (newVal) {
          const count = this.filteredAndSortedStok.length;
          this.searchLog = `Ditemukan ${count} item untuk pencarian "${newVal}"`;
        } else {
          this.searchLog = '';
        }
      }, 500);
    }
  },
  methods: {
    getStatus(item) {
      if (item.qty === 0) return 'Kosong';
      if (item.qty < item.safety) return 'Menipis';
      return 'Aman';
    },
    toggleSort(column) {
      if (this.sortBy === column) {
        if (this.sortOrder === 'asc') this.sortOrder = 'desc';
        else { this.sortBy = ''; this.sortOrder = 'asc'; }
      } else {
        this.sortBy = column;
        this.sortOrder = 'asc';
      }
    },
    resetFilter() {
      this.searchQuery = '';
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.filterStokRendah = false;
      this.filterStokKosong = false;
      this.sortBy = '';
      this.lastFilterChange = 'Filter berhasil di-reset.';
      setTimeout(() => this.lastFilterChange = '', 3000);
    },
    tambahBahanAjar(data) {
      const exists = this.stokData.find(s => s.kode.toLowerCase() === data.kode.toLowerCase());
      if (exists) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Kode Bahan Ajar sudah ada!' });
        return;
      }
      this.$emit('tambah-stok', data);
      this.showFormTambah = false;
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Stok baru berhasil ditambahkan.' });
    },
    bukaFormEdit(item) {
      this.selectedItem = item;
      this.showFormEdit = true;
    },
    simpanEdit(data) {
      this.$emit('edit-stok', data);
      this.showFormEdit = false;
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data bahan ajar berhasil diperbarui.' });
    },
    hapusBahanAjar(item) {
      Swal.fire({
          title: 'Hapus Data?',
          text: `Anda yakin ingin menghapus stok ${item.kode} - ${item.judul}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#dc2626',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Ya, Hapus!',
          cancelButtonText: 'Batal'
      }).then((result) => {
          if (result.isConfirmed) {
              this.$emit('hapus-stok', item.kode);
              Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Data bahan ajar berhasil dihapus.', timer: 1500, showConfirmButton: false });
          }
      });
    }
  },
  template: '#tmpl-stok-table'
});
