module.exports = function classStyles(className){

    //http://stackoverflow.com/questions/324486/how-do-you-read-css-rule-values-with-javascript

    var styleSheets = window.document.styleSheets;
    var styleSheetsLength = styleSheets.length;
    var classes, ret = null;
    for(var i=styleSheetsLength -1; i>-1; --i){
        classes = styleSheets[i].rules || styleSheets[i].cssRules;
        if (!classes)
            continue;

        for(var x=0; x<classes.length; x++){
            if(classes[x].selectorText === '.'+className){
                if(classes[x].cssText){
                    ret = classes[x].cssText;
                    break;
                }else{
                    ret = classes[x].style.cssText;
                    break;
                }
            }
        }

        if(ret) break;
    }

    if(!ret){
        return null;
    }

    var items, current, name, styles = {};

    if(ret.indexOf(classes[x].selectorText) !== -1){
        ret = ret.replace(/[^{]+\{([^}]+)\}/m, '$1');
    }


    items = ret.split(';');

    for(var i=0; i<items.length; i++){
        current = items[i].split(':');
        if(current.length > 1){
            name = current[0].trim().replace(/\-([\S])/g, function(m, $1){
                return $1.toUpperCase();
            });
            styles[name] = current[1].trim();
        }

    }
    return styles;

};
