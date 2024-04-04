<template>
  <div>
    <div style="display:flex;width:100%">

      <div :style="{ 'background-color': dirty ? '#ffdddd' : '' }"
        style="max-width: 400px;min-width: 400px;padding-left:8px;padding-right:8px;min-height: 100vh;">

        <div v-if="playlist">
          <PlaylistItemRoot v-if="playlist" @command="processCommand" :layout="layout" :item="playlist">
          </PlaylistItemRoot>

          <VBtn v-if="dirty" @click="SavePlayList()" color="primary" block>Save</VBtn>

        </div>

      </div>

      <div ref="previewPaneParent" style="xbackground-color: pink;flex:1">
        <div class="mb-2" v-if="layout" style="background-color: #ddd;display:flex;align-items: center;">
          <div style="padding:8px">
            Resolution: <b>{{ layout.resolution[0] }} x {{ layout.resolution[1] }}</b><br />
            Layout: <b>{{ layout.layout }}</b>
          </div>
          <div style="padding-left: 50px;">
            <VBtn class="mr-1" size="small" @click="setViewersRatio(0.5)">50/50</VBtn>
            <VBtn class="mr-1" size="small" @click="setViewersRatio(0.3)">30/70</VBtn>
            <VBtn size="small" @click="setViewersRatio(0.7)">70/30</VBtn>
          </div>
        </div>

        <div ref="previewPane" style="position: fixed;xbackground-color: pink;width:100%">

          <div style="display:flex;width:100%">
            <div :style="{ width: (this.viewersRatio * 100) + '%' }" style="padding:5px;overflow: hidden;">
              <h3>{{preview.name}} ({{ preview.title }}) </h3>

              <VBtn size="small" @click="setBackground('viewer1', '#000000')">black</VBtn>
              <VBtn size="small" @click="setBackground('viewer1', '#ffffff')">white</VBtn>
              <VBtn size="small" @click="setBackground('viewer1', '#ff0000')">red</VBtn>
              <VBtn size="small" @click="setBackground('viewer1', '#aaaaaa')">grey</VBtn>

              <VBtn size="small" color="red" @click="SendCommand(preview,'cls')">Clear</VBtn>

              <div style="position:relative;padding:5px;margin-top: 8px;overflow: hidden;"  >
                <div class="viewer" :class="{'viewer-active':preview.active}" ref="viewer1" style="position:relative">
                  <div @click.stop="SetActiveChannel(preview)" style="z-index: 10; position:absolute;width:100%;height:100%"></div>
                  <iframe ref="preview" class="cg-scaled-frame" scrolling:="no" :src="GetTemplateUrl(preview)"></iframe>
                </div>
              </div>

              <a class="app-link text-primary" :href="GetTemplateUrl(preview)" target="_blank">{{
                GetTemplateUrl(preview) }}</a>

              <VTable density="compact" hover>
                <thead>
                  <tr>
                    <td>Layer</td>
                    <td>Scene</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,key) in preview.state" :key="key" >
                    <td>{{ key }}</td>
                    <td>{{ item.template }}</td>
                    <td class="text-right">
                      <VBtn size="x-small" color="warning" @click="SendCommand(preview,'play',key,null,'off',null,true);" icon="mdi-minus"></VBtn>
                      <VBtn size="x-small" class="ml-2" xcolor="primary" @click="takeIn(key)" icon="mdi-chevron-right"></VBtn>
                    </td>
                  </tr>
                </tbody>
              </VTable>

              

            </div>
            <div :style="{ width: ((1 - this.viewersRatio) * 100) + '%' }" style="padding:5px;overflow: hidden">

              <h3>{{main.name}} ({{ main.title }})</h3>

              <VBtn size="small" @click="setBackground('viewer2', '#000000')">black</VBtn>
              <VBtn size="small" @click="setBackground('viewer2', '#ffffff')">white</VBtn>
              <VBtn size="small" @click="setBackground('viewer2', '#ff0000')">red</VBtn>
              <VBtn size="small" @click="setBackground('viewer2', '#aaaaaa')">grey</VBtn>

              <VBtn size="small" color="red" @click="SendCommand(main,'cls')">Clear</VBtn>

              <div style="position:relative;padding:5px;margin-top: 8px;overflow: hidden;"  >
                <div class="viewer" :class="{'viewer-active':main.active}" ref="viewer2"> 
                  <div @click.stop="SetActiveChannel(main)" style="z-index: 10; position:absolute;width:100%;height:100%"></div>
                  <iframe ref="main" style="position:relative;display: relative;" class="cg-scaled-frame" scrolling:="no"
                    :src="GetTemplateUrl(main)"></iframe>
                </div>
              </div>

              <a class="app-link text-primary" :href="GetTemplateUrl(main)" target="_blank">{{ GetTemplateUrl(main)
                }}</a>

              <VTable density="compact" hover>
                <thead>
                  <tr>
                    <td>Layer</td>
                    <td>Scene</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,key) in main.state" :key="key" >
                    <td>{{ key }}</td>
                    <td>{{ item.template }}</td>
                    <td class="text-right">
                      <VBtn size="x-small" color="warning" @click="SendCommand(main,'play',key,null,'off',null,true);" icon="mdi-minus"></VBtn>
                    </td>
                  </tr>
                </tbody>
              </VTable>


            </div>
          </div>


        </div>






        <!-- <ScoreboardScene @command="processCommand" :definition="scene" :data="{}" v-for="(scene, i) in scenes.scenes"
          :key="i">
        </ScoreboardScene>
 -->

      </div>
    </div>
  </div>


</template>
<script>

import { VBtn } from 'vuetify/lib/components/index.mjs';
import templateService from '@/services/templateService'
import appSettingsService from '@/services/appSettingsService'

import { toRaw } from "vue"
import { gsap } from "gsap";
import { getCurrentInstance, toHandlers } from 'vue';

export default {
  name: 'TestVue',
  data() {
    return {
      template: {},
      layoutName: null,
      layout: null,
      viewersRatio: 0.5,
      playlistName: null,
      playlist: null,
      loading: false,
      currentData: null,
      currentDefinition: null,
      selectedItem: null,
      previewPaneWidth: 0,
      templateServer: '',
      dirty: false,
      preview: {},
      main: {},
      channels: {},
      activeChannel:null
    };
  },
  methods: {
    GetTemplateUrl(cnl) {
      if (!this.layout) return "";
      var toRet = templateService.buildUrl(this.templateServer, this.layout, cnl);
      //console.log("templateServer=", this.templateServer, toRet)

      return toRet
    },

    SetActiveChannel(channel)
    {
      console.log("SET ACTIVE CHANNEL ",channel)
      this.activeChannel=channel
      Object.keys(this.channels).forEach(k=>
      {
        this.channels[k].active=false
      })
      if (channel!=null) channel.active=true;
    },

    SavePlayList() {
      console.log("save playlist ");

      templateService.savePlayList(this.layoutName, this.playlistName, this.playlist).then(ok => {
        this.origPlayList = JSON.stringify(this.playlist)
        this.checkDirty();
        console.log("success");
      }, error => {
        console.log("SHIT", error)
      })

      //templateService.getPlayList(this.layoutName, this.playlistName).then(
    },

    GetRouteUrl() {
      var route = this.$router.resolve({ name: 'cgtest' });
      return route.href
    },

    isObject(object) {
      return object != null && typeof object === "object";
    },

    isDeepEqual(object1, object2) {

      const objKeys1 = Object.keys(object1);
      const objKeys2 = Object.keys(object2);

      if (objKeys1.length !== objKeys2.length) return false;

      for (var key of objKeys1) {
        const value1 = object1[key];
        const value2 = object2[key];

        const isObjects = this.isObject(value1) && this.isObject(value2);

        if ((this.isObjects && !this.isDeepEqual(value1, value2)) ||
          (!isObjects && value1 !== value2)
        ) {
          return false;
        }
      }
      return true;
    },

    //GetRouteUrl() {
    //return 'https://chronorace.blob.core.windows.net/webresources/cgtemplates/index.html#/wbd/default';
    //},

    LoadPlayList() {
      this.loading = false;
      console.log("load playlist ", this.layoutName, this.playlistName);

      templateService.getPlayList(this.layoutName, this.playlistName).then(playlist => {
        this.playlist = playlist;

        this.origPlayList = JSON.stringify(playlist);
      })

      templateService.getLayoutDefinition(this.layoutName).then(layout => {
        console.log("GetLayoutDefinition ok")
        this.layout = layout;
        this.loading = false;
        this.resizeViewers();
      },error=>{
        console.log("AN ERROR OCCURED ",error)
      })
    },

    GetQueryParameters() {
      return this.$route.query;
    },

    setViewersRatio(ratio) {
      this.viewersRatio = ratio
      setTimeout(() => {
        this.resizeViewers()
      }, 0);
    },

    GetCurrentChannel()
    {
      return this.activeChannel;
    },


    SendCommand(channel,command,layer,page,action,data,off)
    {      
      console.log("send command ",command,"/",page," on layer ",layer)

      if (action && action=='off') off=true

      if (!layer) layer="default";
      switch (command)
      {
        case "cls":
          channel.state={}
          break;

        case "play":
          if (off)
          {
            delete channel.state[layer];
          }
          else
          {
            channel.state[layer]={ "template":  page,"action": action,"data":data }

          }
          break;
      }



      setTimeout(() => {
        switch (channel.mode)
        {          
          case "direct":
            var frame=this.$refs[channel.channel]
            console.log("frame = ",frame)
            
            var toSend = { command: command, page: page, action: action, data: toRaw(data), layer: layer };

            frame.contentWindow.postMessage(toSend, '*');

            break;

          default:
            console.log("lala??")
            templateService.command(channel,command,layer,page,action,data==null?null:toRaw(data))
            break;
        }

        //this.command(command.page, command.action, command.data, command.layer)
        

      }, 0);
    },

    processCommand(command) {
      console.log("process command", command)

      var currentChannel=this.GetCurrentChannel();
      if (currentChannel==null) return;

      var item=command.item;

      switch (command.action)
      {
        case "off":
          this.SendCommand(currentChannel,"play",item.layer,null,"off",null,true);
          break;

        default:
          this.SendCommand(currentChannel,"play",item.layer            
          ,item.template,item.action,item.data,false);
          break;
      }



    },

    ObjectChanged(definition, value) {
      console.log("change occured", value)
      if (this.selectedItem == null) return
      this.selectedItem.data = value
    },

    OpenObjectEditor() {
      var objEditor = this.$refs["objEditor"];
      console.log("ok? ", objEditor)
      objEditor.Edit(this.obj, this.definition, "Hello").then(reply => {
        console.log("object editor reply: ", reply);
        if (reply.key == 'OK') this.obj = reply.data
      });
    },

    GetTemplate() {
      templateService.get("WBD").then(template => {
        this.template = template
        console.log("resolution of template: ", this.template)
      });
    }

    , setBackground(viewer, color) {
      gsap.set(this.$refs[viewer], { 'background-color': color });
    },

    getElementWidth(element) {
      var cs = getComputedStyle(element);

      var paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);

      var borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
      return element.offsetWidth - paddingX - borderX;
    },

    checkDirty() {
      if (this.playlist) {
        this.dirty = !(JSON.stringify(this.playlist) === this.origPlayList);

      } else this.dirty = false;
    },

    takeIn(layer)
    {
      var data=this.preview.state[layer];
        if (data)
        {
          this.SendCommand(this.main,"play",layer,data.template,data.action,data.data);
        }
        //{ "template":  page,"action": action,"data":data }
    },

    takeOut(layer)
    {
      var data=this.main.state[layer];
      if (data)
      {
        this.SendCommand(this.main,"play",layer,null,"off",null,true);        
      }
      //{ "template":  page,"action": action,"data":data }
    },

    resizeViewers() {

      var viewers = this.$el.querySelectorAll(".viewer")

      console.log("resize viewers", viewers.length);

      viewers.forEach(viewer => {

        if (!this.layout) return;

        var width = this.getElementWidth(viewer.parentNode)

        var aspectRation = this.layout.resolution[0] / this.layout.resolution[1]

        var scale = width / this.layout.resolution[0];

        console.log("viewer ", width, this.layout.resolution[0], aspectRation)

        var iframe = viewer.querySelectorAll("iframe");
        console.log("IFrame ",  width, width / aspectRation)

        gsap.set(viewer, { width: width, height: width / aspectRation });

        gsap.set(iframe, { scale: scale,width:this.layout.resolution[0],height:this.layout.resolution[1] });
      })
    }
  },
  mounted: function () {

    this.templateServer = this.$route.query.ts;
    this.preview = templateService.parseChannel(this.$route.query.p,'preview',"Preview");
    this.main = templateService.parseChannel(this.$route.query['1'],'main',"Main");
    this.SetActiveChannel(this.preview);

    this.channels["P"]=this.preview;
    this.channels["1"]=this.main;


    console.log("document ",document)

    /*hotkeys('f1', {keyup: true},function(event, handler){
      // Prevent the default refresh event under WINDOWS system
      event.preventDefault()
      console.log("F1 PRESSED")
      return false;
    });
    hotkeys('f2', {keyup: true},function(event, handler){
      // Prevent the default refresh event under WINDOWS system
      event.preventDefault()
      console.log("F2 PRESSED")
      return false;
    });*/

    document.addEventListener("keydown", e =>
    {
      if (e.key=='F1')
      {
        console.log("keydown: ",e.key,e,this.preview)

        this.takeIn("default");

        e.preventDefault();
        return false;
      }
      if (e.key=='F2')
      {
        console.log("keydown: ",e.key,e)

        this.takeOut("default");

        e.preventDefault();
        return false;
      }

    },true);


    //    return this.$route.query;

    console.log("playlist mounted: ", this.$route.query);

    if (this.$route.query.env) {
      appSettingsService.setEnv(this.$route.query.env)
    }

    this.layoutName = this.$route.params.layout;
    this.playlistName = this.$route.params.playlist;
    this.LoadPlayList();

    // Create a ResizeObserver instance and specify the callback function
    this.resizeObserver = new ResizeObserver(entries => {
      var firstEntry = entries[0];
      gsap.set(this.$refs["previewPane"], { width: firstEntry.contentRect.width })
      for (let entry of entries) {
        // Each entry is an instance of ResizeObserverEntry
        console.log(`Size changed! New size: ${entry.contentRect.width}px by ${entry.contentRect.height}px`);
        this.previewPaneWidth = entry.contentRect.width;

        this.resizeViewers();
        //console.log("viewer1 ",viewer1);
      }
    });

    var previewPaneContent = this.$refs["previewPaneParent"];
    if (previewPaneContent) this.resizeObserver.observe(previewPaneContent);

    this.dirtyInterval = setInterval(() => this.checkDirty(), 2000)

  },
  beforeUnmount() {
    console.log("stop resize observer")
    this.resizeObserver.unobserve();
    if (this.dirtyInterval) clearTimeout(this.dirtyInterval);

    hotkeys.unbind();
  },

  created: function () {
  }
};
</script>
<style>
.viewer {
  padding: 0;
  overflow: hidden;
  background-color: black;
  outline: solid 5px lime; 
}

.viewer-active 
{
  outline: solid 5px red !important; 
}

.cg-scaled-frame {
  border: 0px;
  zoom: 1;
  -webkit-transform-origin: 0 0;
}

@media screen and (-webkit-min-device-pixel-ratio:0) {
  .cg-scaled-frame {
    zoom: 1;
  }
}
</style>