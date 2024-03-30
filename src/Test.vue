<template>
  <span>
    <h1>Test view</h1>
    <modal ref="test"> gfgfd </modal>
  </span>
</template>
<script>
export default {
  name: 'TestVue',
  data() {
    return {};
  },
  methods: {
    loadRenderer(template, channel) {
      console.log('load renderer ', channel);
      this.$router.push({ name: template, params: { channel } });
    },
  },
};
</script>
