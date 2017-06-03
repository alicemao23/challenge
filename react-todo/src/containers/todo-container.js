import React, { Component } from 'react';
import Todos from '../components/todolist';
import Todo from '../todo';
const io = require('socket.io-client') 
const server = io('http://localhost:3003/');


export default class TodoContainer extends Component {
	constructor () {
		super();
		console.log('refreshed');
		this.state= {
			todoItem: '',
			todos: [], 
		}
		server.on('initial_List', (DB)=> {
			this.setState({todos: DB})
		}); 

		server.on('task_Changed', (todos) =>{
			// console.log('this is new tasks', todos);
			this.setState({
				todos: todos
			})
		});

		server.on('task_added', (task) => {
			this.setState(prevState => ({
		        todos: [...prevState.todos, task],
		        todoItem: ''
		    }));
		})

		server.on('task_deleted', (tasks) => {
			this.setState({
				todos: tasks
			})
		})
	}

	componentWillMount() {

	}

	handleChange(event) {
		this.setState({todoItem: event.target.value});
	}

	addTask (event) {
		event.preventDefault(); 
		let id = new Date();
		let newTask = new Todo(this.state.todoItem, id);
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
		server.emit('TASK_CHANGED', newtodos);
	}

	removeTodo(id) {
		let updatedTodos = this.state.todos.filter(todo => todo.id !==id);
		server.emit('TASK_DELETED', updatedTodos);
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
		return(
			<div>
				<div>
					<form onSubmit={this.addTask.bind(this)}>
						<input placeholder="Add Todo Items" value={this.state.todoItem} onChange={this.handleChange.bind(this)} /> 
						<button type="submit" value="submit"> Add! </button> 
					</form> 
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