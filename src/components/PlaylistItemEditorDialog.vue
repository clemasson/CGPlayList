<template>
  <VDialog v-model="showDialog" name="dlgEdit" persistent max-width="900">
    <VCard>
      <VCardTitle class="headline" v-if="title">
        <span>{{ title }}</span>
      </VCardTitle>

      <VCardText v-if="errorMessage">
        <VAlert :xicon="false" :text="errorMessage" type="error" />
      </VCardText>

      <VForm ref="form" v-model="valid" lazy-validation @submit.prevent="checkForm">
        <VCardText>
          <VTextField variant="solo" density="compact" label="title" v-model="item.title"></VTextField>
        </VCardText>        
        <ObjectEditor v-if="item && definition" :expand="true" :value="item.data" @change="ChangeOccured" :definition="definition"
          ref="objEditor" />

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
      item:null,
      scene:null,
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

        this.promiseResolve( { key: action,item: this.item, scene: this.scene } )
      } 
      else if (action.action)
      {
        this.errorMessage=null

        console.log('action defined')
        var reply=action.action()

        Promise.resolve(reply).then(success=>
        {
          this.promiseResolve( { key: action.key,item: this.item, scene: this.scene } )

          this.showDialog=false
        },error=>{
          console.log('action returns error ',error)
          this.errorMessage=error==null?"???":error
        })

      } 
      else 
      {
        //console.log("we'll close dialog")
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
      this.item.data=value
    },
    
    Edit(item,layout,title)
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
    

      console.log("playlistitem",item)


      this.item=JSON.parse(JSON.stringify(item));
      this.title="Edit";
      
      this.scene=layout.sortedscenes[item.layoutkey];

      if (this.scene && this.scene.definition.length>0)
      {
      //console.log("item we edit: ",item)
        this.definition={field:'data',childs:this.scene.definition};
        
      } else
      {
        this.definition=null;
        this.item.data={}
      }

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
