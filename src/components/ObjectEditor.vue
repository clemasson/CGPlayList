<template>
  <VExpansionPanels multiple class="mb-2">
    <VExpansionPanel>
      <VExpansionPanelTitle>
        <h2>{{ definition.field }}</h2>
      </VExpansionPanelTitle>
      <VExpansionPanelText>

        <div v-if="value && definition.childs" v-for="(field,idx) in definition.childs" :key="idx">
          <Component :is="field.type+'Editor'" :ref="field.name" :value="value[field.field]" :obj="value"
            :definition="field" @change="Change" />
        </div>

        <div v-if="value"
          style="display:flex;width:100%;xbackground-color: lime; flex-direction: row; align-items: flex-end;  justify-content: flex-end;">
          <VBtn variant="text" icon="mdi-delete" class="mt-2 mr-2" color="red" @click="RemoveElement()">
          </VBtn>
        </div>

        <div v-else>
          NULL

          <div
            style="display:flex;width:100%;xbackground-color: lime; flex-direction: row; align-items: flex-end;  justify-content: flex-end;">
            <VBtn variant="text" class="mt-2" icon="mdi-plus" color="blue" @click="Create()">
            </VBtn>
          </div>

        </div>

      </VExpansionPanelText>
    </VExpansionPanel>

  </VExpansionPanels>
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
        if (value===null) delete this.value[definition.field];
        else this.value[definition.field]=value;
        //console.log("change event called on objecteditor: ",definition,value)
        
      }    ,      
      RemoveElement()
      {
        this.$emit("change",this.definition,null)
        //this.obj[this.definition.field]=null;
      },

      Create()
      {
        //this.obj[this.definition.field]=[];
        this.$emit("change",this.definition,[])
      },

    },
    created:function()
    {
      console.log("object def",this.obj);
            
    }
  }
  </script>
  