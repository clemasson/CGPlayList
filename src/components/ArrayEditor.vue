<template>

  <VRow>
    <VCol>
      <v-expansion-panels multiple class="mb-2">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <h2>{{definition.field}}</h2>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <VExpansionPanels multiple v-if="value">
              <draggable v-model="obj[definition.field]" style="width: 100%;" item-key="index">
                <template #item="{ element, index }">
                  <VExpansionPanel>
                    <VExpansionPanelTitle><b>{{ element[definition.title] }}</b></VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <ObjectContentEditor :value="element" :definition="definition"></ObjectContentEditor>
                      <div
                        style="display:flex;width:100%;xbackground-color: lime; flex-direction: column; align-items: flex-end;  justify-content: flex-end;">
                        <VBtn class="mt-2" color="red" @click="RemoveElementByIndex(index)">
                          Remove
                          <v-icon icon="mdi-delete" end></v-icon>
                        </VBtn>
                      </div>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                </template>
              </draggable>
            </VExpansionPanels>

            <div v-if="value"
              style="display:flex;width:100%;xbackground-color: lime; flex-direction: row; align-items: flex-end;  justify-content: flex-end;">
              <VBtn class="mt-2 mr-2" color="red" @click="RemoveElement()">
                Remove
                <v-icon icon="mdi-delete" end></v-icon>
              </VBtn>
              <VBtn class="mt-4" color="green" @click="AddElement()">
                Add
                <v-icon icon="mdi-plus" end></v-icon>
              </VBtn>
            </div>

            <div v-else>
              NULL

              <div 
                style="display:flex;width:100%;xbackground-color: lime; flex-direction: row; align-items: flex-end;  justify-content: flex-end;">
                <VBtn class="mt-2" color="blue" @click="Create()">
                  Create
                  <v-icon icon="mdi-plus" end></v-icon>
                </VBtn>
              </div>

            </div>

          </v-expansion-panel-text>


        </v-expansion-panel>
      </v-expansion-panels>
    </VCol>
  </VRow>

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
      localDefinition:{}
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
      },

      Create()
      {
        //this.obj[this.definition.field]=[];
        this.$emit("change",this.definition,[])
      },

      AddElement()
      {
        this.obj[this.definition.field].push({});
      }
  },
  created:function()
  {
  }
}
</script>
  
