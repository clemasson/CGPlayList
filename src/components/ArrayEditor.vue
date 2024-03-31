<template>
  <v-expansion-panels multiple class="mb-2" v-model="panels">
    <v-expansion-panel value="main">
      <v-expansion-panel-title class="pt-0 pb-0">
        <div style="display: flex;xbackground-color: yellow;width: 100%; align-items: center;">
          <h3>{{definition.field}}</h3>
          <div style="flex:1"></div>
          <VBtn v-if="value" size="small" variant="text" icon="mdi-delete" color="red" @click.stop="RemoveElement()">
          </VBtn>
          <VBtn v-if="value" size="small" icon="mdi-plus" variant="text" color="green" @click.stop="AddElement()">
          </VBtn>
          <VBtn v-if="!value" size="small" icon="mdi-plus" variant="text" color="blue" @click.stop="Create()">
          </VBtn>
        </div>

      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <VExpansionPanels multiple v-if="value">
          <draggable v-model="obj[definition.field]" style="width: 100%;" item-key="index">
            <template #item="{ element, index }">
              <VExpansionPanel>
                <VExpansionPanelTitle class="pt-0 pb-0">
                  <b>{{ element[definition.title] }}</b>
                  <VSpacer></VSpacer>
                  <VBtn size="small" icon="mdi-delete" variant="text" color="red"
                    @click.stop="RemoveElementByIndex(index)">
                  </VBtn>

                </VExpansionPanelTitle>
                <VExpansionPanelText>
                  <ObjectContentEditor :value="element" :definition="definition"></ObjectContentEditor>
                </VExpansionPanelText>
              </VExpansionPanel>
            </template>
          </draggable>
        </VExpansionPanels>

        <div v-if="value && value.length==0">EMPTY</div>
        <div v-if="!value">
          NULL


        </div>

      </v-expansion-panel-text>


    </v-expansion-panel>
  </v-expansion-panels>

</template>
  
  
<script>

import { toRaw } from "vue"

import draggable from 'vuedraggable'
import { VCardActions } from "vuetify/lib/components/index.mjs";
//import UITools from '@/components/UITools.vue';

export default {
  components: { draggable },
  name:"ArrayEditor",
  props: ["obj", "definition","value"],
  data() {
    return {
      localDefinition:{},
      panels:[]
    }
  },  
  emits: ["change"],
  mounted:function()
  {
  },
  methods:
  {
      RemoveElementByIndex(index)
      {
        console.log("we are removing an element by index: ",index,this.obj[this.definition.field])

        this.obj[this.definition.field].splice(index,1);
      },

      RemoveElement()
      {
        this.$emit("change",this.definition,null)
        //this.obj[this.definition.field]=null;

        this.panels=[]
      },

      Create()
      {
        //this.obj[this.definition.field]=[];
        this.$emit("change",this.definition,[])
        this.panels=["main"]
      },

      AddElement()
      {
        this.obj[this.definition.field].push({});
        this.panels=["main"]
      }
  },
  created:function()
  {
  }
}
</script>
  
