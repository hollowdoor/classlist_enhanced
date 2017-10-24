(function () {
'use strict';

var Handler = function Handler(name, listener, matchListener){
    if ( matchListener === void 0 ) { matchListener = null; }

    this.name = name;
    this.matchListener = this.listener = listener;
    if(matchListener !== null){
        this.matchListener = matchListener;
    }
};

var MoreEvents = function MoreEvents(context){
    this.listeners = {};
    this.__context = context === void 0 ? this : context;
};
MoreEvents.prototype.addListener = function addListener (name, listener, matchListener){
    if(this.listeners[name] === void 0){
        this.listeners[name] = [];
    }
    this.listeners[name].push(new Handler(name, listener, matchListener));

    return this;
};
MoreEvents.prototype.removeListener = function removeListener (name, listener){
        var this$1 = this;

    if(this.listeners[name] === void 0 || !this.listeners[name].length)
        { return this; }

    for(var i=0; i<this.listeners[name].length; i++){
        var current = this$1.listeners[name][i];
        //The matchListener might be different
        //than the actual listener
        if(current.matchListener === listener){
            this$1.listeners[name].splice(i, 1);
            --i;
        }
    }

    return this;
};
MoreEvents.prototype.emitListeners = function emitListeners (name){
        var arguments$1 = arguments;

        var this$1 = this;
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) { args[ len ] = arguments$1[ len + 1 ]; }

    if(this.listeners[name] === void 0 || !this.listeners[name].length) { return; }

    for(var i=0; i<this.listeners[name].length; i++){
        (this$1.listeners[name][i].listener)
        .apply(this$1.__context, args);
    }
    return this;
};
MoreEvents.prototype.removeAll = function removeAll (name){
    delete this.listeners[name];
};
MoreEvents.prototype.dispose = function dispose (){
    this.listeners = this.__context = null;
};

var Emitter = (function (MoreEvents) {
    function Emitter(context){
        MoreEvents.call(this, context);
    }

    if ( MoreEvents ) { Emitter.__proto__ = MoreEvents; }
    Emitter.prototype = Object.create( MoreEvents && MoreEvents.prototype );
    Emitter.prototype.constructor = Emitter;
    Emitter.prototype.on = function on (name, listener){
        return this.addListener(name, listener);
    };
    Emitter.prototype.off = function off (name, listener){
        return this.removeListener(name, listener);
    };
    Emitter.prototype.one = function one (name, listener){
        return this.on(name, onceListener);
    };
    Emitter.prototype.emit = function emit (name){
        var arguments$1 = arguments;

        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) { args[ len ] = arguments$1[ len + 1 ]; }

        return (ref = this).emitListeners.apply(ref, [ name ].concat( args ));
        var ref;
    };
    Emitter.prototype.clear = function clear (name){
        this.removeAll(name);
    };

    return Emitter;
}(MoreEvents));

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var eventsProto = objectAssign(Object.create(null), {
    on: function on(name, cb, options){
        this.element.addEventListener(name, cb, options);
        this._records[name] = this._records[name] || [];
        this._records[name].push([
            name, cb, options
        ]);
        return this;
    },
    off: function off(name, cb, options){
        this.element.removeEventListener(name, cb, options);

        if(this._records[name] !== void 0){
            var records = this._records[name];

            for(var i=0; i<records.length; i++){
                if(records[i][1] === cb && records[i][2] === options){
                    records.splice(i, 1);
                    if(i + 1 !== records.length){
                        --i;
                    }
                }
            }
        }
        return this;
    },
    dispatch: function dispatch(event){
        this.element.dispatchEvent(event);
        return this;
    },
    clear: function clear(){
        var this$1 = this;

        for(var name in this$1._records){
            var records = this$1._records[name];
            records.forEach(function (record){
                (ref = this$1).off.apply(ref, record);
                var ref;
            });
        }
        return this;
    }
});

function events(element, tracker){
    if ( tracker === void 0 ) { tracker = null; }

    var eve = Object.create(eventsProto);
    eve._records = Object.create(null);
    if(typeof element === 'string'){
        eve.element = document.querySelector(element);
    }else{
        eve.element = element;
    }    

    if(tracker){
        tracker.list.push(eve);
    }

    return eve;
}

events.track = function track(){
    return {
        list: [],
        clear: function clear(){
            this.list.forEach(function (item){
                item.clear();
            });
        }
    };
};

/**
 * Module export
 *
 * @param {Element} el
 * @return {ClassList}
 */

var domClasslist = function (el) {
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for the given element
 *
 * @param {Element} el DOM Element
 */
function ClassList(el) {
  if (!el || el.nodeType !== 1) {
    throw new Error('A DOM Element reference is required');
  }

  this.el = el;
  this.classList = el.classList;
}

/**
 * Check token validity
 *
 * @param token
 * @param [method]
 */
function checkToken(token, method) {
  method = method || 'a method';

  if (typeof token != 'string') {
    throw new TypeError(
      'Failed to execute \'' + method + '\' on \'ClassList\': ' +
      'the token provided (\'' + token + '\') is not a string.'
    );
  }
  if (token === "") {
    throw new SyntaxError(
      'Failed to execute \'' + method + '\' on \'ClassList\': ' +
      'the token provided must not be empty.'
    );
  }
  if (/\s/.test(token)) {
    throw new Error(
      'Failed to execute \'' + method + '\' on \'ClassList\': ' +
      'the token provided (\'' + token + '\') contains HTML space ' +
      'characters, which are not valid in tokens.'
    );
  }
}

/**
 * Return an array of the class names on the element.
 *
 * @return {Array}
 */
ClassList.prototype.toArray = function () {
  var str = (this.el.getAttribute('class') || '').replace(/^\s+|\s+$/g, '');
  var classes = str.split(/\s+/);
  if ('' === classes[0]) { classes.shift(); }
  return classes;
};

/**
 * Add the given `token` to the class list if it's not already present.
 *
 * @param {String} token
 */
ClassList.prototype.add = function (token) {
  var classes, index, updated;
  checkToken(token, 'add');

  if (this.classList) {
    this.classList.add(token);
  }
  else {
    // fallback
    classes = this.toArray();
    index = classes.indexOf(token);
    if (index === -1) {
      classes.push(token);
      this.el.setAttribute('class', classes.join(' '));
    }
  }

  return;
};

/**
 * Check if the given `token` is in the class list.
 *
 * @param {String} token
 * @return {Boolean}
 */
ClassList.prototype.contains = function (token) {
  checkToken(token, 'contains');

  return this.classList ?
    this.classList.contains(token) :
    this.toArray().indexOf(token) > -1;
};

/**
 * Remove any class names that match the given `token`, when present.
 *
 * @param {String|RegExp} token
 */
ClassList.prototype.remove = function (token) {
  var this$1 = this;

  var arr, classes, i, index, len;

  if ('[object RegExp]' == Object.prototype.toString.call(token)) {
    arr = this.toArray();
    for (i = 0, len = arr.length; i < len; i++) {
      if (token.test(arr[i])) {
        this$1.remove(arr[i]);
      }
    }
  }
  else {
    checkToken(token, 'remove');

    if (this.classList) {
      this.classList.remove(token);
    }
    else {
      // fallback
      classes = this.toArray();
      index = classes.indexOf(token);
      if (index > -1) {
        classes.splice(index, 1);
        this.el.setAttribute('class', classes.join(' '));
      }
    }
  }

  return;
};

/**
 * Toggle the `token` in the class list. Optionally force state via `force`.
 *
 * Native `classList` is not used as some browsers that support `classList` do
 * not support `force`. Avoiding `classList` altogether keeps this function
 * simple.
 *
 * @param {String} token
 * @param {Boolean} [force]
 * @return {Boolean}
 */
ClassList.prototype.toggle = function (token, force) {
  checkToken(token, 'toggle');

  var hasToken = this.contains(token);
  var method = hasToken ? (force !== true && 'remove') : (force !== false && 'add');

  if (method) {
    this[method](token);
  }

  return (typeof force == 'boolean' ? force : !hasToken);
};

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: http://www.ecma-international.org/ecma-262/6.0/#sec-array.from
var polyfill = (function() {
  var isCallable = function(fn) {
    return typeof fn === 'function';
  };
  var toInteger = function (value) {
    var number = Number(value);
    if (isNaN(number)) { return 0; }
    if (number === 0 || !isFinite(number)) { return number; }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  };
  var maxSafeInteger = Math.pow(2, 53) - 1;
  var toLength = function (value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
  };
  var iteratorProp = function(value) {
    if(value != null) {
      if(['string','number','boolean','symbol'].indexOf(typeof value) > -1){
        return Symbol.iterator;
      } else if (
        (typeof Symbol !== 'undefined') &&
        ('iterator' in Symbol) &&
        (Symbol.iterator in value)
      ) {
        return Symbol.iterator;
      }
      // Support "@@iterator" placeholder, Gecko 27 to Gecko 35
      else if ('@@iterator' in value) {
        return '@@iterator';
      }
    }
  };
  var getMethod = function(O, P) {
    // Assert: IsPropertyKey(P) is true.
    if (O != null && P != null) {
      // Let func be GetV(O, P).
      var func = O[P];
      // ReturnIfAbrupt(func).
      // If func is either undefined or null, return undefined.
      if(func == null) {
        return void 0;
      }
      // If IsCallable(func) is false, throw a TypeError exception.
      if (!isCallable(func)) {
        throw new TypeError(func + ' is not a function');
      }
      return func;
    }
  };
  var iteratorStep = function(iterator) {
    // Let result be IteratorNext(iterator).
    // ReturnIfAbrupt(result).
    var result = iterator.next();
    // Let done be IteratorComplete(result).
    // ReturnIfAbrupt(done).
    var done = Boolean(result.done);
    // If done is true, return false.
    if(done) {
      return false;
    }
    // Return result.
    return result;
  };

  // The length property of the from method is 1.
  return function from(items /*, mapFn, thisArg */ ) {
    'use strict';

    // 1. Let C be the this value.
    var C = this;

    // 2. If mapfn is undefined, let mapping be false.
    var mapFn = arguments.length > 1 ? arguments[1] : void 0;

    var T;
    if (typeof mapFn !== 'undefined') {
      // 3. else
      //   a. If IsCallable(mapfn) is false, throw a TypeError exception.
      if (!isCallable(mapFn)) {
        throw new TypeError(
          'Array.from: when provided, the second argument must be a function'
        );
      }

      //   b. If thisArg was supplied, let T be thisArg; else let T
      //      be undefined.
      if (arguments.length > 2) {
        T = arguments[2];
      }
      //   c. Let mapping be true (implied by mapFn)
    }

    var A, k;

    // 4. Let usingIterator be GetMethod(items, @@iterator).
    // 5. ReturnIfAbrupt(usingIterator).
    var usingIterator = getMethod(items, iteratorProp(items));

    // 6. If usingIterator is not undefined, then
    if (usingIterator !== void 0) {
      // a. If IsConstructor(C) is true, then
      //   i. Let A be the result of calling the [[Construct]]
      //      internal method of C with an empty argument list.
      // b. Else,
      //   i. Let A be the result of the abstract operation ArrayCreate
      //      with argument 0.
      // c. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C()) : [];

      // d. Let iterator be GetIterator(items, usingIterator).
      var iterator = usingIterator.call(items);

      // e. ReturnIfAbrupt(iterator).
      if (iterator == null) {
        throw new TypeError(
          'Array.from requires an array-like or iterable object'
        );
      }

      // f. Let k be 0.
      k = 0;

      // g. Repeat
      var next, nextValue;
      while (true) {
        // i. Let Pk be ToString(k).
        // ii. Let next be IteratorStep(iterator).
        // iii. ReturnIfAbrupt(next).
        next = iteratorStep(iterator);

        // iv. If next is false, then
        if (!next) {

          // 1. Let setStatus be Set(A, "length", k, true).
          // 2. ReturnIfAbrupt(setStatus).
          A.length = k;

          // 3. Return A.
          return A;
        }
        // v. Let nextValue be IteratorValue(next).
        // vi. ReturnIfAbrupt(nextValue)
        nextValue = next.value;

        // vii. If mapping is true, then
        //   1. Let mappedValue be Call(mapfn, T, «nextValue, k»).
        //   2. If mappedValue is an abrupt completion, return
        //      IteratorClose(iterator, mappedValue).
        //   3. Let mappedValue be mappedValue.[[value]].
        // viii. Else, let mappedValue be nextValue.
        // ix.  Let defineStatus be the result of
        //      CreateDataPropertyOrThrow(A, Pk, mappedValue).
        // x. [TODO] If defineStatus is an abrupt completion, return
        //    IteratorClose(iterator, defineStatus).
        if (mapFn) {
          A[k] = mapFn.call(T, nextValue, k);
        }
        else {
          A[k] = nextValue;
        }
        // xi. Increase k by 1.
        k++;
      }
      // 7. Assert: items is not an Iterable so assume it is
      //    an array-like object.
    } else {

      // 8. Let arrayLike be ToObject(items).
      var arrayLike = Object(items);

      // 9. ReturnIfAbrupt(items).
      if (items == null) {
        throw new TypeError(
          'Array.from requires an array-like object - not null or undefined'
        );
      }

      // 10. Let len be ToLength(Get(arrayLike, "length")).
      // 11. ReturnIfAbrupt(len).
      var len = toLength(arrayLike.length);

      // 12. If IsConstructor(C) is true, then
      //     a. Let A be Construct(C, «len»).
      // 13. Else
      //     a. Let A be ArrayCreate(len).
      // 14. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 15. Let k be 0.
      k = 0;
      // 16. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = arrayLike[k];
        if (mapFn) {
          A[k] = mapFn.call(T, kValue, k);
        }
        else {
          A[k] = kValue;
        }
        k++;
      }
      // 17. Let setStatus be Set(A, "length", len, true).
      // 18. ReturnIfAbrupt(setStatus).
      A.length = len;
      // 19. Return A.
    }
    return A;
  };
})();

var arrayFrom = (typeof Array.from === 'function' ?
  Array.from :
  polyfill
);

function isElement(o){
    var type = typeof Element; //HTMLElement maybe
    return (
    type === "object" || type === 'function'
    ? o instanceof Element
    //DOM2
    : !!o
        && typeof o === "object"
        && o.nodeType === 1 //Definitely an Element
        && typeof o.nodeName==="string"
    );
}

function getElement(element, context){
    if ( context === void 0 ) { context = document; }

    if(typeof element === 'string'){
        try{
            return context.querySelector(element);
        }catch(e){ throw e; }
    }

    if(isElement(element)) { return element; }

    if(!!element && typeof element === 'object'){
        if(isElement(element.element)){
            return element.element;
        }else if(isElement(element[0])){
            return element[0];
        }
    }

    throw new TypeError(("value (" + element + ") in isElement(value)\n    is not an element, valid css selector,\n    or object with an element property, or index 0."));

}

/*
git remote add origin https://github.com/hollowdoor/dom_class_styles.git
git push -u origin master
*/

var domClassStyles = function classStyles(className){

    //http://stackoverflow.com/questions/324486/how-do-you-read-css-rule-values-with-javascript

    var styleSheets = window.document.styleSheets;
    var styleSheetsLength = styleSheets.length;
    var classes, ret = null;
    for(var i=styleSheetsLength -1; i>-1; --i){
        classes = styleSheets[i].rules || styleSheets[i].cssRules;
        if (!classes)
            { continue; }

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

        if(ret) { break; }
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
        if ( context === void 0 ) { context = document; }

        Emitter$$1.call(this);
        this.element = getElement(element, context);
        this.length = 0;
        this.classList = domClasslist(this.element);

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

    if ( Emitter$$1 ) { ClassListEnhanced.__proto__ = Emitter$$1; }
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
        var arguments$1 = arguments;

        var this$1 = this;
        var names = [], len = arguments.length;
        while ( len-- ) { names[ len ] = arguments$1[ len ]; }

        names.forEach(function (name){
            this$1.classList.add(name);
        });
        updateIndexes(this);
        return this.emit('add', names);
    };
    ClassListEnhanced.prototype.remove = function remove (){
        var arguments$1 = arguments;

        var this$1 = this;
        var names = [], len = arguments.length;
        while ( len-- ) { names[ len ] = arguments$1[ len ]; }

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

classList.classStyles = domClassStyles;

var cl = classList('#test')
.on('add', function (names){
    console.log('event added ', names);
})
.on('remove', function (names){
    console.log('event removed ', names);
});

cl.add('thing');
console.log('contains ',cl.contains('thing'));
console.log('className ', cl.className);
show(cl);
cl.remove('thing');
console.log('contains ',cl.contains('thing'));
show(cl);
cl.add('thing1', 'thing2');
cl.map(function (n){ return n; }).forEach(function (name){ return console.log('forEach name ', name); });


function show(cl){
    console.log('html ', cl.element.outerHTML);
}

}());
//# sourceMappingURL=code.js.map
