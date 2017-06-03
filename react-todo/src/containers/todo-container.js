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
			this.setState({todos: DB})
		}); 
		this.handleChange = this.handleChange.bind(this);
		this.addTask = this.addTask.bind(this);
		this.todoChanged = this.todoChanged.bind(this);
		this.removeTodo = this.removeTodo.bind(this);
		// this.deleteAll = this.deleteAll.bind(this);


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

	// _getItemStyle(completed, shouldDisplay) {
 //        let itemStyle = {
 //            display: shouldDisplay ? 'block' : 'none',
 //            MozUserSelect: 'none',
 //            WebkitUserSelect: 'none',
 //            msUserSelect: 'none',
 //            textDecoration: completed ? 'line-through' : 'none',
 //            color: completed ? Colors.grey500 : Colors.black
 //        };
 //        return itemStyle;
 //    }

	removeTodo(id) {
	    this.setState(prevState => ({
	      todos: prevState.todos.filter(todo => todo.id !== id),
	    }));
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
		console.log(this.state.todos);
		return(
			<div>
				<div>
					<form onSubmit={this.addTask}>
						<input placeholder="Add Todo Items" value={this.state.todoItem} onChange={this.handleChange} /> 
						<button type="submit" value="submit"> Add! </button> 
					</form> 
					<button onClick={this.deleteAll.bind(this)}> Delete All </button> 
					<button onClick={this.completeAll.bind(this)}> Complete All </button> 
				</div>
				{ this.state.todos && this.state.todos.length ?
					<div>
						<Todos tasks={this.state.todos} toggleComplete={this.todoChanged} deleteTask={this.removeTodo}/>
					</div> :
					"No Todos Yet!"
				}
			</div>
			);
	}
}