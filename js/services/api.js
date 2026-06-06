/**
 * API Service Layer - SITTA UT
 * Menangani pengambilan data JSON dan pemuatan file template HTML.
 */
const SittaAPI = {
  /**
   * Fetch data bahan ajar JSON
   * @returns {Promise<Object>} Data JSON
   */
  async loadData() {
    try {
      const response = await fetch('data/dataBahanAjar.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Gagal memuat data:", error);
      // Fallback jika dijalankan via file:/// (browser blocks fetch)
      // Memberitahu pengguna bahwa diperlukan web server
      if (window.location.protocol === 'file:') {
        Swal.fire({
          icon: 'error',
          title: 'CORS Error',
          text: 'Harap jalankan aplikasi ini melalui Web Server (misal: Live Server di VS Code) agar fetch() API dapat berjalan.',
          confirmButtonText: 'Mengerti'
        });
      }
      return null;
    }
  },

  /**
   * Fetch file template HTML
   * @param {string} templateName Nama file template (tanpa .html)
   * @returns {Promise<string>} Isi template string
   */
  async loadTemplate(templateName) {
    try {
      const response = await fetch(`templates/${templateName}.html`);
      if (!response.ok) {
        throw new Error(`Gagal memuat template: ${templateName}`);
      }
      return await response.text();
    } catch (error) {
      console.error(error);
      return `<div>Error loading template ${templateName}</div>`;
    }
  }
};

// Global export
window.SittaAPI = SittaAPI;
