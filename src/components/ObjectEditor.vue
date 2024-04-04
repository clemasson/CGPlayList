<template>

<VExpansionPanels v-model="panels" multiple class="mb-2 " v-if="definition">
    <VExpansionPanel value="main" >
      <VExpansionPanelTitle class="pt-0 pb-0">
        <h3>{{ definition.name || definition.field }}</h3>
        <VSpacer></VSpacer>
        <VBtn tabindex="-1" variant="text" v-if="value" size="small" icon="mdi-delete" color="red" @click.stop="RemoveElement()">
        </VBtn>
        <VBtn variant="text" v-if="!value" icon="mdi-plus" size="small" color="blue" @click.stop="Create()"></VBtn>
      </VExpansionPanelTitle>
      <VExpansionPanelText >

        <div v-if="value && definition.childs" v-for="(field,idx) in definition.childs" :key="idx">
          <Component :is="field.type+'Editor'" :ref="field.name" :value="value[field.field]" :obj="value"
            :definition="field" @change="Change" />
        </div>

        <div v-if="value"
          style="display:flex;width:100%;xbackground-color: lime; flex-direction: row; align-items: flex-end;  justify-content: flex-end;">
        </div>

        <div v-else>
          NULL
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
  import TextareaEditor from '@/components/TextareaEditor.vue'
  //import UITools from '@/components/UITools.vue'
  import { toRaw } from "vue"

  
  export default {
    components: { TextEditor,DropDownEditor,DropdownEditor:DropDownEditor,BooleanEditor,ArrayEditor,TextareaEditor },
    props: ["obj", "definition","value","expand"],
    emits: ["change"],

    data() {
      return {
        localDefinition:[],
        panels:[]
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
        console.log("remove element")
        this.$emit("change",this.definition,null)
        this.panels=[]
        //this.obj[this.definition.field]=null;
      },

      Create()
      {
        //this.obj[this.definition.field]=[];
        var obj={};

        if (this.definition.childs)
        {
          this.definition.childs.forEach(child=>{
            obj[child.field]=child.default;
          })
        }

        this.$emit("change",this.definition,obj)
        this.panels=["main"]
      },

    },
    mounted:function()
    {
      if (this.expand) this.panels=["main"]
    },
    created:function()
    {
      //console.log("object def",this.obj);
            
    }
  }
  </script>
  