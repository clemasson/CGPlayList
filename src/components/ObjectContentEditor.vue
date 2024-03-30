<template>
  <div v-if="value && definition.childs" v-for="(field,idx) in definition.childs" :key="idx">

    <Component :is="field.type+'Editor'" :ref="field.name" :value="value[field.field]" :obj="value" :definition="field"
      @change="Change" />
  </div>
</template>
  
  
  <script>
  import ArrayEditor from '@/components/ArrayEditor.vue'
  import BooleanEditor from '@/components/BooleanEditor.vue'
  import DropDownEditor from '@/components/DropDownEditor.vue'
  import TextEditor from '@/components/TextEditor.vue'
  //import UITools from '@/components/UITools.vue'
  import { toRaw } from "vue"

  
  export default {
    components: { TextEditor,DropDownEditor,DropdownEditor:DropDownEditor,BooleanEditor,ArrayEditor },
    props: ["obj", "definition","value"],
    emits: ["change"],

    data() {
      return {
        localDefinition:[]
      }
    },  
    mounted:function()
    {
    },
    methods:
    {
      Change:function(definition,value)
      {
        console.log("change event called on objecteditor: ",definition,value)
        this.value[definition.field]=value;
      }        
    },
    created:function()
    {
      console.log("object def",this.obj);

            
    }
  }
  </script>
  