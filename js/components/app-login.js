Vue.component('app-login', {
  props: {
    users: { type: Array, required: true }
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    submitLogin() {
      this.errorMessage = '';
      const user = this.users.find(u => u.email === this.email && u.password === this.password);
      if (user) {
        this.$emit('login-success', user);
      } else {
        this.errorMessage = 'Email atau password salah. Silakan coba lagi.';
      }
    },
    forgotPassword() {
      if (typeof Swal !== 'undefined') {
        Swal.fire({ title: 'Lupa Password?', text: 'Silakan hubungi admin UT untuk reset password.', icon: 'info' });
      } else {
        alert('Hubungi admin UT untuk reset password.');
      }
    },
    register() {
      if (typeof Swal !== 'undefined') {
        Swal.fire({ title: 'Buat Akun Baru', text: 'Kunjungi laman MyUT untuk membuat akun baru.', icon: 'question' });
      } else {
        alert('Kunjungi laman MyUT untuk mendaftar.');
      }
    }
  },
  template: '#tmpl-app-login'
});
