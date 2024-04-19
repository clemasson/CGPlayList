<template>
    <div>
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

            <VBtn style="margin-left:-16px" color="blue" variant="text"
                :icon="!collapsed ? 'mdi-folder-open' : 'mdi-folder'" size="x-small" @click="collapsed = !collapsed"
                v-if="item.scenes && item.scenes.length > 0">
            </VBtn>

            <div :class="['playlistitem' + item.type]" class="playlistitem"
                style="display: flex;flex:1;align-items: center;text-wrap: nowrap;">
                <div :class="['playlistitem' + item.type]" style="flex: 1;" class="text-caption"
                    @click="collapsed = !collapsed">
                    {{ item.title }}
                </div>
                <div>
                    <VBtn :icon="'mdi-pencil'" size="x-small" variant="text" @click="Edit()"></VBtn>
                    <v-menu>
                        <template v-slot:activator="{ props }" :model="selected">
                            <v-btn size="x-small" variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
                        </template>

                        <v-list density="compact">
                            <v-list-item value="folder">
                                <v-list-item-title @click="AddFolder()">Folder</v-list-item-title>
                            </v-list-item>
                            <v-list-item value="scene">
                                <v-list-item-title @click="AddScene()">Scene</v-list-item-title>
                            </v-list-item>
                            <VDivider></VDivider>
                            <v-list-item value="scenedelete">
                                <v-list-item-title @click="Delete()">Delete</v-list-item-title>
                            </v-list-item>
                            <VDivider></VDivider>
                            <v-list-item value="export">
                                <v-list-item-title @click="GetRoot().Export(item)">Export</v-list-item-title>
                            </v-list-item>
                            <v-list-item value="import">
                                <v-list-item-title @click="GetRoot().Import(item)">Import</v-list-item-title>
                            </v-list-item>

                        </v-list>
                    </v-menu>
                </div>
                <div v-if="localData.template && !item.action">
                    <button class="warning" @click="command('off')" href="#">-</button>
                </div>
            </div>
        </div>

        <div v-if="item.scenes && item.scenes.length > 0" :style="{ display: collapsed ? 'none' : 'block' }"
            style="margin-left: 16px;margin-bottom: 16px">
            <draggable :list="item.scenes" item-key="id" 
            :group="{ 'name':'playlist',pull:pullFunction,put:putFunction }"
            @add="add"
            @end="end" @start="start" :clone="clone">
                <template #item="{ element }">
                    <Component :is="'PlaylistItem'+getType(element)" @command="processCommand" :item="element"
                        :data="localData" :layout="layout" :playlist="playlist || item" />


                </template>
            </draggable>
        </div>
    </div>
</template>
<script>

import { toRaw } from "vue"
import draggable from 'vuedraggable'
import PlaylistItemEditorDialog from './PlaylistItemEditorDialog.vue'

export default {
    name: "ScoreboardScene",
    data() {
        return {
            messages: [],
            localData: {},
            collapsed: true,
            controlOnStart:false
        };
    },
    props: ["item", "data", "layout", "playlist"],
    components: { draggable, PlaylistItemEditorDialog },
    methods:
    {
        GetRoot() {
            return this.$parent.$parent.GetRoot();
        },

        Delete() {
            this.GetRoot().DeletePlaylistItem(this.item);
        },

        getType(element) {
            switch (element.type) {
                case "folder":
                    return "Folder";

                default:
                    return "Scene";
            }
        },

        Edit() {

            this.$refs["ui"].editText("Rename folder", "Folder name", "Name", this.item.title).then(reply => {
                console.log("add folder reply", reply)

                if (reply.key == 'OK') {
                    this.item.title = reply.data
                }
            });
        },

        AddFolder() {

            this.$refs["ui"].editText("Create folder", "Folder name", "Name").then(reply => {
                console.log("add folder reply", reply)

                if (reply.key == 'OK') {
                    var toAdd = { type: "folder", "title": reply.data, scenes: [] }

                    var playlist = this.playlist;
                    if (!playlist) playlist = this.item;

                    toAdd.id = ++playlist.maxid;
                    this.item.scenes.push(toAdd)
                    this.collapsed = false

                }
            })
        },

        EditScene(item) {
            if (!item) item=this.item

            return new Promise((resolve,reject)=>{
                //console.log("EDIT SCENE ", item.type);
                switch (item.type) {
                    case "scene":
                    case "action":
                        //console.log("layout ", this.layout,this.$refs["itemEditor"])
                        this.$refs["itemEditor"].Edit(item, this.layout).then(reply => {
                            console.log("itemeditor reply=", reply)
                            if (reply.key == 'OK') {
                                item.title = reply.item.title;
                                item.data = reply.item.data;
                                resolve(item);
                                return;
                            }
                            reject(); 
                        });
                        return;

                    default:
                        break;
                }

                reject();
            })
        },

        AddScene() {
            this.$refs["ui"].select("Add scene", "Select scene to add", this.layout.scenes).then(reply => {
                if (reply.action!='select') return;

                var toAdd = { "type": "scene", "title": reply.item.title, data: null, layer: reply.item.layer, template: reply.item.template, layoutkey: reply.item.key };
                console.log("Add AND edit ", toAdd)
                
                if (!this.item.scenes) this.item.scenes = []

                var playlist = this.playlist;
                if (!playlist) playlist = this.item;

                this.EditScene(toAdd).then(editReply=>
                {
                    console.log("edit reply",editReply)

                    toAdd.id = ++playlist.maxid;
                    this.item.scenes.push(toAdd)                    
                    this.collapsed = false

                })
            })
        },

        add(evt)
        {
            console.log("add called ",evt)
        },
        start(evt)
        {            
            console.log("start ",evt);
            //this.controlOnStart = originalEvent.ctrlKey;
        },
        end(evt)
        {            
            console.log("end ",evt);
            
        },
        clone(el)
        {

            console.log("clone called ",el)

            return el
        },
        pullFunction(e)
        {
            console.log("pull function called",e)
        },
        putFunction(e)
        {
            console.log("put function called",e)
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

.xplaylistitemfolder {
    border-left: solid 4px rgb(0, 43, 128);
    margin-bottom: 4px;

    padding-left: 4px
}

.playlistitemfolder {}

.playlistitem:hover {
    background-color: #dddddd;
}
</style>