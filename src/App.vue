<template>
  <VApp>
    <VMain>
      <router-view></router-view>
    </VMain>
  </VApp>
</template>

<script>

import appSettingsService from '@/services/appSettingsService'

export default {
  name: 'App',
  data() {
    return {
    };
  },
  methods: {

  },
  mounted: function () {
    console.log("App mounted lalala ",this.$route.query)

    var route = useRoute();
    console.log("mmmhhh ",route.query)

    if (this.$route.query.env)
    {
      console.log("Environment set in url in app =",this.$route.query.env)
    }

  },

};

</script>

<style scoped></style>
