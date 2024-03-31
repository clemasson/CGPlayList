<template>
  <span>
    <ObjectEditorDialog ref="objEditor"></ObjectEditorDialog>
    
    <h1>inline</h1>
    <VBtn @click="OpenObjectEditor()">Edit dialog</VBtn>

    <VBtn @click="GetTemplate()">GetTemplate</VBtn>

    <VCard class="mx-auto" style="max-width: 480px;">
      <VCardText>
        <ObjectEditor ref="objectEditor" :value="obj"  :definition="definition" @change="ChangeOccured" />
      </VCardText>
      <VCardText>

        <VRow>
          <VCol>
            <h1>Template</h1>
            <pre>{{ template }}</pre>
          </VCol>
          <VCol>
            <h1>Object</h1>
            <pre>{{ obj }}</pre>
          </VCol>
          <!-- <VCol>
            <h1>Definition</h1>
            <pre>{{ definition }}</pre>
          </VCol> -->

        </VRow>

      </VCardText>
    </VCard>
  </span>
</template>
<script>
import { registerRuntimeCompiler } from 'vue';
import { VBtn } from 'vuetify/lib/components/index.mjs';
import templateService from  '@/services/templateService' 

export default {
  name: 'TestVue',
  data() {
    return {
      template:{},
      definition: {
        field:"root",
        childs:[
        { 
            "field":"mode","name":"mode","description":"red / green",
            "help":"prout",
            "type":"dropdown",
            "dataset":["red","green"],
          },
          {
            "field":"enearthright",
            "type":"boolean",
            "true":1,
            "false":0,
          },
          {
            "field":"name",
            "name":"name",
            "type":"text",
          },
          {
                "field":"name1",
                "type":"object",
                "childs":[
                  {
                    "field":"firstname",
                    "type":"text"
                  },
                  {
                    "field":"lastname",
                    "type":"text"
                  }

                ]
              },
              {
                "field":"name2",
                "type":"object",
                "childs":[
                  {
                    "field":"firstname",
                    "type":"text"
                  },
                  {
                    "field":"lastname",
                    "type":"text"
                  }

                ]
              },
          {
            "field":"items",
            "type":"array",
            "title":"text",
            "childs":[
              {
                "field":"type",
                "type":"dropdown",
                "dataset":["text","nat"]
              },
              {
                "field":"text",
                "type":"text",
              },
              {
                "field":"nat",
                "type":"text",
              }
            ],
          },
        ]
      },
      obj:{
          "mode": "red",
          "enearthright": 0,
          "enearthleft": 1,
          "entitle": 0,
          "endetails": 0,
          "name": "<b>NEXT EVENT</b>",
          "enlocalisationdetails": 0,
          "name1":{
            "firstname":"coco"
          },
          "name2":
          {

          },
          "items": [
            {
              "type": "nat",
              "text": "Snowshoe",
              "nat": "USA",
            },
            {
              "type": "text",
              "text": "October 10 - 15",
            },
          ],   
        },

    };
  },
  methods: {
    ChangeOccured(definition,value)
    {
      console.log("change occured",value)
      this.obj=value
    },

    OpenObjectEditor()
    {
      var objEditor=this.$refs["objEditor"];
      console.log("ok? ",objEditor)
      objEditor.Edit(this.obj,this.definition,"Hello").then(reply=>{
        console.log("object editor reply: ",reply);
        if (reply.key=='OK') this.obj=reply.data
      });
    },

    GetTemplate()
    {
      templateService.get("WBD").then(template=>
      {
        this.template=template
        console.log("resolution of template: ",this.template)
      });

    }
  },
  mounted:function()
  {
    console.log("mounted.");
    
    
  }
};
</script>
