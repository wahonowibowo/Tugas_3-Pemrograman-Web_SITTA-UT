document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // 0. NAVBAR MENGAMBANG & MOBILE MENU
    // ==========================================
    const navbar = document.getElementById('mainNavbar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileDropdownToggle = document.getElementById('mobileDropdownToggle');
    const mobileDropdownContent = document.getElementById('mobileDropdownContent');
    const dropdownArrow = document.getElementById('dropdownArrow');

    // --- Fungsi buka/tutup mobile menu ---
    function openMobileMenu() {
        if (!mobileMenu || !mobileOverlay || !hamburgerBtn) return;
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        hamburgerBtn.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scroll saat menu terbuka
    }

    function closeMobileMenu() {
        if (!mobileMenu || !mobileOverlay || !hamburgerBtn) return;
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = ''; // kembalikan scroll
    }

    // Toggle hamburger
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function () {
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // Klik overlay untuk tutup menu
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // --- Tutup mobile menu saat klik link navigasi ---
    if (mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('a[href]');
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                // Jangan tutup jika ini adalah dropdown toggle
                if (link.id === 'mobileDropdownToggle') return;
                closeMobileMenu();
            });
        });
    }

    // --- Mobile dropdown toggle ---
    if (mobileDropdownToggle && mobileDropdownContent) {
        mobileDropdownToggle.addEventListener('click', function (e) {
            e.preventDefault();
            mobileDropdownContent.classList.toggle('open');
            if (dropdownArrow) {
                dropdownArrow.style.transform = mobileDropdownContent.classList.contains('open')
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)';
            }
        });
    }

    // --- Mobile logout button ---
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', function () {
            closeMobileMenu();
            // Trigger logout yang sama dengan desktop
            handleLogout();
        });
    }

    // --- Navbar auto-hide saat scroll ke bawah, muncul saat scroll ke atas ---
    let lastScrollY = window.scrollY;
    let ticking = false;

    function handleNavbarScroll() {
        if (!navbar) return;

        const currentScrollY = window.scrollY;

        // Tutup mobile menu saat scroll
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }

        // Tambah shadow saat sudah scroll
        if (currentScrollY > 10) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        // Sembunyikan navbar saat scroll ke bawah, tampilkan saat scroll ke atas
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            // Scroll ke bawah — sembunyikan
            navbar.classList.add('navbar-hidden');
        } else {
            // Scroll ke atas — tampilkan
            navbar.classList.remove('navbar-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(handleNavbarScroll);
            ticking = true;
        }
    }, { passive: true });


    // ==========================================
    // 1. HALAMAN LOGIN
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            // Cek dataPengguna dari file data.js
            if (typeof dataPengguna !== 'undefined') {
                const user = dataPengguna.find(
                    (u) => u.email === email && u.password === password
                );

                if (user) {
                    localStorage.setItem('namaUser', user.nama);
                    Swal.fire({
                        title: 'Login Berhasil!',
                        text: `Selamat datang, ${user.nama}!`,
                        icon: 'success',
                        confirmButtonColor: '#f97316',
                        confirmButtonText: 'Lanjutkan',
                    }).then(() => window.location.href = 'dashboard.html');
                } else {
                    Swal.fire({
                        title: 'Login Gagal!',
                        text: 'Email atau password salah. Silakan coba lagi.',
                        icon: 'error',
                        confirmButtonColor: '#1e3a8a',
                        confirmButtonText: 'OK',
                    });
                }
            }
        });
    }

    // Lupa password dan Buat Akun
    const forgetLink = document.getElementById('forgetLink');
    const registerLink = document.getElementById('registerLink');
    if (forgetLink) {
        forgetLink.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire({ title: 'Lupa Password?', text: 'Silakan hubungi admin UT untuk reset password.', icon: 'info' });
        });
    }
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire({ title: 'Buat Akun Baru', text: 'Kunjungi laman MyUT untuk membuat akun baru.', icon: 'question' });
        });
    }

    // ==========================================
    // 2. DASHBOARD
    // ==========================================
    const greeting = document.getElementById('greeting');
    if (greeting) {
        const namaUser = localStorage.getItem('namaUser') || 'Admin SITTA';
        const hour = new Date().getHours();
        let timeOfDay = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 19 ? 'Selamat Sore' : 'Selamat Malam';

        // Cek apakah pakai desain tailwind baru atau css lama
        if(greeting.classList.contains('text-3xl')) {
            greeting.innerHTML = `${timeOfDay}, <span class="text-orange-500">${namaUser}</span>!<br>
            <span class="text-2xl font-normal text-gray-700">Selamat datang di Dashboard SITTA UT</span>`;
        } else {
            greeting.textContent = `${timeOfDay}, ${namaUser}! \nSelamat datang di Dashboard SITTA UT`;
        }
    }

    // --- Fungsi Logout (digunakan oleh desktop & mobile) ---
    function handleLogout() {
        Swal.fire({
            title: 'Yakin ingin logout?',
            text: 'Anda akan keluar dari sistem.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Logout',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('namaUser');
                Swal.fire({ title: 'Logout Berhasil', text: 'Anda telah keluar dari sistem.', icon: 'info', confirmButtonColor: '#1e3a8a' })
                .then(() => window.location.href = 'index.html');
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Logika Dropdown Menu Laporan (Desktop)
    const dropdownBtn = document.getElementById('laporanDropdownBtn');
    const dropdownMenu = document.getElementById('laporanDropdownMenu');
    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.transform = 'translateY(10px)';
            } else {
                dropdownMenu.style.display = 'block';
                setTimeout(() => {
                    dropdownMenu.style.opacity = '1';
                    dropdownMenu.style.transform = 'translateY(0)';
                }, 10);
            }
        });
        document.addEventListener('click', (e) => {
            if (!dropdownBtn.contains(e.target)) {
                dropdownMenu.style.display = 'none';
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.transform = 'translateY(10px)';
            }
        });
    }

    // ==========================================
    // 3. HALAMAN TRACKING
    // ==========================================
    const findBtn = document.getElementById('findBtn');
    const inputDO = document.getElementById('inputDO');
    if (findBtn && inputDO) {
        // Cari dengan tombol enter
        inputDO.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') findBtn.click();
        });

        findBtn.addEventListener('click', () => {
            const doNumber = inputDO.value.trim();
            const resultContainer = document.getElementById('trackingResult');
            
            if(!resultContainer) return;
            resultContainer.innerHTML = '';

            if (!doNumber) {
                Swal.fire({ title: 'Nomor DO Kosong', text: 'Masukkan Nomor DO terlebih dahulu.', icon: 'warning', confirmButtonColor: '#f97316' });
                return;
            }

            if (typeof dataTracking === 'undefined') {
                Swal.fire({ title: 'Error', text: 'Data sistem belum dimuat.', icon: 'error' });
                return;
            }

            const data = dataTracking[doNumber];
            if (!data) {
                Swal.fire({ title: 'Data Tidak Ditemukan', text: `Nomor DO ${doNumber} tidak tersedia.`, icon: 'error', confirmButtonColor: '#1e3a8a' });
                return;
            }

            // Jika pakai desain tailwind baru
            if (resultContainer.classList.contains('max-w-3xl')) {
                const perjalananHTML = data.perjalanan.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <span class="text-xs font-bold text-orange-500 mb-1 block"><i class="fa-regular fa-clock mr-1"></i> ${item.waktu}</span>
                            <p class="text-sm text-gray-700">${item.keterangan}</p>
                        </div>
                    </div>
                `).join('');

                // Map status text to visual classes (supports custom classes added in style.css)
                const statusLower = data.status.toLowerCase();
                let statusColor = 'bg-blue-100 text-blue-800 border-blue-200';
                if (statusLower.includes('dalam perjalanan')) {
                    statusColor = 'status-dalam-perjalanan';
                } else if (statusLower.includes('dikirim')) {
                    statusColor = 'status-dikirim';
                } else if (statusLower.includes('dikemas')) {
                    statusColor = 'status-dikemas';
                } else if (statusLower.includes('selesai')) {
                    statusColor = 'status-selesai';
                } else if (statusLower.includes('proses')) {
                    statusColor = 'status-proses';
                }

                resultContainer.innerHTML = `
                    <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 mt-6 animate-[fadeIn_0.5s_ease-out]">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-5 mb-6 gap-4">
                            <div>
                                <h3 class="text-xl font-bold text-blue-900">Detail Pengiriman</h3>
                                <p class="text-sm text-gray-500 mt-1">Nomor DO: <span class="font-bold text-gray-800">${data.nomorDO}</span></p>
                            </div>
                            <span class="px-4 py-1.5 rounded-full text-sm font-semibold border ${statusColor}">${data.status}</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8 bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100">
                            <div class="flex flex-col"><span class="text-xs text-gray-500 mb-1 uppercase font-semibold">Penerima</span><span class="text-sm font-medium text-gray-800">${data.nama}</span></div>
                            <div class="flex flex-col"><span class="text-xs text-gray-500 mb-1 uppercase font-semibold">Ekspedisi</span><span class="text-sm font-medium text-gray-800"><i class="fa-solid fa-truck text-orange-500 mr-2"></i>${data.ekspedisi}</span></div>
                            <div class="flex flex-col"><span class="text-xs text-gray-500 mb-1 uppercase font-semibold">Tanggal Kirim</span><span class="text-sm font-medium text-gray-800">${data.tanggalKirim}</span></div>
                            <div class="flex flex-col"><span class="text-xs text-gray-500 mb-1 uppercase font-semibold">Kode Paket</span><span class="text-sm font-medium text-gray-800">${data.paket}</span></div>
                            <div class="flex flex-col"><span class="text-xs text-gray-500 mb-1 uppercase font-semibold">Total Biaya</span><span class="text-sm font-medium text-gray-800">${data.total}</span></div>
                            
                        </div>
                        <h4 class="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2"><i class="fa-solid fa-route text-orange-500"></i> Riwayat Perjalanan</h4>
                        <div class="timeline">${perjalananHTML}</div>
                    </div>
                `;
            } else {
                // Jika pakai CSS lama
                const perjalananHTML = data.perjalanan.map(item => `
                    <li>
                        <div class="timeline-dot"></div>
                        <div class="timeline-info">
                            <span class="timeline-time">${item.waktu}</span>
                            <p class="timeline-text">${item.keterangan}</p>
                        </div>
                    </li>
                `).join('');

                resultContainer.innerHTML = `
                    <div class="tracking-card">
                        <h3>Detail Pengiriman</h3>
                        <div class="tracking-info">
                            <p><b>Nomor DO:</b> ${data.nomorDO}</p>
                            <p><b>Nama:</b> ${data.nama}</p>
                            <p><b>Status:</b> <span class="status">${data.status}</span></p>
                            <p><b>Ekspedisi:</b> ${data.ekspedisi}</p>
                            <p><b>Tanggal Kirim:</b> ${data.tanggalKirim}</p>
                        </div>
                        <h4>Riwayat Perjalanan</h4>
                        <ul class="timeline">${perjalananHTML}</ul>
                    </div>
                `;
            }
            // Untuk cabang CSS lama: terapkan kelas berdasarkan teks pada elemen dengan class "status"
            const statusSpanElem = resultContainer.querySelector('.status');
            if (statusSpanElem) {
                const st = statusSpanElem.textContent.trim().toLowerCase();
                if (st.includes('dalam perjalanan')) statusSpanElem.classList.add('status-dalam-perjalanan');
                else if (st.includes('dikirim')) statusSpanElem.classList.add('status-dikirim');
                else if (st.includes('dikemas')) statusSpanElem.classList.add('status-dikemas');
                else if (st.includes('selesai')) statusSpanElem.classList.add('status-selesai');
                else if (st.includes('proses')) statusSpanElem.classList.add('status-proses');
            }
        });
    }

    // ==========================================
    // 4. HALAMAN INFORMASI STOK BAHAN AJAR
    // ==========================================
    const tbody = document.querySelector('#tabelStok tbody');
    if (tbody && typeof dataBahanAjar !== 'undefined') {
        const renderTable = () => {
            if (dataBahanAjar.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">Belum ada data bahan ajar.</td></tr>`;
                return;
            }

            const rowsHTML = dataBahanAjar.map(item => {
                let stokClass = "text-gray-900 font-medium";
                if(item.stok < 50) stokClass = "text-red-600 font-bold";
                
                return `
                    <tr class="border-b border-gray-50 hover:bg-gray-50">
                        <td class="px-6 py-4 font-semibold text-blue-900">${item.kodeBarang}</td>
                        <td class="px-6 py-4 text-gray-800">${item.namaBarang}</td>
                        <td class="px-6 py-4 text-center ${stokClass}">${item.stok}</td>
                        <td class="px-6 py-4">
                            <span class="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-xs font-medium border border-gray-200">
                                <i class="fa-solid fa-location-dot mr-1"></i> ${item.kodeLokasi}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <a href="${item.cover}" data-cover="${item.cover}" class="cover-link inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-orange-100 hover:text-orange-500 transition-colors" title="Lihat Cover ${item.namaBarang}">
                                <i class="fa-regular fa-image text-lg"></i>
                            </a>
                        </td>
                    </tr>
                `;
            }).join('');
            
            tbody.innerHTML = rowsHTML;
        };
        
        renderTable();

        // klik pada ikon cover
        tbody.addEventListener('click', function (e) {
            const link = e.target.closest('.cover-link');
            if (!link) return;
            e.preventDefault();

            const cover = (link.getAttribute('data-cover') || '').trim();
            if (!cover || cover === '#' || cover.toLowerCase() === 'undefined') {
                Swal.fire({ title: 'Cover tidak ditemukan', text: 'Cover bahan ajar tidak ditemukan.',icon: 'error', confirmButtonColor: '#1e3a8a' });
                return;
            }

            Swal.fire({
                imageUrl: cover,
                imageAlt: 'Cover buku',
                showCloseButton: true,
                showConfirmButton: false,
                backdrop: true,
                width: 'auto'
            });
        });

        const formTambah = document.getElementById('formTambah');
        if (formTambah) {
            formTambah.addEventListener('submit', e => {
                e.preventDefault();
                
                const kodeBarang = document.getElementById('kode').value;
                const namaBarang = document.getElementById('nama').value;
                const stok = parseInt(document.getElementById('stok').value);
                const kodeLokasi = document.getElementById('lokasi').value;
                
                const coverInput = document.getElementById('cover').value;
                let cover = "#";
                if(coverInput) {
                    cover = coverInput.split('\\').pop().split('/').pop();
                }

                dataBahanAjar.push({ kodeBarang, namaBarang, stok, kodeLokasi, cover });
                renderTable();

                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Stok bahan ajar baru telah ditambahkan.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    backdrop: `rgba(0,0,123,0.4)`
                });

                e.target.reset();
            });
        }
    }
});