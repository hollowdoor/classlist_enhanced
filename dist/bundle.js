'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var moreEvents = _interopDefault(require('more-events'));
var events = _interopDefault(require('dom-eve'));
var _classList = _interopDefault(require('dom-classlist'));
var arrayFrom = _interopDefault(require('array-from'));
var getElement = _interopDefault(require('dom-get-element'));

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

var Emitter = moreEvents.Emitter;

var ClassListEnhanced = (function (Emitter) {
    function ClassListEnhanced(element, context){
        var this$1 = this;
        if ( context === void 0 ) context = document;

        Emitter.call(this);
        this.element = getElement(element, context);
        console.log('this.element ',this.element);
        this.length = 0;

        this.classList = _classList(this.element);

        var tracker = events.track();
        events(element, tracker)
        .on(eventNames$1.animationstart, function (event){
            return this$1.emit('animationstart', event);
        })
        .on(eventNames$1.animationend, function (event){
            return this$1.emit('animationend', event);
        })
        .on(eventNames$1.animationiteration, function (event){
            return this$1.emit('animationiteration', event);
        })
        .on(eventNames$1.transitionend, function (event){
            return this$1.emit('transitionend', event);
        });

        this.destroy = function(){
            tracker.clear();
        };
    }

    if ( Emitter ) ClassListEnhanced.__proto__ = Emitter;
    ClassListEnhanced.prototype = Object.create( Emitter && Emitter.prototype );
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

function classList(element, context){
    return new ClassListEnhanced(element, context);
}

module.exports = classList;
//# sourceMappingURL=bundle.js.map
