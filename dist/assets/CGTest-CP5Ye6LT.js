import{_ as l,t as i,c as a,o as r,d as s}from"./index-CqTxoDZw.js";import{g as o}from"./index-ZORhgBxb.js";const n={name:"TestVue",data(){return{template:{},layoutName:null,layout:null,playlistName:null,playlist:null,loading:!1,currentData:null,currentDefinition:null,selectedItem:null,previewPaneWidth:0}},methods:{GetRouteUrl(){return"https://chronorace.blob.core.windows.net/webresources/cgtemplates/index.html#/wbd/default"},LoadPlayList(){this.loading=!1,console.log("load playlist ",this.layoutName,this.playlistName),i.getPlayList(this.layoutName,this.playlistName).then(e=>{this.playlist=e}),i.get(this.layoutName).then(e=>{this.layout=e,this.loading=!1})},GetQueryParameters(){return this.$route.query},processCommand(e){console.log("process command",e),e.item,setTimeout(()=>{},0)},ObjectChanged(e,t){console.log("change occured",t),this.selectedItem!=null&&(this.selectedItem.data=t)},OpenObjectEditor(){var e=this.$refs.objEditor;console.log("ok? ",e),e.Edit(this.obj,this.definition,"Hello").then(t=>{console.log("object editor reply: ",t),t.key=="OK"&&(this.obj=t.data)})},GetTemplate(){i.get("WBD").then(e=>{this.template=e,console.log("resolution of template: ",this.template)})},setBackground(e){o.set(this.$refs.viewer,{"background-color":e})},setViewerSize(e){console.log("set viewer size: "),o.set(this.$refs.viewer,{width:e,height:e*9/16}),o.set(this.$refs.frame,{scale:e/1920})},setViewerSizeTest(e){console.log("set viewer size: "),o.set(this.$refs.viewer,{width:e,height:e*9/16}),o.set(this.$refs.frame,{scale:e/1920})}},mounted:function(){console.log("mounted: ",this.$route.params),this.layoutName=this.$route.params.layout,this.playlistName=this.$route.params.playlist,this.LoadPlayList()},beforeUnmount(){console.log("stop resize observer"),this.resizeObserver.unobserve()},created:function(){}},h={style:{position:"absolute",top:"0px",width:"1920px",height:"1080px","background-color":"black"}},c=s("div",{style:{position:"absolute",width:"100px",height:"100px",left:"0px","background-color":"white"}},null,-1),d=s("div",{style:{position:"absolute",width:"100px",height:"100px",right:"0px","background-color":"yellow"}},null,-1),u=s("div",{style:{position:"absolute",width:"100px",height:"100px",bottom:"0px",left:"0px","background-color":"red"}},null,-1),p=s("div",{style:{position:"absolute",width:"100px",height:"100px",bottom:"0px",right:"0px","background-color":"blue"}},null,-1),m=[c,d,u,p];function g(e,t,b,f,y,w){return r(),a("div",h,m)}const v=l(n,[["render",g]]);export{v as default};