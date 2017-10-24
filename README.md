classlist-enhanced
==================

Install
-------

`npm install --save classlist-enhanced`

Version 2 differences
--------

Version 2:

* uses `dom-get-element` in it's constructor
* doesn't have the `supports()` static method
* is designed using es2015 syntax
* has "add", "remove", and "toggle" events
* uses normal transition/animation events
* has no array/string polyfills
* is more compact than version 1

See the README_version1.md for version 1 documentation.

Constructor
-----------

### classList(element, context) -> object

See [dom-get-element](https://github.com/hollowdoor/dom_get_element) to see what you can pass as `element`.

`context` is optional. `context` is the top level element passed to `getElement(element, context)` from the `dom-get-element` module if you passed a selector for `element`.

classList Methods
-----------------

These methods work exactly like a regular DOM element's [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) methods.

-	classList.contains(string)
-	classList.add(...strings)
-	classList.remove(...strings)
-	classList.oggle(string, boolean)
-	classList.item(integer)

Array like methods
------------------

These methods work exactly like they would on an [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). You get a [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) token on each iteration.

The default context of the array like methods is the `classlist-enhanced` instance.

-	classList.forEach(function, context|undefined)
-	classList.map(function, context|undefined)
-	classList.filter(function, context|undefined)
-   classList.reduce(function, initialValue)


Special Methods
---------------

### on(event, listener)

Set one of these events:

-	animationstart
-	animationiteration
-	animationend
-	transitionend

```javascript
import classList from 'classlist-enhanced';

let cl = classList('#some-element');
cl.on('transitionend', (event, element)=>{
    //event is the usual DOM event
    //element is the element you passed to classList(element)
})
```

These events correspond to classList methods:

### events "add", "remove"

```javascript
import classList from 'classlist-enhanced';

let cl = classList('#some-element');
cl.on('add', addedClasses=>{
    //Fired on cl.add(className);
}).on('remove', addedClasses=>{
    //Fired on cl.remove(className);
});
```

### event "toggle"

```javascript
import classList from 'classlist-enhanced';

let cl = classList('#some-element');
cl.on('toggle', (toggledClass, isToggled)=>{
    //isToggled is the return value of classList.toggle(className);
});
```

Other events can be set, but you'll have to emit them yourself.



These are the extra fields for the **event** object.

-	event.name
-	event.elapsed (Shorter version of `elapsedTime`\)

`event.name` stands for `animationName`, or `propertyName` depending if it's an animation event, or transition event.

### off(event, listener)

Remove an event listener.

### one(event, listener)

Add a one time event listener.

### emit(event, ...args)

Emit an event for the listeners set with the on method.

### destroy()

Destroy the current instance of `classlist-enhanced`. This method really just removes all the event listeners for the current instance to save memory, and sets some other internal variables to `null`.

Static Methods
--------------

### classStyles(class string)

Get a style object with all styles for a specific css class.

**class string** should be a name of an existing css class.

Properties
----------

### classList

The original DOM classList if it exists.

### className

The className of the DOM element.

Indexes (Array like functionality)
-------------------------------

`classlist-enhanced` is an array like.

Each class you have on your element will be in a number index on a `classlist-enhanced` instance.

There is a chance of wrong indexes if you alter the classes outside of `classlist-enhanced`. Just be aware of this unfortunately leaky aspect, and you should be ok.

A Simple Example
----------------

### The CSS

```css
.slidein {
    height: 100px;
    animation-duration: 3s;
    animation-name: slidein;
    animation-iteration-count: 1;
    animation-direction: alternate;
}

@keyframes slidein {
  0% {
    margin-left:100%;
    width:300%
  }

  100% {
    margin-left:0%;
    width:100%;
  }
}
```

### The Javascript

```javascript
var classList = require('classlist-enhanced');

//Some html element has the ID test.
var testList = classList('#test');
//Alternatively pass an element.
//var test = document.querySelector('#test');
//var testList = classList(test);

console.log(testList.contains('test')); //false

testList.one('animationend', function(element, event){
    console.log('slidein complete');
    this.remove('slidein');
    //slidein is removed for now because
    //the animation won't be used on #test again.
});

testList.toggle('slidein'); //Start the animation.

console.log(classList.classStyles('slidein')) //Get an object with the style for the class.
```

Supporting Non-CSS3 Environments
--------------------------------

**classlist-enhanced** will work in most environments, but if the animation, and transition events aren't available you will see some side effects. For the rare possibility of no events you should be aware that critical code inside listeners will not work. Emphasis is on rare as most modern browsers do support these events.


About
-----

Having that little extra functionality is helpful isn't it.

There has been some work put into making classList functionality work cross browser inside **classlist-enhanced**. For most scripting this library should work for all platforms except maybe IE8, and before. With a proper nodejs DOM you might be able to manipulate classes on the server too. [jsdom](https://github.com/tmpvar/jsdom) is a possibility, but it's hard to tell if it will work.

Even if animations, and transitions aren't usable in a certain environment at least the class changes will work so in that sense **classlist-enhanced** is as backwards compatible as the actual DOM `classList`.

You will need browserify, rollup or some other module compiler that works with es2015/commonjs modules to use this library.

Happy coding!
