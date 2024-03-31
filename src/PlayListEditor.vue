<template>
  <div>
    <div style="display:flex;width:100%;">
      <div style="flex:1;max-width: 500px;min-width: 300px;background-color: aqua">

        <v-list lines="two">
          <v-list-subheader inset>Available scenes</v-list-subheader>

          <v-list-item v-for="(scene,idx) in layout.scenes" :key="idx" :subtitle="scene.template+' / '+scene.layer" :title="scene.title">
            <template v-slot:prepend>
              <v-avatar color="grey-lighten-1">
                <v-icon color="white">mdi-folder</v-icon>
              </v-avatar>
            </template>

            <template v-slot:append>
              <v-btn color="grey-lighten-1" icon="mdi-information" variant="text"></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <PlaylistItem v-if="playlist" @command="processCommand" :layout="layout" :item="playlist">
        </PlaylistItem>

        <hr>
        <div v-if="playlist">
          <h3>{{ playlist.name }}</h3>
        </div>

        <pre>
          {{ layout }}
        </pre>


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

export default {
  name: 'TestVue',
  data() {
    return {
      template: {},
      layoutName: null,
      layout: null,
      playlistName: null,
      playlist: null,
      loading: false
    };
  },
  methods: {

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

    processCommand(command) {
      console.log("process command", command)

      setTimeout(() => {
        //this.command(command.page, command.action, command.data, command.layer)
      }, 0);
    },

    ChangeOccured(definition, value) {
      console.log("change occured", value)
      this.obj = value
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
  },
  mounted: function () {
    console.log("mounted: ", this.$route.params);
    this.layoutName = this.$route.params.layout;
    this.playlistName = this.$route.params.playlist;
    this.LoadPlayList();
  }
};
</script>
