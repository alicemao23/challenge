import React, { Component } from 'react';
import Todos from '../components/todolist';
import Todo from '../todo';
const io = require('socket.io-client') 
const server = io('http://localhost:3003/');


export default class TodoContainer extends Component {
	constructor () {
		super();

		this.state= {
			todoItem: '',
			todos: [], 
			server: true, 
		}
		server.on('connect', () => {
			if(!this.state.server) {
				this.setState({
					server: true
				})
				server.emit('RECONNECTED', this.state.todos);
			} else {
				this.retrieveData();
			}
		})

		server.once('connect_error', () => {
			if(this.state.server){
				this.retrieveData();
				this.setState({
					server: false
				})
			}
			// let cachedTodos = JSON.parse(localStorage.getItem('list')); 
				// this.state.server =  false; 
				// this.state.todos = cachedTodos;
				// console.log('updating')
			// console.log('connection error');
			// if (this.state.server) {
			// 	this.setState({
			// 		server: false
			// 	})
			// 	// localStorage.setItem('server-connection', false);
			// 	localStorage.setItem('list', JSON.stringify(this.state.todos));
			// } else {
			// 	let cachedTodos = JSON.parse(localStorage.getItem('list')); 
			// 	console.log('reconnected:',cachedTodos);
			// 	this.setState({
			// 		todos: cachedTodos
			// 	})
			// }
		})

		server.on('disconnect', () => { 
			console.log('disconnected')
			if(this.state.server){
				this.state.server = false
			}

		// 	server.emit('RECONNECTED', this.state.todos);
		// 	if(!this.state.server){
		// 		let cachedTodos = JSON.parse(localStorage.getItem('list')); 
		// 		console.log('reconnected:',cachedTodos);
		// 		this.setState({
		// 			server: true, 
		// 			todos: cachedTodos
		// 		})
		// 	}
			localStorage.setItem('list', JSON.stringify(this.state.todos));
		})

		server.on('initial_List', (DB)=> {
			this.setState({todos: DB})
		}); 

		server.on('task_changed', (todos) =>{
			this.modifyTodoState(todos)
		});

		server.on('task_added', (task) => {
			// this.setState(prevState => ({
		 //        todos: [...prevState.todos, task],
		 //        todoItem: ''
		 //    }));
		    this.pushNewTask(task)
		 // 	this.setState({
			// 	todos: tasks
			// })
			// this.modifyTodoState(tasks)

		})

		server.on('task_deleted', (tasks) => {
			// this.setState({
			// 	todos: tasks
			// })
			this.modifyTodoState(tasks)

		})
	}	
	retrieveData () {
		let cachedTodos = JSON.parse(localStorage.getItem('list'));
		//check to see if server is connected 
		//if server is connected && have ran before, retrieve data from cache
			if(cachedTodos === null){
				server.emit('GET_INITIAL_TASK')
			}else if(cachedTodos.length > 0){
				//retrieve initial task from server
				this.setState({
					todos: cachedTodos
				})
			}
	} 

	pushNewTask (task) {
		this.setState(prevState => ({
	        todos: [...prevState.todos, task],
	        todoItem: ''
	    }));
	}

	updateState (event, newState) {
		if(!this.state.server){
			this.modifyTodoState(newState)
		} else {
			server.emit(event, newState);
		}
	}

	modifyTodoState(newState) {
		this.setState({
			todos: newState
		})
	}
	handleChange(event) {
		this.setState({todoItem: event.target.value});
	}

	addTask (event) {
		event.preventDefault(); 
		let id = new Date();
		let newTask = new Todo(this.state.todoItem, id);
		if(!this.state.server){
			this.pushNewTask(newTask)
		} else {
			server.emit('ADD_TASK', newTask);
		}
	}

	todoChanged(task){
		let newtodos = this.state.todos.map((todo)=> {
				if (todo.id == task.id){
					return todo = task; 
				} else {
					return todo;
				}
			})	
		this.updateState('TASK_CHANGED', newtodos);
	}

	removeTodo(id) {
		let updatedTodos = this.state.todos.filter(todo => todo.id !==id);

		this.updateState('TASK_DELETED', updatedTodos);

		// server.emit('TASK_DELETED', updatedTodos);
	 };

	 deleteAll(event){
	 	event.preventDefault(); 
	 	this.setState({
	 		todos: []
	 	})
	 }

	 completeAll(event){
	 	event.preventDefault(); 
	 	let newtodos = this.state.todos.map((todo)=> {
			todo.completed = true; 
			return todo;
		});
	    this.setState({
	    	todos: newtodos
	    });
	 }

	render(){
		 console.log('rerendering')
		return(
			<div>
				<div>
					{ this.state.server ? <form onSubmit={this.addTask.bind(this)}>
						<input placeholder="Add Todo Items" value={this.state.todoItem} onChange={this.handleChange.bind(this)} /> 
						<button type="submit" value="submit"> Add! </button> 
					</form> : <h5> Server Disconnected! </h5>


					}
					<button onClick={this.deleteAll.bind(this)}> Delete All </button> 
					<button onClick={this.completeAll.bind(this)}> Complete All </button> 
				</div>
				{ this.state.todos && this.state.todos.length ?
					<div>
						<Todos tasks={this.state.todos} toggleComplete={this.todoChanged.bind(this)} deleteTask={this.removeTodo.bind(this)}/>
					</div> :
					"No Todos Yet!"
				}
			</div>
			);
	}
}