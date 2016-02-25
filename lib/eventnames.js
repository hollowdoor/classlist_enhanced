var holder = {
    transitionend: {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    },
    animationstart: {
        "animation"      : "animationstart",
        "OAnimation"     : "oAnimationStart",
        "MozAnimation"   : "animationstart",
        "WebkitAnimation": "webkitAnimationStart"
    },
    animationiteration: {
        "animation"      : "animationiteration",
        "OAnimation"     : "oAnimationIteration",
        "MozAnimation"   : "animationiteration",
        "WebkitAnimation": "webkitAnimationIteration"
    },
    animationend: {
        "animation"      : "animationend",
        "OAnimation"     : "oAnimationEnd",
        "MozAnimation"   : "animationend",
        "WebkitAnimation": "webkitAnimationEnd"
    }
};

module.exports = function(){
    var div = document.createElement('div');
    var result = {
        animationstart: prefixName('animationstart', div),
        animationend: prefixName('animationend', div),
        animationiteration: prefixName('animationiteration', div),
        transitionend: prefixName('transitionend', div)
    };
    div = null;
    return result;
};

function prefixName(name, element){

    var fixer = holder[name];

    for(var n in fixer){
        if(element.style[n] !== undefined){
            element = null;
            return fixer[n];
        }
    }

    element = null;
    return name;
}
