Vue.component('order-form', {
  props: {
    mode: { type: String, default: 'tambah' }, // tambah atau edit
    item: { type: Object, default: () => ({}) },
    upbjjList: { type: Array, required: true },
    kategoriList: { type: Array, required: true }
  },
  data() {
    return {
      formData: {
        kode: '', judul: '', kategori: '', upbjj: '',
        lokasiRak: '', harga: '', qty: '', safety: '', catatanHTML: ''
      },
      errors: {}
    };
  },
  computed: {
    modalTitle() {
      return this.mode === 'tambah' ? 'Tambah Stok Bahan Ajar Baru' : `Edit Data Bahan Ajar: ${this.formData.kode}`;
    }
  },
  mounted() {
    if (this.mode === 'edit' && this.item) {
      this.formData = JSON.parse(JSON.stringify(this.item));
    }
  },
  methods: {
    validate() {
      let e = {};
      let f = this.formData;
      if (this.mode === 'tambah') {
        if (!f.kode || !f.kode.trim()) e.kode = 'Kode wajib diisi';
        else if (!/^[A-Z]{2,6}\d{3,5}$/.test(f.kode.trim())) e.kode = 'Format: huruf kapital + angka (cth: EKMA4116)';
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
    submit() {
      if (!this.validate()) return;
      // Copy to prevent mutating passed prop if using object reference
      const payload = {
        ...this.formData,
        kode: this.formData.kode.trim().toUpperCase(),
        judul: this.formData.judul.trim(),
        lokasiRak: this.formData.lokasiRak.trim(),
        harga: Number(this.formData.harga),
        qty: Number(this.formData.qty),
        safety: Number(this.formData.safety)
      };
      if(!payload.catatanHTML) payload.catatanHTML = '-';
      
      this.$emit('save', payload);
    }
  },
  template: '#tmpl-order-form'
});
