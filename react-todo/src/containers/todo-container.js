import React, { Component } from 'react';
import Todos from '../components/todolist';
const io = require('socket.io-client') 
const server = io('http://localhost:3003/');

export default class TodoContainer extends Component {
	constructor () {
		super();

		this.state= {
			todoItem: '',
			todos: []
		}
		server.on('initialList', (DB)=> {
			this.setState({todos: DB})
		}); 
		this.handleChange = this.handleChange.bind(this);
		this.addTask = this.addTask.bind(this);
	}

	componentWillMount() {
		// server.on('initialList', (DB)=> {
		// 	this.setState({todos: DB})
		// }); 
	}

	handleChange(event) {
		this.setState({todoItem: event.target.value});
	}

	addTask () {

	}

	retrieveTodoList () {

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
				</div>
				{ this.state.todos && this.state.todos.length ?
					<div>
						<Todos tasks={this.state.todos}/>
					</div> :
					"error"
				}
			</div>
			);
	}
}