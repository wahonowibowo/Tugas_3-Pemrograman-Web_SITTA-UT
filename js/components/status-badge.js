Vue.component('status-badge', {
  props: {
    status: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'stok' // stok, tracking
    }
  },
  computed: {
    trackingClass() {
      const s = this.status.toLowerCase();
      if (s.includes('selesai')) return 'status-selesai';
      if (s.includes('perjalanan')) return 'status-perjalanan';
      return 'status-proses';
    },
    trackingIcon() {
      const s = this.status.toLowerCase();
      if (s.includes('selesai')) return 'fa-circle-check';
      if (s.includes('perjalanan')) return 'fa-truck-ramp-box';
      return 'fa-box-open';
    }
  },
  template: '#tmpl-status-badge'
});
