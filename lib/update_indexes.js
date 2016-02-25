module.exports = function updateIndexes(self){
    var classes = self.className.trim().split(' ');
    Array.prototype.splice.call(self, 0, self.length);
    Array.prototype.push.apply(self, classes);
};
