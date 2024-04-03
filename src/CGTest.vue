<template>
  <div style="position:absolute;top:0px;width:1920px;height:1080px;background-color: black;">
    <div style="position:absolute;width:100px;height:100px;left:0px;background-color: white;"></div>
    <div style="position:absolute;width:100px;height:100px;right:0px;background-color: yellow;"></div>
    <div style="position:absolute;width:100px;height:100px;bottom:0px;left:0px;background-color: red;"></div>
    <div style="position:absolute;width:100px;height:100px;bottom:0px;right:0px;background-color: blue;"></div>
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
body,html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: transparent;
  overflow: hidden;
  -webkit-font-smoothing: antialiased !important;
}

.wrap {
  padding: 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: black;
  border: solid 1px red;
  border-collapse: collapse;
}

</style>