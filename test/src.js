import classList from '../';

let cl = classList('#test')
.on('add', names=>{
    console.log('added ', names)
})
.on('remove', names=>{
    console.log('removed ', names)
});

cl.add('thing');
show(cl);
cl.remove('thing');
show(cl);

function show(cl){
    console.log('className ', cl.className);
    console.log('html ', cl.element.outerHTML);
}
