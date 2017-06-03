// FIXME: Feel free to remove this :-)
console.log('\n\nGood Luck! 😅\n\n');
lastId = 0;
const server = require('socket.io')();
const firstTodos = require('../data');
const Todo = require('../todo');

// console.log(Todo);
server.on('connection', (client) => {

    client.on('disconnect', function(){
        console.log('Disconnected - '+ client.id);
    });

    console.log('connected')
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    const DB = firstTodos.map((t, i) => {
        // Form new Todo objects
        return new Todo(title=t.title, i);
    });

    client.emit('initialList',DB); 

    client.on('ADD_TASK', (task)=> {
        console.log(task);
        firstTodos.push(task);
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
});

console.log('Waiting for clients to connect');
server.listen(3003);
