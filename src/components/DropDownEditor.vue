<template>
    <VRow>
      <VCol>
      <VSelect
        v-model="obj[definition.field]"
        :items="definition.dataset"
        :label="definition.name || definition.field"
      /> 
    </VCol>
    </VRow>
  </template>
  
  <script>
  //import UITools from '@/components/UITools.vue';
  
  export default {
    components: {  },
    props: ["obj", "definition","value"],
    emits: ["change"],

    data() {
      return {
  
      }
    },  
    mounted:function()
    {
    },
    methods:
    {
        
    },
  }
  </script>
  