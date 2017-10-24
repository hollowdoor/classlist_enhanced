import classList from '../';

let cl = classList('#test')
.on('add', names=>{
    console.log('event added ', names)
})
.on('remove', names=>{
    console.log('event removed ', names)
});

cl.add('thing');
console.log('contains ',cl.contains('thing'));
console.log('className ', cl.className);
show(cl);
cl.remove('thing');
console.log('contains ',cl.contains('thing'));
show(cl);
cl.add('thing1', 'thing2');
cl.map(n=>n).forEach(name=>console.log('forEach name ', name))


function show(cl){
    console.log('html ', cl.element.outerHTML);
}
