var updateIndexes = require('./update_indexes'),
    getArgStrings = require('./get_arg_strings');

module.exports = {
    contains: function(className){
        return this.className.split(' ').indexOf(className) !== -1;
    },
    add: function(){
        var classes = [],
            classNames = getArgStrings(Array.prototype.slice.call(arguments));

        for(var i=0; i<classNames.length; i++){
            if(!this.contains(classNames[i])){
                this.className += ' '+classNames[i];
            }
        }

        updateIndexes(this);

        return this;
    },
    remove: function(){
        var classNames = getArgStrings(Array.prototype.slice.call(arguments)),
            classes = this.className.split(' '),
            reg;

        classNames.forEach(function(name){
            if(this.contains(name)){
                reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                this.className = this.className.replace(reg, ' ');
            }
        }, this);

        updateIndexes(this);

        return this;
    },
    toggle: function(className, test){
        if(test === false) return this;

        className = ''+className;
        var classNames = this.className.split(' '), ret;

        if(classNames.indexOf(className) !== -1){
            this.remove(className);
            ret = false;
        }else{
            this.add(className);
            ret = true;
        }

        updateIndexes(this);

        return ret;
    },
    item: function(index){
        return this.className.split(' ')[index] || null;
    }
};
