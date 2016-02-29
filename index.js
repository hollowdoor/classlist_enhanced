var Emitter = require('more-events').Emitter,
    mix = require('object-provide'),
    classStyles = require('dom-class-styles'),
    updateIndexes = require('./lib/update_indexes'),
    optional = require('./lib/optional_methods'),
    mainMethods = require('./lib/main_methods'),
    getArgStrings = require('./lib/get_arg_strings'),
    aniEvent = require('./lib/anievent'),
    eventNames = require('./lib/eventnames')(),
    supported = require('./lib/supported'),
    canClassList = window && ("document" in window.self) && ("classList" in document.createElement("_"));

/*
git remote add origin https://github.com/hollowdoor/classlist_enhanced.git
git push -u origin master
*/
require('./lib/polyfillet');

function ClassListEnhanced(element, doc){
    doc = doc || document || null;

    if(doc === null){
        throw new TypeError(doc+' is not a document.');
    }

    this.length = 0;

    if(typeof element === 'string'){
        element = doc.querySelector(element);
    }

    this.element = element;

    //Support virtual nodejs DOM that supports classList.
    mix(this, !window && 'classList' in element, mainMethods);

    var self = this;
        emitter = new Emitter(this);

    this.on = function(){
        emitter.on.apply(emitter, arguments);
        return this;
    };

    this.one = function(){
        emitter.one.apply(emitter, arguments);
        return this;
    };

    this.off = function(){
        emitter.off.apply(emitter, arguments);
        return this;
    };

    this.emit = function(){
        emitter.emit.apply(emitter, arguments);
    };

    function onStart(e){
        emitter.emit('animationstart', this, aniEvent(e));
    }

    function onEnd(e){
        emitter.emit('animationend', this, aniEvent(e));
    }

    function onIteration(e){
        emitter.emit('animationiteration', this, aniEvent(e));
    }

    function onTransitionEnd(e){
        emitter.emit('transitionend', this, aniEvent(e));
    }

    //Set listeners when using a browser
    if('addEventListener' in element){
        element.addEventListener(eventNames.animationstart, onStart, false);
        element.addEventListener(eventNames.animationend, onEnd, false);
        element.addEventListener(eventNames.animationiteration, onIteration, false);
        element.addEventListener(eventNames.transitionend, onTransitionEnd, false);
    }

    Object.defineProperties(this, {
        classList: {
            get: function(){
                return element.classList || undefined;
            }
        },
        className: {
            get: function(){
                return element.className.trim();
            },
            set: function(className){
                element.className = className;
            }
        }
    });

    updateIndexes(this);

    this.destroy = function(){
        if('removeEventListener' in element){
            element.removeEventListener(eventNames.animationstart, onStart, false);
            element.removeEventListener(eventNames.animationend, onEnd, false);
            element.removeEventListener(eventNames.animationiteration, onIteration, false);
            element.removeEventListener(eventNames.transitionend, onTransitionEnd, false);
        }

        self = null;
        element = null;
        emitter = null;
    };
}

mix(ClassListEnhanced.prototype, canClassList, mainMethods);
mix(ClassListEnhanced.prototype, !canClassList, optional);
mix(ClassListEnhanced.prototype, {
    toggleAll: function(){
        var test = null,
            classNames = Array.prototype.slice.call(arguments),
            type = typeof classNames[classNames.length - 1];

        if(['boolean', 'function'].indexOf(type) !== -1){
            if(!(test = classNames.pop())) return this;

            if(type !== 'function') test = null;
        }

        classNames = getArgStrings(classNames);

        classNames.forEach(function(name, index, list){
            if(test && !test(name, index, list)) return;
            this.toggle(name);
        }, this);

        return this;
    },
    toString: function(){
        return this.className;
    },
    forEach: function forEach(callback, context){
        var classNames = this.className.split(' ');
        classNames.forEach(callback, context || this);
        updateIndexes(this);
        return this;
    },
    map: function map(callback, context){
        var classNames = this.className.split(' ');
        return classNames.map(callback, context || this);
    },
    filter: function filter(callback, context){
        var classNames = this.className.split(' ');
        return classNames.filter(callback, context || this);
    }
});

if(Symbol && Symbol.iterator){
    ClassListEnhanced.prototype[Symbol.iterator] = function(){
        var index = -1, self;
        return {
            next: function(){
                if(++index < this.length){
                    return {done: false, value: self[index]};
                }else{
                    return {done: true};
                }
            }
        };
    };
}

module.exports = function(element){
    return new ClassListEnhanced(element);
};

mix(module.exports, {
    classStyles: classStyles,
    supported: supported
});
