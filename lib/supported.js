var types = {
    transition: {
        "transition"      : "",
        "OTransition"     : "",
        "MozTransition"   : "",
        "WebkitTransition": ""
    },
    animation: {
        "animation"      : "",
        "OAnimation"     : "",
        "MozAnimation"   : "",
        "WebkitAnimation": ""
    }
};

module.exports = function(type, cb){

    var check = types[type],
        element = document.createElement('div');

    for(var n in check){
        if(element.style[n] !== undefined){
            if(cb !== undefined){
                cb();
            }
            element = null;
            return true;
        }
    }
    element = null;
    return false;

};
