<template>
    <div :class="['playlistitem'+item.type]">
        <UITools ref="ui">
            <template #select="{ item }">
                <VListItem :value="item">
                    <VListItemTitle v-text="item.title" />
                    <VListItemSubtitle v-text="item.template + ' / ' + item.layer" />
                </VListItem>
            </template>
        </UITools>

        <PlaylistItemEditorDialog ref="itemEditor">
        </PlaylistItemEditorDialog>

        <div style="display: flex;align-items: center;text-wrap: nowrap;">
            <div style="flex: 1;" class=" text-caption" @click="command('select')">
                <h3>{{ item.title }} </h3>
            </div>
            <div>
                <v-menu>
                    <template v-slot:activator="{ props }" :model="selected">
                        <v-btn size="x-small" variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
                    </template>

                    <v-list density="compact">
                        <v-list-item v-if="item.type == 'root' || item.type == 'folder'" value="folder">
                            <v-list-item-title @click="AddFolder()">Folder</v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="item.type == 'root' || item.type == 'folder'" value="scene">
                            <v-list-item-title @click="AddScene()">Scene</v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="item.type == 'scene'" value="scene">
                            <v-list-item-title @click="AddScene()">Action</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
            <div v-if="localData.template && !item.action">
                <button class="warning" @click="command('off')" href="#">-</button>
            </div>

        </div>

        <div v-if="item.scenes && item.scenes.length > 0" :style="{ display: collapsed ? 'none' : 'block' }"
            style="margin-left: 8px;margin-bottom: 16px;">
            <draggable :list="item.scenes" item-key="id">
                <template #item="{ element }">
                    <Component :is="'PlaylistItem'+getType(element)" @command="processCommand" :item="element" 
                        :data="localData" :layout="layout"
                        :playlist="playlist || item" />

                </template>
            </draggable>
        </div>
    </div>
</template>
<script>

import { toRaw } from "vue"
import draggable from 'vuedraggable'
import PlaylistItemEditorDialog from './PlaylistItemEditorDialog.vue'
import templateService from '@/services/templateService'

export default {
    name: "ScoreboardScene",
    data() {
        return {
            messages: [],
            localData: {},
            collapsed: false,
        };
    },
    props: ["item", "data", "layout", "playlist"],
    components: { draggable, PlaylistItemEditorDialog },
    methods:
    {
        GetRoot()
        {
            return this;
        },        

        DeletePlaylistItem(item)
        {
            console.log("delete clickqued");
            this.$refs["ui"].showMessage("Confirmation","Please confirm you want to delete the playlist item","OK,CANCEL").then(reply=>{
                console.log("delete reply ",reply)

                if (reply.key=='OK')  templateService.deletePlayListItemById(this.playlist||this.item,item.id);

            })
            
        },

        getType(element)
        {
            console.log("gettype",element)
            switch (element.type)
            {
                case "folder":
                    return "Folder";

                default:
                    return "Scene";
            }
        },
        EditScene() {
            console.log("EDIT SCENE ", this.item.type);
            switch (this.item.type) {
                case "scene":
                case "action":
                    console.log("layout ", this.layout)
                    this.$refs["itemEditor"].Edit(this.item, this.layout).then(reply => {
                        console.log("itemeditor reply=", reply)
                        if (reply.key == 'OK') {
                            this.item.title = reply.item.title;
                            this.item.data = reply.item.data;
                        }
                    });

                default:
                    break;
            }

        },
        AddFolder() {
            console.log("Add folder");
            this.$refs["ui"].editText("Create folder", "Folder name", "Name").then(reply => {
                console.log("add folder reply", reply)

                if (reply.key == 'OK') {
                    var toAdd = { type: "folder", "title": reply.data, scenes:[] }

                    var playlist = this.playlist;
                    if (!playlist) playlist = this.item;

                    toAdd.id = ++playlist.maxid;
                    this.item.scenes.push(toAdd)
                    this.collapsed = false

                }
            })
        },
        AddScene() {
            console.log("add scene");

            this.$refs["ui"].select("Add scene", "Select scene to add", this.layout.scenes).then(reply => {
                console.log("reply ", reply)

                var toAdd = { "type": "scene", "title": reply.item.title, data: null, layer: reply.item.layer, template: reply.item.template, layoutkey: reply.item.key };
                console.log("Add ", toAdd)

                if (!this.item.scenes) this.item.scenes = []

                var playlist = this.playlist;
                if (!playlist) playlist = this.item;

                toAdd.id = ++playlist.maxid;
                this.item.scenes.push(toAdd)
                this.collapsed = false

            })
        },
        select() {

        },
        processCommand(cmd) {
            //console.log('process command ',cmd)
            this.$emit("command", cmd)
        },
        command(action) {
            this.$emit("command", { action: action, item: this.item })
            /* if (action == 'off') {
                 this.$emit("command", {
                     page: this.localData.template,
                     action: action, data: null, layer: this.localData.layer
                 });
             } else {
                 this.$emit("command", {
                     page: this.localData.template,
                     action: action, data: this.localData, layer: this.localData.layer
                 });
             }*/
        }
    },
    created: function () {
    },
    mounted: function () {
        //console.log("scoreboard scene ", this.item.title  )
    },

};
</script>

<style scoped>
.playlistitem {}

.playlistitemscene
{
    border-left: solid 4px #ccc;
        margin-bottom: 4px;
        padding-left: 4px
}

.playlistitemfolder
{
}

.playlistitem:hover {
    background-color: #dddddd;
}
</style>