<template>

  <VSwitch color="primary" density="compact" :false-value="falseValue" :true-value="trueValue" v-model="obj[definition.field]"
    :label="definition.name || definition.field" hide-details inset></VSwitch>
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
    computed:
    {
      trueValue:function()
      {
        if (this.definition.hasOwnProperty('true')) return this.definition.true;
        return true;
      },
      falseValue:function()
      {
        if (this.definition.hasOwnProperty('false')) return this.definition.false;
        return false;
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
  
  