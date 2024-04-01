<template>
  <div>
    <div style="display:flex;width:100%">

      <div style="max-width: 400px;min-width: 400px;xbackground-color: aqua;padding-left:8px;padding-right:8px">
        <span v-if="layout">
          {{ layout.resolution[0] }} x {{ layout.resolution[1] }}
        </span>
        <PlaylistItemRoot v-if="playlist" @command="processCommand" :layout="layout" :item="playlist">
        </PlaylistItemRoot>
        <span v-if="playlist">MAX ID: {{ playlist.maxid }}</span>

      </div>

      <div ref="previewPaneParent" style="background-color: pink;flex:1">
        <div ref="previewPane" style="position: fixed;background-color: pink;width:100%">

          Viewer width ({{previewPaneWidth}}):
          <VBtn size="small" @click="setViewerSize(1920)">1920x1080 (100%)</VBtn>
          <VBtn size="small" @click="setViewerSize(1440)">1440x810 (75%)</VBtn>
          <VBtn size="small" @click="setViewerSize(960)">960x540 (50%)</VBtn>

          Background color:
          <VBtn size="small" @click="setBackground('#000000')">black</VBtn>
          <VBtn size="small" @click="setBackground('#ffffff')">white</VBtn>
          <VBtn size="small" @click="setBackground('#ff0000')">red</VBtn>
          <VBtn size="small" @click="setBackground('#aaaaaa')">grey</VBtn>


          Global: <button class="warning" @click="cls()">clear</button>

          <br /><br />

          <div style="display:flex;width:100%">
          <div style="width:50%;background-color: yellow;padding:5px" >
            <div style="aspect-ratio:16/9;background-color: aqua;">gffg</div>
            gfgfd
          </div>
          <div style="width:50%;background-color: orange;padding:5px" >
            <div style="aspect-ratio:16/9;background-color: cadetblue;">gffg</div>
            gfgfd
          </div>          
        </div>


          <div ref="viewer" class="wrap" style="width:960px;xheight: 540px;background-color: #aaaaaa;">
            <iframe ref="frame" class="scaled-frame" :src="GetRouteUrl()"></iframe>
          </div>


          {{ layout }}

          erg
          <pre>

          {{ GetQueryParameters() }}
          {{ playlist }}

          <pre>
        </pre>

          </pre>

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

import { gsap } from "gsap";
import { getCurrentInstance, toHandlers } from 'vue';


export default {
  name: 'TestVue',
  data() {
    return {
      template: {},
      layoutName: null,
      layout: null,
      playlistName: null,
      playlist: null,
      loading: false,
      currentData: null,
      currentDefinition: null,
      selectedItem: null,
      previewPaneWidth:0
    };
  },
  methods: {

    GetRouteUrl() {
      return 'https://chronorace.blob.core.windows.net/webresources/cgtemplates/index.html#/wbd/default';

    },
    LoadPlayList() {
      this.loading = false;
      console.log("load playlist ", this.layoutName, this.playlistName);

      templateService.getPlayList(this.layoutName, this.playlistName).then(playlist => {
        this.playlist = playlist;
      })

      templateService.get(this.layoutName).then(layout => {
        this.layout = layout;
        this.loading = false;
      })
    },

    GetQueryParameters() {

      return this.$route.query;
    },
    processCommand(command) {
      console.log("process command", command)
      var item = command.item;


      setTimeout(() => {
        //this.command(command.page, command.action, command.data, command.layer)
      }, 0);
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

    , setBackground(color) {
      gsap.set(this.$refs["viewer"], { 'background-color': color });
    },
    setViewerSize(size) {
      console.log("set viewer size: ")
      gsap.set(this.$refs["viewer"], { width: size, height: size * 9 / 16 });
      gsap.set(this.$refs["frame"], { scale: size / 1920 });
    },
    setViewerSizeTest(size) {
      console.log("set viewer size: ")
      gsap.set(this.$refs["viewer"], { width: size, height: size * 9 / 16 });
      gsap.set(this.$refs["frame"], { scale: size / 1920 });
    },

  },
  mounted: function () {
    console.log("mounted: ", this.$route.params);
    this.layoutName = this.$route.params.layout;
    this.playlistName = this.$route.params.playlist;
    this.LoadPlayList();


    // Create a ResizeObserver instance and specify the callback function
    this.resizeObserver = new ResizeObserver(entries => {
      var firstEntry=entries[0];
      gsap.set(this.$refs["previewPane"],{ width:firstEntry.contentRect.width })
      for (let entry of entries) {
        // Each entry is an instance of ResizeObserverEntry
        console.log(`Size changed! New size: ${entry.contentRect.width}px by ${entry.contentRect.height}px`);
        this.previewPaneWidth=entry.contentRect.width;

      }
    });

    this.resizeObserver.observe(this.$refs["previewPaneParent"]);

    console.log("previewPaneParent", this.$refs["previewPaneParent"]);

  },
  beforeUnmount()
  {
    console.log("stop resize observer")
    this.resizeObserver.unobserve();
  },  

  created: function () {


  }

};
</script>
<style>
.wrap {
  padding: 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: black;
  border: solid 1px red;
  border-collapse: collapse;
}

.scaled-frame {
  width: 1920px;
  height: 1080px;
  border: 0px;
}

.scaled-frame {
  zoom: 1;
  -webkit-transform: scale(0.1);
  -webkit-transform-origin: 0 0;
}

@media screen and (-webkit-min-device-pixel-ratio:0) {
  .scaled-frame {
    zoom: 1;
  }
}
</style>