import { Emitter } from 'more-events';
import events from 'dom-eve';
import _classList from 'dom-classlist';
import arrayFrom from 'array-from';
import getElement from 'dom-get-element';
import classStyles from 'dom-class-styles';

function updateIndexes(self){
    var classes = self.className.trim().split(' ');
    Array.prototype.splice.call(self, 0, self.length);
    Array.prototype.push.apply(self, classes);
}

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

var eventNames = (function (){
    var div = document.createElement('div');
    var result = {
        animationstart: prefixName('animationstart', div),
        animationend: prefixName('animationend', div),
        animationiteration: prefixName('animationiteration', div),
        transitionend: prefixName('transitionend', div)
    };
    div = null;
    return result;
})();

var eventNames$1 = { eventNames: eventNames };

var ClassListEnhanced = (function (Emitter$$1) {
    function ClassListEnhanced(element, context){
        var this$1 = this;
        if ( context === void 0 ) context = document;

        Emitter$$1.call(this);
        this.element = getElement(element, context);
        this.length = 0;
        this.classList = _classList(this.element);

        var tracker = events.track();
        events(element, tracker)
        .on(eventNames$1.animationstart, function (event){
            return this$1.emit('animationstart', event, this$1.element);
        })
        .on(eventNames$1.animationend, function (event){
            return this$1.emit('animationend', event, this$1.element);
        })
        .on(eventNames$1.animationiteration, function (event){
            return this$1.emit('animationiteration', event, this$1.element);
        })
        .on(eventNames$1.transitionend, function (event){
            return this$1.emit('transitionend', event, this$1.element);
        });

        this.destroy = function(){
            tracker.clear();
            this.dispose();
        };
    }

    if ( Emitter$$1 ) ClassListEnhanced.__proto__ = Emitter$$1;
    ClassListEnhanced.prototype = Object.create( Emitter$$1 && Emitter$$1.prototype );
    ClassListEnhanced.prototype.constructor = ClassListEnhanced;

    var prototypeAccessors = { className: {} };
    prototypeAccessors.className.get = function (){
        return this.element.className;
    };
    ClassListEnhanced.prototype.contains = function contains (name){
        return this.classList.contains(name);
    };
    ClassListEnhanced.prototype.add = function add (){
        var this$1 = this;
        var names = [], len = arguments.length;
        while ( len-- ) names[ len ] = arguments[ len ];

        names.forEach(function (name){
            this$1.classList.add(name);
        });
        updateIndexes(this);
        return this.emit('add', names);
    };
    ClassListEnhanced.prototype.remove = function remove (){
        var this$1 = this;
        var names = [], len = arguments.length;
        while ( len-- ) names[ len ] = arguments[ len ];

        names.forEach(function (name){
            this$1.classList.remove(name);
        });
        updateIndexes(this);
        return this.emit('remove', names);
    };
    ClassListEnhanced.prototype.toggle = function toggle (name, test){
        var result = this.classList.toggle(name, test);
        updateIndexes(this);
        return this.emit('toggle', name, result);
    };
    ClassListEnhanced.prototype.item = function item (index){
        return this.classList.item(index);
    };
    ClassListEnhanced.prototype.forEach = function forEach (fn, ctx){
        return arrayFrom(this).forEach(fn, ctx);
    };
    ClassListEnhanced.prototype.map = function map (fn, ctx){
        return arrayFrom(this).map(fn, ctx);
    };
    ClassListEnhanced.prototype.filter = function filter (fn, ctx){
        return arrayFrom(this).filter(fn, ctx);
    };
    ClassListEnhanced.prototype.reduce = function reduce (fn, init){
        return arrayFrom(this).reduce(fn, init);
    };

    Object.defineProperties( ClassListEnhanced.prototype, prototypeAccessors );

    return ClassListEnhanced;
}(Emitter));

if(Symbol && Symbol.iterator){
    ClassListEnhanced.prototype[Symbol.iterator] = function(){
        var index = -1, self = this;
        return {
            next: function(){
                if(++index < self.length){
                    return {done: false, value: self[index]};
                }else{
                    return {done: true};
                }
            }
        };
    };
}

function classList(element, context){
    return new ClassListEnhanced(element, context);
}

classList.classStyles = classStyles;

export default classList;
//# sourceMappingURL=bundle.es.js.map
