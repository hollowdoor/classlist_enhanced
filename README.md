classlist-enhanced
==================

Constructor
-----------

### classList(element|selector, document) -> object

Pass a DOM element, or a CSS selector as the first argument.

The `document` argument is an optional argument.

Most of the time you shouldn't have to pass a `document` object, but maybe there is a virtual DOM for node that would work.

classList Methods
-----------------

These methods work exactly like a regular DOM element's [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) methods.

-	contains(string)
-	add(string, ...)
-	remove(string, ...)
-	toggle(string, boolean)
-	item(integer)

Array like methods
------------------

These methods work exactly like they would on an [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). You get a [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) token on each iteration.

The default context of the array like methods is the `classlist-enhanced` instance.

-	forEach(function, context|undefined)
-	map(function, context|undefined)
-	filter(function, context|undefined)

There is no `reduce` method because it's hard to think of a good purpose for it.

Special Methods
---------------

### toggleAll(string, ..., boolean)

Toggle multiple class strings with an optional `bool` like `classList.toggle`.

### on(event, listener)

Set one of these events:

-	animationstart
-	animationiteration
-	animationend
-	transitionend

Other events can be set, but you'll have to emit them yourself.

#### listener(element, event)

A listener is a function callback.

The **element** parameter is the current element.

The **event** parameter is a special event object that mirrors animation, and transition events.

The **event** object has all the fields of [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) as well as [AnimationEvent](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent), or [TransitionEvent](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent).

These are the extra fields for the **event** object.

-	event.name
-	event.elapsed (Shorter version of `elapsedTime`\)

`event.name` stands for `animationName`, or `propertyName` depending if it's an animation event, or transition event.

### off(event, listener)

Remove an event listener.

### one(event, listener)

Add a one time event listener.

### emit(event, argument, ...)

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
----------------------------------

`classlist-enhanced` is an array like.

Each class you have on your element will be in a number index on a `classlist-enhanced` instance.

There is a chance of wrong indexes if you alter the classes outside of `classlist-enhanced`. Just be aware of this unfortunately leaky aspect, and you should be ok.

A Simple Example
----------------

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

If you must support really old browsers you can use the supported static method:

#### supported(string, callback) -> boolean

```javascript
var classList = require('classlist-enhanced');
classList.supported('animation', function(){
    console.log('animation is supported')
});

classList.supported('transition', function(){
    console.log('transition is supported')
});
```

classList.supported only checks if there is support for CSS3 animations, or transitions.

The `callback` runs when support for the chosen functionality is verified.

Set your CSS3 events inside the supported callback if you're really worried about old browsers messing up your events.

You still need to set your CSS3 prefixes in your style sheets.

About
-----

Having that little extra functionality is helpful isn't it.

There has been some work put into making classList functionality work cross browser inside **classlist-enhanced**. For most scripting this library should work for all platforms except maybe IE8, and before. With a proper nodejs DOM you might be able to manipulate classes on the server too. [jsdom](https://github.com/tmpvar/jsdom) is a possibility, but it's hard to tell if it will work.

Even if animations, and transitions aren't usable in a certain environment at least the class changes will work so in that sense **classlist-enhanced** is as backwards compatible as the actual DOM `classList`.

You will need *browserify*, or some other module compiler that works with commonjs modules to use this library.

Happy coding!
