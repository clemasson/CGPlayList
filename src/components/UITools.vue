<template>
    <div>
      <VDialog
        v-if="dialog=='Message'"
        v-model="showDialog"
        name="dlgMessage"
        persistent
        max-width="400"
      >
        <VCard>
          <VCardTitle class="headline">
            <span>{{ title }}</span>
          </VCardTitle>
  
          <VCardText >
            {{ message }}
          </VCardText>
         
          <VCardActions v-if="actions">
            <VSpacer />
  
            <VBtn
              v-for="action in actions"
              :key="action.key"
              text            
              @click="dlgClick(action)"
            >            
              {{ action.key }}
            </VBtn>                
          </VCardActions>
        </VCard>
      </VDialog>
      
  
      <VSnackbar
        v-model="snackbar"
        :timeout="5000"
        color="success"
        bottom
      >
        {{ text }}
  
        <template #action="{ attrs }">
          <VBtn
            dark
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </VBtn>
        </template>
      </VSnackbar>
  
      <VDialog
        v-if="dialog=='Select'"  
        v-model="showDialog"
        name="dlgSelectDialog"
        persistent
        max-width="600"
      >
        <VCard>
          <VCardTitle class="headline">
            <span>{{ title }}</span>
          </VCardTitle>
  
          <VCardText >
            {{ message }}
          </VCardText>
  
          <VList
            lines="true"
            density="compact"
          >
            <div
              v-for="(item,i) in items"
              :key="i"
              active-color="primary"
              :value="item"
              @click="selectItem(item)"
            >
              <slot
                name="select"
                :item="item"
              >
                <VListItem
                  :value="item"
                  @click="selectItem(item)"
                >
                  <VListItemTitle v-text="item" />
                </VListItem>
              </slot> 
            </div>          
          </VList>
  
          <VCardActions>
            <VSpacer />
            <VBtn
              v-for="action in actions"
              :key="action.key"
              text            
              @click="dlgClick(action)"
            >            
              {{ action.key }}
            </VBtn>             
          </VCardActions>
        </VCard>
      </VDialog>
  
      <VDialog
        v-if="dialog=='EditText'"  
        v-model="showDialog"
        name="dlgTextDialog"
        persistent
        max-width="400"
      >
        <VCard>
          <VCardTitle class="headline">
            <span>{{ title }}</span>
          </VCardTitle>
  
          <VCardText v-if="errorMessage">
            <VAlert
              :xicon="false"
              :text="errorMessage"
              type="error"
            />
          </VCardText>
  
          <VForm
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="checkForm"
          >
            <slot name="form">
              <VCardText>
                <p v-if="message">
                  {{ message }}
                </p>
                <VTextField
                  v-model="text"
                  :label="fieldName"
                  :rules="requiredRules"
                  filled
                  required
                />
              </VCardText>
            </slot> 
          </VForm>
                
          
          <VCardActions v-if="actions">
            <VSpacer />
  
            <VBtn
              v-for="action in actions"
              :key="action.key"
              text            
              @click="dlgClick(action)"
            >            
              {{ action.key }}
            </VBtn>                
          </VCardActions>
        </VCard>
      </VDialog>    
    </div>
  </template>
  
  <script>
  import { toRaw } from "vue"
  
  export default {
    components: {},
    data() {
      return {     
        showDialog:false,
        dialog:'',
        items:[],
        translate:false,
        snackbar:false,
        message:'',
        title:'',
        valid:false,
        errorMessage:null,
        actions:[],
        promiseResolve:null,
        promiseReject:null,      
        fieldName:null,
        text:null,
        requiredRules: [
          v => !!v || "REQUIRED",
        ],
  
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
  
      show(dialogName,title,message,actions)
      {
        this.dialog=dialogName
        this.showDialog=true
        this.errorMessage=null
        
  
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
  
        console.log("ACTIONS: ",this.actions)
  
        this.message=message
        this.title=title
  
        return new Promise((resolve,reject)=>{
          this.promiseResolve=resolve
          this.promiseReject=reject
        })
      },
  
  
      showNotification:function(message)
      {
        this.text=message
        this.snackbar=true
      },
  
      showMessage:function(title,message,actions)
      {
        console.log('SHOW MESSAGE')
        
        return this.show('Message',title,message,actions)
      },
  
      select(title,message,items)
      {
        this.items=items
  
        var actions=[{ key: 'CANCEL' }]
  
        return this.show('Select',title,message,actions)
      },
  
      editText(title,message,fieldName,value,validate)
      {      
        //var actions=[{ key:'OK',action: validate },{ key: 'CANCEL' }]
  
        this.text=value
        this.fieldName=fieldName
  
        var actions=[{ key:'OK',action: ()=>{
          //validate
          return new Promise((resolve,reject)=>{
  
            console.log('Checkform')
  
            this.$refs.form.validate().then(valid=>{
              if (this.valid)
              {
                if (validate)
                {
                  Promise.resolve(validate(this.text)).then(ok=>{
                    console.log("we will accept")
                    resolve(ok)
                  }
                  ,error=>reject(error))
                } else resolve(this.text)
                
              } else {
                reject()
              }
            },error=>{
              reject(error)
            })
  
          })
        } },{ key: 'CANCEL' }]
      
        return this.show('EditText',title,message,actions)
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
  
      selectItem:function(item)
      {
        console.log("select item")
  
        this.dialog=false
  
        this.promiseResolve({ action: "select", item:toRaw(item) } )
      },
  
      dlgClick:function(action)
      {
  
        if (typeof action=='string')
        {
          this.dialog=false
  
          this.promiseResolve({ action: action } )
        } 
        else 
        {
          if (action.action)
          {
            this.errorMessage=null
  
            console.log('action defined')
            var reply=action.action()
            console.log('reply=',reply)
  
            Promise.resolve(reply).then(success=>
            {
              this.promiseResolve( { key: action.key,data: success } )
  
              this.dialog=false
            },error=>{
              console.log('action returns error ',error)
              this.errorMessage=error
            })
  
          } 
          else 
          {
            this.dialog=false
  
            this.promiseResolve( { key: action.key } )
          }
        }
      },  
  
     
      createDocumentAction()
      {
        console.log("Create document clicked")
        this.createDocument().then(success=>{
          console.log("reply: ",success)
        })
      },
    },
  }
  </script>
  
  