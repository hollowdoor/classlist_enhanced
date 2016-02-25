module.exports = function getArgStrings(args){
    for(var i=0; i<args.length; i++){
        args[i] = ''+(args[i].trim());
    }

    return args;
};
