// Filter Global: Mata Uang Rupiah (Indikator 7)
Vue.filter('rupiah', function (value) {
    if (value === null || value === undefined) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(value);
});

// Filter Global: Tanggal Indo (Indikator 7)
Vue.filter('tanggalIndo', function (value) {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
});

// Filter Global: Uppercase
Vue.filter('uppercase', function (value) {
    if (!value) return '';
    return value.toString().toUpperCase();
});

// Root Vue Instance
new Vue({
    el: '#app',
    data: {
        currentPage: 'login', // login, dashboard, stok, tracking
        isLoggedIn: false,
        user: null,
        
        // State Global Aplikasi
        appData: {
            pengguna: [],
            stokBahanAjar: [],
            paket: [],
            tracking: {},
            upbjjList: [],
            kategoriList: []
        },
        isLoadingData: true,
        templatesLoaded: false
    },
    computed: {
        userName() {
            return this.user ? this.user.nama : 'Guest';
        }
    },
    async mounted() {
        // Memuat Template HTML Secara Dinamis (Pendekatan Async)
        await this.loadAllTemplates();
        
        // Memuat Data JSON melalui API Service
        const data = await window.SittaAPI.loadData();
        if (data) {
            this.appData = data;
        } else {
            console.error("Gagal memuat data JSON.");
        }
        
        this.isLoadingData = false;

        // Simple router berdasarkan hash
        window.addEventListener('hashchange', this.handleHashChange);
        this.handleHashChange();
    },
    methods: {
        async loadAllTemplates() {
            const templates = [
                'app-navbar', 'app-login', 'app-dashboard', 
                'status-badge', 'app-modal', 'order-form', 
                'stok-table', 'do-tracking'
            ];
            
            // Kita inject script type="text/x-template" ke index.html
            for (const name of templates) {
                try {
                    const html = await window.SittaAPI.loadTemplate(name);
                    const script = document.createElement('script');
                    script.type = 'text/x-template';
                    script.id = `tmpl-${name}`;
                    script.innerHTML = html;
                    document.body.appendChild(script);
                } catch (e) {
                    console.error("Error loading template " + name, e);
                }
            }
            this.templatesLoaded = true;
        },
        
        handleHashChange() {
            const hash = window.location.hash.substring(1);
            if (!this.isLoggedIn && hash !== 'login') {
                this.navigateTo('login');
                return;
            }
            if (['login', 'dashboard', 'stok', 'tracking'].includes(hash)) {
                this.currentPage = hash;
            } else if (!hash) {
                this.navigateTo(this.isLoggedIn ? 'dashboard' : 'login');
            }
        },
        
        navigateTo(page) {
            window.location.hash = page;
        },
        
        handleLogin(user) {
            this.user = user;
            this.isLoggedIn = true;
            
            Swal.fire({
                icon: 'success',
                title: 'Login Berhasil',
                text: `Selamat datang, ${user.nama}!`,
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                this.navigateTo('dashboard');
            });
        },
        
        handleLogout() {
            Swal.fire({
                title: 'Konfirmasi Logout',
                text: "Anda yakin ingin keluar dari sistem?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f97316',
                cancelButtonColor: '#d1d5db',
                confirmButtonText: 'Ya, Logout',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.user = null;
                    this.isLoggedIn = false;
                    this.navigateTo('login');
                }
            });
        },

        // Event Handlers dari komponen
        handleTambahStok(newItem) {
            this.appData.stokBahanAjar.push(newItem);
        },
        handleEditStok(updatedItem) {
            const index = this.appData.stokBahanAjar.findIndex(s => s.kode === updatedItem.kode);
            if (index !== -1) {
                // Vue 2 reactivity update array element
                this.$set(this.appData.stokBahanAjar, index, updatedItem);
            }
        },
        handleHapusStok(kode) {
            this.appData.stokBahanAjar = this.appData.stokBahanAjar.filter(s => s.kode !== kode);
        },
        handleTambahTracking(payload) {
            // Vue 2 reactivity update object
            this.$set(this.appData.tracking, payload.id, payload.data);
        },
        handleUpdateProgress(payload) {
            const doItem = this.appData.tracking[payload.id];
            if (doItem) {
                doItem.perjalanan.push(payload.log);
                const ketLower = payload.log.keterangan.toLowerCase();
                if (ketLower.includes('diterima') || ketLower.includes('selesai')) {
                    doItem.status = 'Selesai';
                } else if (ketLower.includes('dibawa kurir') || ketLower.includes('transit')) {
                    doItem.status = 'Dalam Perjalanan';
                }
                this.$set(this.appData.tracking, payload.id, doItem);
            }
        }
    }
});
