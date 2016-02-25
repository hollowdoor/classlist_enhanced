module.exports = (function(){
    return !Object.defineProperties
    ? function(e){
        var event = {};
        for(var n in e){
            event[n] = e[n];
        }
        event.name = e.animationName || e.propertyName || null;
        event.elapsed = e.elapsedTime;
        return event;
    } : function(e){
        var src = {}, event = {};
        for(var n in e){
            src[n] = {
                value: e[n]
            };
        }

        src.name = {value: e.animationName || e.propertyName || null};
        src.elapsed = {value: e.elapsedTime};

        Object.defineProperties(event, src);

        return event;
    };
}());
