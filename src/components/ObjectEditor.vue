<template>


      <Component
        :is="field.type+'Editor'"
        v-for="(field,idx) in definition"
  
        :key="idx"
        :ref="field.name"
        :obj="obj"
        :definition="field"
      />
  
  

    
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
    props: ["obj", "definition"],
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
        
    },
    created:function()
    {
      console.log("object def",this.obj);

            
    }
  }
  </script>
  