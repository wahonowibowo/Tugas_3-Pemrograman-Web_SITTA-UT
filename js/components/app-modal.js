Vue.component('app-modal', {
  props: {
    title: {
      type: String,
      required: true
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  template: '#tmpl-app-modal'
});
