var templateDefinition = {
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
}

var playList={
    "layout":"wbd",
    "title":"A test playlist",
    "type":"folder",
    "scenes":[]
}

const templateService = new (class {

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
                // syntax: field,name,help|type,args|validators
                // type: can be a reference is prefixed with *
                var fieldNameTokens = tokens[0].split(',');


                var field = fieldNameTokens[0];
                var name = fieldNameTokens.length > 0 && fieldNameTokens[1] != '' ? fieldNameTokens[1] : field;
                var description = fieldNameTokens.length > 2 ? fieldNameTokens[2] : null;

                var toAdd = {
                    field: field, name: name, description: description
                }

                //console.log("field name",field,name,description)                

                var typeTokens = (tokens.length > 0 ? tokens[1] : 'text').split(',');
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
            console.log("array conversion: ", toConvert)

            toConvert.forEach(field => {

                this.convertField(template, toRet, field)
            })
        }
        else {
            console.log("direct reference: ", template, toConvert)
            return this.convertDefinition(template, template.definitions[toConvert]);
        }

        return toRet;
    }

    convertAction(template, scene, action) {

        if (this.isString(action)) {
            //actions: action,[definition],[title]  // default definition: template.action
            var tokens = action.split(',');

            var action = tokens[0];
            var definition = tokens.length > 1 ? tokens[1] : "";
            if (definition == '') definition = scene.template + '.' + action;

            var title = tokens.length > 2 ? tokens[2] : '';

            action = { "action": action, "title": title, "definition": definition }
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
            var templateName=templateNameTokens[0];
            var key=templateNameTokens.length>1?templateNameTokens[1]:templateName;
            var layer = sceneTokens.length > 1 ? sceneTokens[1] : 'default';
            if (layer=='') layer='default';
            var definition = sceneTokens.length > 2 ? sceneTokens[2] : key;
            if (definition == "") definition = templateName;
            var title = sceneTokens.length > 3 ? sceneTokens[3] : null;
            toRet = { "key":key, "template": templateName, "layer": layer, "definition": definition, "title": title }

            tokens.splice(0, 1);
            if (tokens.length > 0) {
                console.log("ACTION ACTIONS ACTIONS ", tokens)
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

        toRet.sortedScenes={};

        scenes.forEach(scene=>{

        })

        return toRet;
    }

    getPlayList(layout,name)
    {
        return Promise.resolve(playList);
    }

    get(layout) {
        var toRet = this.processTemplateDefinition(templateDefinition);

        return Promise.resolve(toRet);
    }

    constructor() {
    }
})()

export default templateService;