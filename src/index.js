import moreEvents from 'more-events';
import events from 'dom-eve';
import classList from 'dom-classlist';
import arrayFrom from 'array-from';
import updateIndexes from './lib/update_indexes.js';
import eventNames from './lib/eventnames.js';
const Emitter = moreEvents.Emitter;

class ClassListEnhanced extends Emitter {
    constructor(element, context){
        super();
        this.element = element;
        this.length = 0;

        this.classList = classList(element);

        const tracker = events.tracker();
        events(element, tracker)
        .on(eventNames.animationstart, event=>{
            return this.emit('animationstart', event);
        })
        .on(eventNames.animationend, event=>{
            return this.emit('animationend', event);
        })
        .on(eventNames.animationiteration, event=>{
            return this.emit('animationiteration', event);
        })
        .on(eventNames.transitionend, event=>{
            return this.emit('transitionend', event);
        });

        this.destroy = function(){
            tracker.clear();
        };
    }
    get className(){
        return this.element.className;
    }
    contains(name){
        return this.classList.contains(name);
    }
    add(...names){
        names.forEach(name=>{
            this.classList.add(name);
        });
        updateIndexes(this);
        this.emit('add', names);
    }
    remove(...names){
        names.forEach(name=>{
            this.classList.remove(name);
        });
        updateIndexes(this);
        this.emit('remove', names);
    }
    toggle(name, test){
        let result = this.classList.toggle(name, test);
        updateIndexes(this);
        this.emit('toggle', name, result);
    }
    forEach(fn, ctx){
        return arrayFrom(this).forEach(fn, ctx);
    }
    map(fn, ctx){
        return arrayFrom(this).map(fn, ctx);
    }
    filter(fn, ctx){
        return arrayFrom(this).filter(fn, ctx);
    }
    reduce(fn, init){
        return arrayFrom(this).reduce(fn, init);
    }
}
