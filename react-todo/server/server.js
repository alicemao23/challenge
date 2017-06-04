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

    // // // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    
    client.on('GET_INITIAL_TASK', function() {
        client.emit('initial_List', DB); 
   })

    client.on('RECONNECTED', (tasks) => {
        // DB = tasks;
        client.emit('reconnection_established', DB); 
    })
   

    client.on('ALL_TASK_DELETED', (tasks) => {
        DB = tasks;
        client.emit('task_deleted', DB); 
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

    // // Sends a message to the client to reload all todos
    // const reloadTodos = () => {
    //     server.emit('load', DB);
    // }

    // // Accepts when a client makes a new todo
    // client.on('make', (t) => {
    //     // Make a new todo
    //     const newTodo = new Todo(title=t.title);

    //     // Push this newly created todo to our database
    //     DB.push(newTodo);

    //     // Send the latest todos to the client
    //     // FIXME: This sends all todos every time, could this be more efficient?
    //     reloadTodos();
    // });

    // // Send the DB downstream on connect
    // reloadTodos();
    client.on('disconnect', function(){
        console.log('Disconnected - '+ client.id, DB);
    });

});

server.on('disconnect', (client) => {
    console.log('fuck');
    client.emit('disconnected', DB);
})

console.log('Waiting for clients to connect');
server.listen(3003);
