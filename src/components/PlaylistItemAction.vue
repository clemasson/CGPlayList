<template>
    <div :class="[ 'playlistitem'+item.type]">
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
            <VBtn color="blue" variant="text" :icon="!collapsed ? 'mdi-minus' : 'mdi-plus'" size="x-small"
                @click="collapsed = !collapsed" v-if="item.scenes && item.scenes.length > 0">
            </VBtn>

            <div class="playlistitem" style="display: flex;flex:1;align-items: center;text-wrap: nowrap;">
                <div style="flex: 1;" class="playlistitem text-caption" @click="command('select')">
                    {{ item.title }}
                    <div class="playlistitem-hover"><small>{{ item.action }}</small></div>

                </div>
                <div class="xplaylistitem-hover">
                    <VBtn :icon="'mdi-pencil'" size="x-small" variant="text" @click="EditScene()"></VBtn>
                    <v-menu>
                        <template v-slot:activator="{ props }" :model="selected">
                            <v-btn size="x-small" variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
                        </template>

                        <v-list density="compact">
                            <v-list-item value="scenedelete">
                                <v-list-item-title @click="Delete()">Delete</v-list-item-title>
                            </v-list-item>

                        </v-list>
                    </v-menu>
                </div>
            </div>

        </div>

        <div v-if="item.scenes && item.scenes.length > 0" :style="{ display: collapsed ? 'none' : 'block' }"
            style="margin-left: 38px;margin-bottom: 16px;">
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
    methods:
    {
        GetRoot()
        {
            return this.$parent.$parent.GetRoot();
        },

        Delete()
        {
            this.GetRoot().DeletePlaylistItem(this.item);            
        },

        getType(element) {
            //console.log("gettype", element)
            switch (element.type) {
                case "folder":
                    return "Folder";

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

.playlistitem-hover
{
    display:none
}

.playlistitem:hover .playlistitem-hover
{
    display: block;
}

.playlistitemscene {
    border-left: solid 4px #ccc;
    xmargin-bottom: 4px;
    padding-left: 4px
}


.playlistitem:hover {
    background-color: #dddddd;
}
</style>