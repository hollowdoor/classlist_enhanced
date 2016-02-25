module.exports = mix;

function mix(self, use, props, map){

    if(typeof use !== 'boolean'){
        props = use;
        use = true;
        map = props;
    }

    if(typeof map !== 'function'){
        map = noop;
    }

    if(use){
        addProps(self, props, map);
    }
}

function addProps(self, props, map){
    var obj = {},
        value;

    for(var n in props){
        value = map(props[n], name, self);
        if(typeof props[n] === 'function'){
            obj[n] = {
                value: value
            };
        }else{
            obj[n] = {
                value: value,
                writeable: true
            };
        }

    }

    Object.defineProperties(self, obj);
}

function noop(value){ return value; }
