<template>
    <div
      style="display: flex;flex-direction: row;align-items: center;padding-top: 8px;padding-bottom: 8px;"
    >
      <div style="flex: 1;">
        
        <VTextField
          v-model="obj[definition.field]"
          :label="definition.name || definition.field"
        /> 
      </div>
    </div>
  </template>
  
  
  <script>
//  import UITools from '@/components/UITools.vue';
  
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
  
  