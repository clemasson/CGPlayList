<template>
    <div style="display: flex;flex-direction: row;align-items: center;padding-top: 8px;padding-bottom: 8px;text-align: end;">
      <div style="width: 100px;padding-right: 8px;">
        <b>{{ definition.name || definition.field }}: </b>
      </div>
      <div>
        <!-- <VTextField
          v-model="obj[definition.field]"
          :label="definition.name || definition.field"
        /> -->
      </div>
    </div>
  </template>
  
  
  <script>
  //import UITools from '@/components/UITools.vue';
  
  export default {
    components: {  },
    props: ["obj", "definition"],
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
  
  