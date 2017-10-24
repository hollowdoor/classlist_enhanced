import { Emitter } from 'more-events';
import events from 'dom-eve';
import _classList from 'dom-classlist';
import arrayFrom from 'array-from';
import getElement from 'dom-get-element';
import classStyles from 'dom-class-styles';
import updateIndexes from './lib/update_indexes.js';
import eventNames from './lib/eventnames.js';

class ClassListEnhanced extends Emitter {
    constructor(element, context = document){
        super();
        this.element = getElement(element, context);
        this.length = 0;
        this.classList = _classList(this.element);

        const tracker = events.track();
        events(element, tracker)
        .on(eventNames.animationstart, event=>{
            return this.emit('animationstart', event, this.element);
        })
        .on(eventNames.animationend, event=>{
            return this.emit('animationend', event, this.element);
        })
        .on(eventNames.animationiteration, event=>{
            return this.emit('animationiteration', event, this.element);
        })
        .on(eventNames.transitionend, event=>{
            return this.emit('transitionend', event, this.element);
        });

        this.destroy = function(){
            tracker.clear();
            this.dispose();
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
        return this.emit('add', names);
    }
    remove(...names){
        names.forEach(name=>{
            this.classList.remove(name);
        });
        updateIndexes(this);
        return this.emit('remove', names);
    }
    toggle(name, test){
        let result = this.classList.toggle(name, test);
        updateIndexes(this);
        return this.emit('toggle', name, result);
    }
    item(index){
        return this.classList.item(index);
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

if(Symbol && Symbol.iterator){
    ClassListEnhanced.prototype[Symbol.iterator] = function(){
        let index = -1, self = this;
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

export default function classList(element, context){
    return new ClassListEnhanced(element, context);
}

classList.classStyles = classStyles;
