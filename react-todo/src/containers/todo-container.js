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
		}
		server.on('initialList', (DB)=> {
			console.log('reloading');
			this.setState({todos: DB})
		}); 
		this.handleChange = this.handleChange.bind(this);
		this.addTask = this.addTask.bind(this);
		this.todoChanged = this.todoChanged.bind(this);
		this.removeTodo = this.removeTodo.bind(this);

	}

	componentWillMount() {
	}

	handleChange(event) {
		this.setState({todoItem: event.target.value});
	}

	addTask (event) {
		event.preventDefault(); 
		let lastId = this.state.todos.length;
		let newTask = new Todo(this.state.todoItem, lastId);
		lastId++;
		console.log('lastId', lastId);
		this.setState(prevState => ({
	        todos: [...prevState.todos, newTask],
	        todoItem: ''
	    }));
		
		server.emit('ADD_TASK', newTask);
	}

	todoChanged(task){
		let newtodos = this.state.todos.map((todo)=> {
				if (todo.id == task.id){
					return todo = task; 
				} else {
					return todo;
				}
			});

		this.setState({
			todos: newtodos
		})
	}

	removeTodo(id) {
		// event.preventDefault(); 

	    this.setState(prevState => ({
	      todos: prevState.todos.filter(todo => todo.id !== id),
	    }));
	 };

	render(){
		console.log(this.state.todos);
		return(
			<div>
				<div>
					<form onSubmit={this.addTask}>
						<input placeholder="Add Todo Items" value={this.state.todoItem} onChange={this.handleChange} /> 
						<button type="submit" value="submit"> Add! </button> 
					</form> 
				</div>
				{ this.state.todos && this.state.todos.length ?
					<div>
						<Todos tasks={this.state.todos} toggleComplete={this.todoChanged} deleteTask={this.removeTodo}/>
					</div> :
					"error"
				}
			</div>
			);
	}
}