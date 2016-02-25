var updateIndexes = require('./update_indexes'),
    getArgStrings = require('./get_arg_strings');

module.exports = {
    contains: function contains(className){
        return this.classList.contains(className);
    },
    add: function add(className){

        var self = this,
            classNames = getArgStrings(Array.prototype.slice.call(arguments));

        classNames.forEach(function(name){
            if(!this.contains(name)){
                this.classList.add(name);
            }
        }, this);

        updateIndexes(this, 'add');

        return this;
    },
    remove: function remove(className){
        var self = this,
            classNames = getArgStrings(Array.prototype.slice.call(arguments));

        classNames.forEach(function(name){
            if(this.contains(name)){
                this.classList.remove(name);
            }
        }, this);

        updateIndexes(this);

        return this;
    },
    toggle: function toggle(className, test){
        if(test === false) return this;

        var ret = this.classList.toggle(''+className);

        updateIndexes(this);

        return ret;
    },
    item: function(index){
        return this.classList.item(index);
    }
};
