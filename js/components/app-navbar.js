Vue.component('app-navbar', {
  props: {
    activePage: { type: String, default: 'login' },
    isLoggedIn: { type: Boolean, default: false }
  },
  data() {
    return {
      mobileMenuOpen: false,
      dropdownOpen: false,
      mobileDropdownOpen: false
    };
  },
  methods: {
    navigate(page) {
      this.$emit('navigate', page);
      this.closeMobile();
    },
    toggleMobile() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    closeMobile() {
      this.mobileMenuOpen = false;
    },
    logoutAndCloseMobile() {
      this.$emit('logout');
      this.closeMobile();
    }
  },
  template: '#tmpl-app-navbar'
});
