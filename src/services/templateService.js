import axios from 'axios'
import appSettingsService from './appSettingsService'

/***!SECTION
 * 
Field:
-----------
field,name,help|type,args|defaultvalue|validators
	- type: text|array|object|dropdown|boolean

- object:   object,definition
- dropdown: dropdown,v1,v2,v3
- boolean: boolean,trueval,falseval

if field starts with *, will copy reference to an other defintiion

Scene:
-----------
template[:key],[layer],[definition],[title]|actions

Action:
-----------
action[:key],[definition],[title]  // default definition: template.action


 * 
 * 
 */


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/*var templateDefinition = {
    "layout": "WBD",
    "resolution": [1920, 1080],

    "scenes":
        [
            "watermark,wat,,C2.1 - Watermark",
            "background,bg,,C2.60 - Still",
            "backgroundvideo,bg,,C2.61 - Video",
            "name,,,C2.1 lower third 1 line|showspeed|hidespeed",
            "name,,,C2.2 lower2 lines|showspeed|hidespeed",
            "dualname,default,,2 Names"
        ],
    "definitions":
    {
        "watermark": ["logo,Logo|dropdown,xco,xcc,dhi|Watermark picture"],
        "background": ["image,Image,Background image|text"],
        "backgroundvideo": ["video,ImageFileName,Video file name (empty use default video)|text"],
        "name": ["name|text", "team|text", "nat|text"],
        "name.showspeed": ["speed|text"],
        "dualname": ["*mode", "name1,,Left rider|*name", "name2,,Right rider|*name"],
        "mode": ["mode|dropdown,red,green"]
    }
}*/

var wbdDefinition = {
    "layout": "WBD",
    "resolution": [2288, 1144],

    "scenes": [],
    "definitions":
    {

    }
}

/*channel: 
- direct
- websocket:10.19.4.10:9991  (websocket:host[:port]) 
- api:10.19.4.10:9951  (ui en mode websocket)
- pusher:channel (*/


var playList = {
    "layout": "wbd",
    "title": "A test playlist",
    "type": "folder",
    "id": 1,
    "maxid": 1,
    "scenes": []
}

const templateService = new (class {

    // cg template server
    GetTemplateServerUrlBase(ts) {
        var toRet = '';

        if (!ts) {
            return "";
        }

        switch (ts) {
            case "online":
            case "remote":
                toRet = "https://chronorace.blob.core.windows.net/webresources/cgtemplates/index.html#/";
                break;

            case "local":
                toRet = "http://localhost:8080/webresources/cgtemplates/index.html#/";
                break;

            default:
                if (ts.startsWith('http')) {
                    toRet = ts
                }
                else toRet = "http://" + ts + '/webresources/cgtemplates/index.html#/';
                break;
        }
        return toRet;
    }

    parseChannel(strChannel, defChannel, name) {
        if (!defChannel) defChannel = "default";

        // channel: 
        // - direct
        // - websocket:10.19.4.10:9991  (websocket:host[:port]) 
        // - api:10.19.4.10:9951  (ui en mode websocket)
        // - pusher:channel (

        var toRet = {
            "mode": 'direct',
            "name": name,
            "host": "localhost",
            "port": 9951,
            "channel": "default",
            "state": {}
        };

        if (strChannel == null) return toRet

        var tokens = strChannel.split(':')
        toRet.mode = tokens[0];
        var channel = null;
        var host = null;
        var port = null;
        var wsport=null;

        if (!toRet.mode || toRet.mode == '') toRet.mode = 'direct';
        if (toRet.mode == 'websocket') toRet.mode = 'ws';

        
        console.log("PARSE CHANNEL: ",tokens);



        switch (toRet.mode) {
            case "direct":
            case "pusher":
                channel = tokens.length > 1 ? tokens[1] : '';
                if (!channel || channel == '') channel = defChannel
                break;

            case "ws":
                host = tokens.length > 1 ? tokens[1] : '';
                if (!host || host == '') host = 'localhost';
                port = tokens.length > 2 ? tokens[2] : '';
                if ((!port || port == '') && toRet.mode == 'api') port = '9751';
                if ((!port || port == '') && toRet.mode == 'ws') port = '9991';
                break;

            case "api":
                host = tokens.length > 1 ? tokens[1] : '';
                if (!host || host == '') host = 'localhost';
                port = tokens.length > 2 ? tokens[2] : '';
                wsport = tokens.length > 3 ? tokens[3] : '';
                toRet.wsport = tokens.length > 2 ? tokens[2] : '';
                if (!port || port == '') port = '9951';
                if (!wsport || wsport == '') wsport = port;
                break;


            default:
                channel = toRet.mode;
                toRet.mode = 'pusher';
                break;
        }

        toRet.channel = channel;
        toRet.host = host;
        toRet.port = port;
        toRet.wsport = wsport;

        toRet.title = toRet.mode;
        switch (toRet.mode) {
            case "pusher":
            case "ws":
                toRet.title =  toRet.mode+ " / " + toRet.channel+(toRet.port?':'+toRet.port:'')
                break;

            case "api":
                toRet.title =  toRet.mode+ " / " + toRet.host+(toRet.port?':'+toRet.port:'')+(toRet.wsport?':'+toRet.wsport:'')
                break;


            default:
                toRet.title='direct'
                break;
        }



        console.log("parseChannel=", strChannel,toRet)

        return toRet;
    }

    buildUrl(ts, layout, channel) {
        var toRet = this.GetTemplateServerUrlBase(ts);
        toRet = toRet + layout.layout + '/';

        switch (channel.mode) {
            case "api":
                toRet = toRet + 'ws?host=' + channel.host + ':' + channel.wsport + '&'
                break;

            case "ws":
                toRet = toRet + 'ws?host=' + channel.host + ':' + channel.port + '&'
                break;

            default:
                toRet = toRet + channel.channel + '?';
                break;
        }

        toRet = toRet + "w=" + layout.resolution[0] + "&h=" + layout.resolution[1]
        //console.log("build url with resolution: ",layout.resolution)

        return toRet
    }



    isString(variable) {
        return typeof variable === "string";
    }

    convertField(template, definition, toConvert) {
        //console.log("convertField ",toConvert)
        // Function to test if variable is a string
        if (this.isString(toConvert)) {

            var tokens = toConvert.split('|');

            // maybe a reference to an other definition
            if (tokens[0].startsWith("*")) {
                // reference to an other definition
                var relatedDefinition = this.convertDefinition(template, template.definitions[tokens[0].substring(1)])
                relatedDefinition.forEach(d => definition.push(d))

                console.log("add a definition reference", definition, relatedDefinition)
            }
            else {
                // syntax: field,name,help|type,args|defaultvalue|validators
                // type: can be a reference is prefixed with *
                var fieldNameTokens = tokens[0].split(',');


                var field = fieldNameTokens[0];
                var name = fieldNameTokens.length > 0 && fieldNameTokens[1] != '' ? fieldNameTokens[1] : field;
                var description = fieldNameTokens.length > 2 ? fieldNameTokens[2] : null;

                var toAdd = {
                    field: field, name: name, description: description
                }
                
                //console.log("field name",field,name,description)                
                if (tokens.length>2)
                {
                    toAdd.default=tokens[2]
                    if (toAdd.default=='') toAdd.default=null;
                }

                var typeToken=(tokens.length > 1 ? tokens[1] : 'text');
                if (typeToken=='') typeToken='text'

                var typeTokens = typeToken.split(',');
                
                var type = typeTokens[0];
                typeTokens.splice(0, 1)
                if (type.startsWith("*")) {
                    typeTokens = [type.substring(1)]
                    type = 'object';

                }

                toAdd.type = type;

                switch (type.toLowerCase()) {
                    case "dropdown":
                        toAdd.dataset = typeTokens;
                        break;

                    case "array":
                        toAdd.childs = [];

                        if (typeTokens.length > 0) {
                            toAdd.childs = this.convertDefinition(template, typeTokens[0]);
                        }
                        if (typeTokens.length > 1) {
                            toAdd.title = typeTokens[1];
                        } else if (toAdd.childs && toAdd.childs.length>0)
                        {
                            toAdd.title=toAdd.childs[0].field
                        }
                        break;

                    case "boolean":
                        if (typeTokens.length>0)
                        {
                            toAdd.true=typeTokens[0]
                        }
                        if (typeTokens.length>1)
                        {
                            toAdd.false=typeTokens[1]
                        }
                        break;

                    case "object":
                        toAdd.childs = [];

                        if (typeTokens.length > 0) {
                            toAdd.childs = this.convertDefinition(template, typeTokens[0]);
                        }
                        break;
                }

                definition.push(toAdd)

            }
        }
        else if (Array.isArray(toConvert)) {

        }
        else definition.push(toConvert);
    }

    convertDefinition(template, toConvert) {
        var toRet = [];
        if (toConvert == null) return toRet;

        if (Array.isArray(toConvert)) {
            //console.log("array conversion: ", toConvert)

            toConvert.forEach(field => {

                this.convertField(template, toRet, field)
            })
        }
        else {
            //console.log("direct reference: ", template, toConvert)
            return this.convertDefinition(template, template.definitions[toConvert]);
        }

        return toRet;
    }

    convertAction(template, scene, action) {

        if (this.isString(action)) {
            //actions: action[:key],[definition],[title]  // default definition: template.action
            var tokens = action.split(',');

            var actionTokens = tokens[0].split(':');
            var action = actionTokens[0];
            var actionKey = actionTokens.length > 1 ? actionTokens[1] : action;
            if (actionKey == '') actionKey = action;
            actionKey = scene.key + '.' + actionKey

            var definition = (tokens.length > 1 ? tokens[1] : "");
            if (definition == '') definition = scene.template + '.' + action;

            var title = tokens.length > 2 ? tokens[2] : '';
            if (title == '') title = action;

            action = { "key": actionKey, "action": action, "title": title, "definition": definition }
        }

        action.definition = this.convertDefinition(template, action.definition);



        return action;
    }

    processScene(template, scene) {
        var toRet = scene;

        if (this.isString(scene)) {
            // template[:key],[layer],[definition],[title]|actions
            // actions: name,[definition],[title]  // default definition: template.action
            var tokens = scene.split('|');
            var sceneTokens = tokens[0].split(',');
            var templateNameTokens = sceneTokens[0].split(':');
            var templateName = templateNameTokens[0];
            var key = templateNameTokens.length > 1 ? templateNameTokens[1] : templateName;

            console.log("Template: ",templateName,key)

            var layer = sceneTokens.length > 1 ? sceneTokens[1] : 'default';
            if (layer == '') layer = 'default';
            var definition = sceneTokens.length > 2 ? sceneTokens[2] : key;
            if (definition == "") definition = key;
            var title = sceneTokens.length > 3 ? sceneTokens[3] : null;
            toRet = { "key": key, "template": templateName, "layer": layer, "definition": definition, "title": title }

            tokens.splice(0, 1);
            if (tokens.length > 0) {
                //console.log("ACTION ACTIONS ACTIONS ", tokens)
                toRet.actions = tokens;
            }
        }

        //console.log("convert scene", toRet);
        toRet.definition = this.convertDefinition(template, toRet.definition);

        if (!toRet.actions) toRet.actions = [];

        var actions = toRet.actions;
        toRet.actions = [];

        actions.forEach(action => {
            var toAdd = this.convertAction(template, toRet, action);
            if (toAdd) toRet.actions.push(toAdd);
        });

        return toRet;
    }

    processTemplateDefinition(template) {
        var toRet = JSON.parse(JSON.stringify(template));

        var scenes = template.scenes;
        toRet.scenes = [];

        scenes.forEach(scene => {
            var toAdd = this.processScene(template, scene);
            toRet.scenes.push(toAdd);
        })

        toRet.converted = true;

        toRet.sortedscenes = {};

        toRet.scenes.forEach(scene => {
            toRet.sortedscenes[scene.key] = scene;
            if (scene.actions) {
                scene.actions.forEach(action => {
                    toRet.sortedscenes[action.key] = action;
                })
            }
        })

        delete toRet["definitions"]

        return toRet;
    }

    setUrlBase(url) {
        if (url == null) {
            this.apiUrlBase = null;
            return;
        }

        switch (url) {
            case "local":
                url = "/api/graphics/casper/";
                break;

            case "dev":
                url = "http://localhost:9011/api/graphics/casper/";
                break;

            case "worker":
                url = "http://crworker.cloudapp.net:9011/api/graphics/casper/";
                break;

        }

        this.apiUrlBase = url;
    }

    getUrlBase() {
        if (this.apiUrlBase) return this.apiUrlBase;
        return appSettingsService.get("apiUrlBase") + 'graphics/casper/';
    }

    savePlayList(layout, name, playlist) {
        var url = this.getUrlBase() + "playlist/" + layout + "/" + name;

        console.log("templateApiUrlBase=", url)

        return new Promise((resolve, reject) => {
            console.log("url= " + url);
            axios
                .post(url, playlist)
                .then((httpReply) => {
                    resolve(httpReply.data)
                })
                .catch((error) => {
                    if (error.response) {
                        reject({ errorMessage: 'HTTP_' + error.response.status })
                    } else {
                        reject(error)
                    }
                })
        });
    }

    getPlayList(layout, name) {
        var url = this.getUrlBase() + "playlist/" + layout + "/" + name;

        console.log("templateApiUrlBase=", url)

        return new Promise((resolve, reject) => {
            console.log("url= " + url);
            axios
                .get(url)
                .then((httpReply) => {

                    console.log("GetPlayList reply = ", httpReply.data)
                    if (httpReply.data == null) {
                        resolve({
                            "layout": layout,
                            "title": name,
                            "type": "folder",
                            "id": 1,
                            "version": 1,
                            "maxid": 1,
                            "scenes": []
                        })
                    }
                    else resolve(httpReply.data)
                })
                .catch((error) => {
                    if (error.response) {
                        reject({ errorMessage: 'HTTP_' + error.response.status })
                    } else {
                        reject(error)
                    }
                })
        });
    }

    deletePlayListItemByIdInternal(playlist, item, id) {
        if (item.scenes == null) return false;
        var i = 0;
        while (i < item.scenes.length) {
            if (item.scenes[i].id == id) {
                item.scenes.splice(i, 1);
                return true;
            }
            if (this.deletePlayListItemByIdInternal(playlist, item.scenes[i], id)) return true;
            i++;
        }
        return false
    }

    deletePlayListItemById(playlist, id) {
        if (this.deletePlayListItemByIdInternal(playlist, playlist, id)) {
            playlist.dirty = true
        }

        return playlist
    }

    getLayoutDefinition(layout) {
        var toRet = new Promise((resolve, reject) => {
            const url = 'data/' + layout + '.json?rnd=' + getRandomInt(100000000);

            axios
                .get(url)
                .then((httpReply) => {

                    console.log("http reply ", httpReply)
                    resolve(this.processTemplateDefinition(httpReply.data))
                })
                .catch((error) => {
                    if (error.response) {
                        reject({ errorMessage: 'HTTP_' + error.response.status })
                    } else {
                        reject(error)
                    }
                })
        })

        return toRet

        /*var toRet = this.processTemplateDefinition(templateDefinition);

        console.log("URL base ", this.apiUrlBase)

        return Promise.resolve(toRet);*/
    }

    command(channel,command,layer,page,action,data)
    {
        if (!data) data={}

        data=JSON.parse(JSON.stringify(data))

        data.layer=layer;
        data.action=action;
        data.page=page;

        var cgCommand={ command: command, settings:data }

        switch (channel.mode)
        {
            case "pusher":
                data.pusher=channel.channel;
                break;

            case "api":
                data.url='http://'+channel.host+':'+channel.port+'/api/cg/'
                break;
        }

        console.log("send command to api: ",cgCommand)

        var url = this.getUrlBase() + "command/" +channel.mode;

        return new Promise((resolve, reject) => {
            console.log("url= " + url);
            axios
                .post(url,cgCommand)
                .then((httpReply) => {
                    resolve(httpReply.data)
                })
                .catch((error) => {
                    if (error.response) {
                        reject({ errorMessage: 'HTTP_' + error.response.status })
                    } else {
                        reject(error)
                    }
                })
        });

        return toRet        
    }

    constructor() {
        //this.apiUrlBase=appSettingsService.get("apiUrlBase");        
    }
})()

export default templateService;