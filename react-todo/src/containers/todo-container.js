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
		this.handleChange = this.handleChange.bind(this);
		this.addTask = this.addTask.bind(this);
	}

	componentWillMount() {
		// server.on('load', DB); 
	}

	handleChange(event) {
		this.setState({movieSearch: event.target.value});
	}

	addTask () {

	}

	retrieveTodoList () {

	}
	render(){
		return(
			<div>
				<div>
					<form onSubmit={this.addTask}>
						<input placeholder="Add Todo Items" value={this.state.todoItem} onChange={this.handleChange} /> 
						<button type="submit" value="submit"> Add! </button> 
					</form> 
				</div>

				{
					<div>
						<Todos/>
					</div>
				}
			</div>
			);
	}
}