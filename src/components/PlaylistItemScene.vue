<template>
    <div style="margin-bottom: 4px;">
        <UITools ref="ui">
            <template #select="{ item }">
                <VListItem :value="item">
                    <VListItemTitle v-text="item.title" />
                    <VListItemSubtitle  v-text="item.template + ' / ' + item.layer" />
                </VListItem>
            </template>
        </UITools>

        <PlaylistItemEditorDialog ref="itemEditor">
        </PlaylistItemEditorDialog>

        <div style="display: flex;align-items: center;text-wrap: nowrap;">
            <VBtn style="margin-left:-16px" color="blue" variant="text" :icon="!collapsed ? 'mdi-minus' : 'mdi-plus'"
                size="x-small" @click.stop="collapsed = !collapsed" v-if="item.scenes && item.scenes.length > 0">
            </VBtn>

            <div   @click.stop="command('select')" :class="['playlistitem' + item.type]" class="playlistitem" style="display: flex;flex:1;align-items: center;text-wrap: nowrap;">
                <div  style="flex: 1;" class="text-caption"
                   >
                    {{ item.title }}
                    <div class="playlistitem-hover"><small>{{ item.template }} / {{ item.layer }}</small></div>

                </div>

                <div >
                    
                    <VBtn xclass="playlistitem-hover" :icon="'mdi-pencil'" size="x-small" variant="text" @click.stop="EditScene()"></VBtn>
                
                    <v-menu >
                        <template v-slot:activator="{ props }" :model="selected">
                            <v-btn  size="x-small" variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
                        </template>

                        <v-list density="compact">
                            <VListSubheader v-if="scene.actions && scene.actions.length > 0">Actions</VListSubheader>
                            <v-list-item v-if="scene.actions" v-for="action in scene.actions" :value="action.key">
                                <v-list-item-title @click.stop="AddAction(action)">{{ action.title }}</v-list-item-title>
                            </v-list-item>
                            <VDivider v-if="scene.actions && scene.actions.length > 0"></VDivider>
                            <v-list-item value="scenedelete">
                                <v-list-item-title @click.stop="Delete()">Delete</v-list-item-title>
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

                <div v-if="item.template && !item.action">
                    <VBtn color="warning" icon="mdi-minus" xvariant="text" size="x-small" style="min-width: 0px;"
                        @click.stop="command('off')">                        
                    </VBtn>
                </div>

            </div>
        </div>

        <div v-if="item.scenes && item.scenes.length > 0" :style="{ display: collapsed ? 'none' : 'block' }"
            style="margin-left: 16px;margin-bottom: 16px;">
            <draggable :list="item.scenes" item-key="id">
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
        };
    },
    props: ["item", "data", "layout", "playlist"],
    components: { draggable, PlaylistItemEditorDialog },
    computed:
    {
        scene: function () {
            if (this.item == null || this.layout == null) return null;
            return this.layout.sortedscenes[this.item.layoutkey]
        }
    },
    methods:
    {
        GetRoot() {
            console.log("scene parent ", this.$parent)
            return this.$parent.$parent.GetRoot();
        },

        Delete() {
            this.GetRoot().DeletePlaylistItem(this.item);
        },

        getType(element) {
            //console.log("gettype", element)
            switch (element.type) {
                case "folder":
                    return "Folder";

                case "action":
                    return "Action";

                default:
                    return "Scene";
            }
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
                            
                        });
                        return;

                    default:
                        break;
                }

                reject();
            })
        },



        AddAction() {
            this.$refs["ui"].select("Add scene", "Select scene to add", this.layout.scenes).then(reply => {
                if (reply.action!='select') return;

                var toAdd = { "type": "action", "title": action.title, data: null, "action": action.action, layoutkey: action.key };
                console.log("Add and edit ", toAdd)
                
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

        select() {

        },
        processCommand(cmd) {
            //console.log('process command ',cmd)
            this.$emit("command", cmd)
        },
        command(action) {
            if (this.item.data==null)
            {
                this.EditScene();
                return;
            }
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

.playlistitem-hover
{
    display:none
}

.playlistitem:hover .playlistitem-hover
{
    display: block;
}

.playlistitemscene {
    border-left: solid 4px #2196F3;
    xmargin-bottom: 4px;
    padding-left: 4px
}

.playlistitemfolder {}

.playlistitem:hover {
    background-color: #dddddd;
}
</style>