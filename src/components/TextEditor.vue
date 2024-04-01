<template>
  <VTextField density="compact" :model-value="value" variant="solo" @input="ProcessInput($event)"
    :label="definition.name || definition.field">
    <template v-slot:append-inner>
      <v-btn tabindex="-1" v-if="value!=null" icon="mdi-close" color="red" variant="text" size="small" @click="SetNull()">
      </v-btn>
    </template>
  </VTextField>
</template>
    
<script>
//  import UITools from '@/components/UITools.vue';
  
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
      SetNull()
      {
        console.log("set content to null");
        //this.obj[this.definition.name]=null
        this.$emit("change", this.definition,null)
      },
      ProcessInput($event)
      {
        //console.log("Process Input: ",$event.target.value)
        this.$emit("change", this.definition,$event.target.value)
      } 
    },
  }
  </script>
  
  