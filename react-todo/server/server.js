// FIXME: Feel free to remove this :-)
console.log('\n\nGood Luck! 😅\n\n');

const server = require('socket.io')();
const firstTodos = require('../data');
const Todo = require('../src/todo');

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
//Moved DB to the outside of server connection so that DB can persistent regardless socket connection 
console.log('new connection');
let DB = firstTodos.map((t, i) => {
    // Form new Todo objects with ID 
    return new Todo(title=t.title, i);
})
console.log(DB);
server.on('connection', (client) => {

    console.log('connected', client.id, DB);
    
    client.on('GET_INITIAL_TASK', function() {
        client.emit('initial_List', DB); 
   })

    client.on('RECONNECTED', (tasks) => {
        server.emit('reconnection_established', DB); 
    })
   

    client.on('ALL_TASK_DELETED', (tasks) => {
        DB = tasks;
        server.emit('task_deleted', DB); 
    })

    client.on('ADD_TASK', (task)=> {
        DB.push(task);
        server.emit('task_added', task)
    })

    client.on('TASK_CHANGED', (tasks)=> {
        DB = tasks;
        server.emit('task_changed', DB)
    })

    client.on('TASK_DELETED', (tasks) => {
        DB = tasks; 
        server.emit('task_deleted', DB);
    })

    client.on('disconnect', function(){
        console.log('Disconnected - '+ client.id, DB);
    });

});

server.on('disconnect', (client) => {
    client.emit('disconnected', DB);
})

console.log('Waiting for clients to connect');
server.listen(3003);
