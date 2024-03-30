<template>

  <VRow>
    <VCol>
      <v-expansion-panels multiple>
        <v-expansion-panel>
          <v-expansion-panel-title>
            {{definition.field}}
          </v-expansion-panel-title>
          <v-expansion-panel-text>

            <VExpansionPanels multiple>
              <draggable v-model="obj[definition.field]" style="width: 100%;" item-key="index">
                <template #item="{ element, index }">
                  <VExpansionPanel>
                    <VExpansionPanelTitle>{{ element[definition.title] }}</VExpansionPanelTitle>
                    <VExpansionPanelText>
                    
                    <ObjectEditor :obj="element" :definition="definition.definition"></ObjectEditor> 
                    

                  </VExpansionPanelText>

                  </VExpansionPanel>
                </template>
              </draggable>
            </VExpansionPanels>

          </v-expansion-panel-text>

        </v-expansion-panel>
      </v-expansion-panels>
    </VCol>
  </VRow>

</template>
  
  
<script>

import { toRaw } from "vue"

import draggable from 'vuedraggable'
//import UITools from '@/components/UITools.vue';

export default {
  components: { draggable },
  name:"ArrayEditor",
  props: ["obj", "definition"],
  data() {
    return {
      localDefinition:{}
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
  }
}
</script>
  
