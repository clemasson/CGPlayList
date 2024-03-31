<template>
    <div>
        <UITools ref="ui">
            <template #select="{item}" >
                <VListItem :value="item">
                    <VListItemTitle v-text="item.title"  />
                    
                    <VListItemSubtitle v-text="item.template+' / '+item.layer"  />
                </VListItem>                
            </template>
        </UITools>

        <div style="display: flex;align-items: center;">
            <button @click="collapsed = !collapsed" style="xmargin:0px;width:30px"
                v-if="item.scenes && item.scenes.length > 0">
                {{ collapsed ? '+' : '-' }}
            </button>
            <div style="flex: 1;">
                <button class="primary" v-if="localData.template" @click="command(item.action)" href="#">{{
                    item.title }}</button>
                <span v-else>{{ item.title }}</span>
            </div>
            <div>
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn size="x-small" icon="mdi-dots-vertical" v-bind="props"></v-btn>
                    </template>

                    <v-list>
                        <v-list-item>
                            <v-list-item-title>Folder</v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title @click="AddScene()">Scene</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
            <div v-if="localData.template && !item.action">
                <button class="warning" @click="command('off')" href="#">-</button>
            </div>

        </div>

        <div v-if="item.scenes && item.scenes.length > 0" :style="{ display: collapsed ? 'none' : 'block' }"
            style="margin-left: 38px;margin-bottom: 16px;">
            <ScoreboardScene @command="processCommand" :item="scene" :data="localData" v-for="(scene, i) in item.scenes"
                :key="i">
            </ScoreboardScene>
        </div>
    </div>
</template>
<script>

import { toRaw } from "vue"

export default {
    name: "ScoreboardScene",
    data() {
        return {
            messages: [],
            scenes: {},
            localData: {},
            collapsed: true,
        };
    },
    props: ["item", "data","layout"],
    methods:
    {
        AddScene()
        {
            console.log("add scene");

            this.$refs["ui"].select("Add scene","Select scene to add",this.layout.scenes).then(reply=>{
                console.log("reply ",reply)
            })
        },
        processCommand(cmd) {
            //console.log('process command ',cmd)
            this.$emit("command", cmd)
        },
        command(action) {
            if (action == 'off') {
                this.$emit("command", {
                    page: this.localData.template,
                    action: action, data: null, layer: this.localData.layer
                });
            } else {
                this.$emit("command", {
                    page: this.localData.template,
                    action: action, data: this.localData, layer: this.localData.layer
                });
            }
        }
    },
    created: function () {
        this.localData = Object.assign({}, toRaw(this.data), toRaw(this.item.data))
        if (this.item.template) this.localData.template = this.item.template
        if (this.item.layer) this.localData.layer = this.item.layer
    },
    mounted: function () {
        //console.log("scoreboard scene ", this.item.title  )
    },

};
</script>

<style></style>