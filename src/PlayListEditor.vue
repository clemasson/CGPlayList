<template>
  <div>
    <div style="display:flex;width:100%">

      <div style="max-width: 400px;min-width: 400px;xbackground-color: aqua;padding-left:8px;padding-right:8px">

        <PlaylistItemRoot v-if="playlist" @command="processCommand" :layout="layout" :item="playlist">
        </PlaylistItemRoot>
        <span v-if="playlist">MAX ID: {{ playlist.maxid }}</span>

      </div>

      <div ref="previewPaneParent" style="xbackground-color: pink;flex:1">
        <div v-if="layout" style="background-color: #ddd;">
          Resolution: <b>{{ layout.resolution[0] }} x {{ layout.resolution[1] }}</b><br />
          Layout: <b>{{ layout.layout }}</b>
        </div><br />

        <div ref="previewPane" style="position: fixed;xbackground-color: pink;width:100%">

          Viewer width ({{ previewPaneWidth }}):
          <VBtn size="small" @click="setViewersRatio(0.5)">50/50</VBtn>
          <VBtn size="small" @click="setViewersRatio(0.3)">30/70</VBtn>





          <br /><br />

          <div style="display:flex;width:100%">
            <div :style="{ width: (this.viewersRatio * 100) + '%' }" style="padding:5px;overflow: hidden;">
              <h3>Preview</h3>

              <VBtn size="small" @click="setBackground('viewer1', '#000000')">black</VBtn>
              <VBtn size="small" @click="setBackground('viewer1', '#ffffff')">white</VBtn>
              <VBtn size="small" @click="setBackground('viewer1', '#ff0000')">red</VBtn>
              <VBtn size="small" @click="setBackground('viewer1', '#aaaaaa')">grey</VBtn>

              <button class="warning" @click="cls()">clear</button>
              <br />

              <div class="viewer" ref="viewer1">
                <iframe class="scaled-frame" scrolling:="no" :src="'https://www.chronorace.be'"></iframe>
              </div>

              <span>{{ GetTemplateServerUrlBase() }}</span>

            </div>
            <div :style="{ width: ((1 - this.viewersRatio) * 100) + '%' }" style="padding:5px;overflow: hidden">

              <h3>Main</h3>

              <VBtn size="small" @click="setBackground('viewer2', '#000000')">black</VBtn>
              <VBtn size="small" @click="setBackground('viewer2', '#ffffff')">white</VBtn>
              <VBtn size="small" @click="setBackground('viewer2', '#ff0000')">red</VBtn>
              <VBtn size="small" @click="setBackground('viewer2', '#aaaaaa')">grey</VBtn>

              <button class="warning" @click="cls()">clear</button>
              <br />

              <div class="viewer" ref="viewer2">
                <iframe style="position:relative;display: relative;" class="scaled-frame" scrolling:="no"
                :src="'https://www.chronorace.be'"></iframe>
              </div>

              <span>{{ GetTemplateServerUrlBase() }}</span>

            </div>
          </div>



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
import appSettingsService from '@/services/appSettingsService'

import { gsap } from "gsap";
import { getCurrentInstance, toHandlers } from 'vue';

export default {
  name: 'TestVue',
  data() {
    return {
      template: {},
      viewersRatio: 0.5,
      layoutName: null,
      layout: null,
      playlistName: null,
      playlist: null,
      loading: false,
      currentData: null,
      currentDefinition: null,
      selectedItem: null,
      previewPaneWidth: 0,
      templateServer: ''
    };
  },
  methods: {

    GetTemplateServerUrlBase() {
      var toRet = '';

      if (this.templateServer == null) {
        return "";
      }

      switch (this.templateServer) {
        case "online":
          toRet = "https://chronorace.blob.core.windows.net/webresources/cgtemplates/index.html#/";
          break;

        case "local":
          toRet = "https://localhost:8080/webresources/cgtemplates/index.html#/";
          break;

        default:
          if (this.templateServer.startsWith('http')) {
            toRet = this.templateServer;
          }
          else toRet = "https://" + this.templateServer + '/webresources/cgtemplates/index.html#/';
          break;
      }

      console.log("toRet=", toRet)


      return toRet;

    },


    GetRouteUrl() {
      var route = this.$router.resolve({ name: 'cgtest' });
      return route.href
    },

    //GetRouteUrl() {
    //return 'https://chronorace.blob.core.windows.net/webresources/cgtemplates/index.html#/wbd/default';
    //},

    LoadPlayList() {
      this.loading = false;
      console.log("load playlist ", this.layoutName, this.playlistName);

      templateService.getPlayList(this.layoutName, this.playlistName).then(playlist => {
        this.playlist = playlist;
      })

      templateService.get(this.layoutName).then(layout => {
        this.layout = layout;
        this.loading = false;
        this.resizeViewers();
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

    , setBackground(viewer, color) {
      gsap.set(this.$refs[viewer], { 'background-color': color });
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

    getElementWidth(element) {
      var cs = getComputedStyle(element);

      var paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);

      var borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
      return element.offsetWidth - paddingX - borderX;
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
        console.log("IFrame ", iframe, width, width * 9 / 16)

        gsap.set(viewer, { width: width, height: width / aspectRation });

        gsap.set(iframe, { scale: scale });
      })
    }

  },
  mounted: function () {

    this.templateServer = this.$route.query.ts;

    //    return this.$route.query;

    console.log("playlist mounted: ", this.$route.query);

    if (this.$route.query.env)
    {
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
  },
  beforeUnmount() {
    console.log("stop resize observer")
    this.resizeObserver.unobserve();
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
  border: solid 1px red;
  border-collapse: collapse;

}

.scaled-frame {
  width: 1920px;
  height: 1080px;
  border: 0px;
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