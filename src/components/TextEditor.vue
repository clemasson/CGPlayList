<template>
  <VRow>
    <VCol>
      <VTextField dense :model-value="value" @input="ProcessInput($event)" :label="definition.name || definition.field" >
        <template v-slot:append-inner>
          <v-btn v-if="value!=null" icon="mdi-delete" variant="text" size="small" @click="SetNull()" >
          </v-btn>
        </template>
      </VTextField>
    </VCol>
  </VRow>
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
        console.log("Process Input: ",$event.target.value)
        this.$emit("change", this.definition,$event.target.value)
      } 
    },
  }
  </script>
  
  