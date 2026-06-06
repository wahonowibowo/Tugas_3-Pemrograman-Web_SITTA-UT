Vue.component('app-dashboard', {
  props: {
    userName: { type: String, required: true }
  },
  computed: {
    greeting() {
      const hour = new Date().getHours();
      if (hour < 11) return 'Selamat Pagi';
      if (hour < 15) return 'Selamat Siang';
      if (hour < 19) return 'Selamat Sore';
      return 'Selamat Malam';
    }
  },
  template: '#tmpl-app-dashboard'
});
