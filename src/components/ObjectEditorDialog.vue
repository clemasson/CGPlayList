<template>
  <VDialog v-model="showDialog" name="dlgEdit" persistent max-width="400">
    <VCard>
      <VCardTitle class="headline" v-if="title">
        <span>{{ title }}</span>
      </VCardTitle>

      <VCardText v-if="errorMessage">
        <VAlert :xicon="false" :text="errorMessage" type="error" />
      </VCardText>

        <VForm ref="form" v-model="valid" lazy-validation @submit.prevent="checkForm">

          <ObjectEditor :expand="true" :value="obj" @change="ChangeOccured" :definition="definition" ref="objEditor" />

        </VForm>
      

      <VCardActions>
        <VSpacer />
        <VBtn v-for="action in actions" :key="action.key" text @click="dlgClick(action)">
          {{ action.key }}
        </VBtn>
      </VCardActions>

    </VCard>

  </VDialog>

</template>
  
  
<script>

import { toHandlers } from "vue"
import ObjectEditor  from "./ObjectEditor.vue"

  export default {
  components: { ObjectEditor },

  data() {
    return {
      showDialog:false,
      errorMessage:null,
      title:null,
      actions:[],
      valid:false,
      obj:null,
      definition:null
    }
  },  
  mounted:function()
  {
  },
  methods:
  {
    checkForm()
    {
      this.dlgClickKey('OK')
    },

    dlgClickKey:function(key)
    {
      this.actions.forEach(a=>{
        if (a.key==key)
        {
          this.dlgClick(a)
        }
      })
    },

    dlgClick:function(action)
    {
      console.log("click ",action)

      if (typeof action=='string')
      {
        this.dialog=false

        this.promiseResolve({ action: action } )
      } 
      else if (action.action)
      {
        this.errorMessage=null

        console.log('action defined')
        var reply=action.action()
        console.log('reply=',reply)

        Promise.resolve(reply).then(success=>
        {
          this.promiseResolve( { key: action.key,data: this.obj,definition:this.definition } )

          this.showDialog=false
        },error=>{
          console.log('action returns error ',error)
          this.errorMessage=error==null?"???":error
        })

      } 
      else 
      {
        console.log("we'll close dialog")
        this.showDialog=false
        

        this.promiseResolve( { key: action.key } )
      }
    
    },  
      
    SetActions(actions)
    {
      if (!actions)
      {
        this.actions=[{ key:'OK',default:false }]
      }
      else if (Array.isArray(actions))
      {
        this.actions=actions
      } 
      else
      {
        this.actions=[]
        actions.split(',').forEach(action=>{
          
          this.actions.push({ key: action })
        })
      }           
    },

    ChangeOccured(definition,value)
    {
      console.log("change occured in dialog",value)
      this.obj=value
    },
    
    Edit(obj,definition,title)
    {
      console.log("Edit Called");

      this.SetActions([{ key:'OK',action: ()=>{
        //validate
        return new Promise((resolve,reject)=>{

          console.log('Checkform')

          this.$refs.form.validate().then(valid=>{
            if (valid)
            {
              var validate=null;  // later
              if (validate)
              {
                Promise.resolve(validate(this.definition)).then(ok=>{
                  console.log("we will accept")
                  resolve(ok)
                }
                ,error=>reject(error))
              } else resolve(this.definition)
              
            } else {
              console.log("valid false");
              reject()
            }
          },error=>{
            reject(error)
          })

        })
      } },{ key: 'CANCEL' }]);
    

      this.obj=JSON.parse(JSON.stringify(obj));
      this.title=title;
      this.definition=definition;
      this.showDialog=true
      this.errorMessage=null


      return new Promise((resolve,reject)=>{
        this.promiseResolve=resolve
        this.promiseReject=reject
      });

    }
  },
  created:function()
  {
    
          
  }
}
</script>
