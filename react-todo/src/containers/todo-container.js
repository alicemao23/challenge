import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Grid, Row, Col, Button, PageHeader, Panel, DropdownButton, MenuItem } from 'react-bootstrap';
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
			server: '', 
			filter: 'all'
		}
		server.on('connect', () => {
			if(this.state.server === false) {
				this.setState({
					server: true
				})
				server.emit('RECONNECTED', this.state.todos);
			} else if (this.state.server == '') {
				this.retrieveData();
			}
		})

		server.on('reconnection_established', (tasks)=> {
			this.setState({
				todos: tasks
			})
		})

		server.once('connect_error', () => {
			if(this.state.server){
				this.retrieveData();
				this.setState({
					server: false
				})
			}
		})

		server.on('disconnect', () => { 
			if(this.state.server){
				this.state.server = false
			}
			localStorage.setItem('list', JSON.stringify(this.state.todos));
		})

		server.on('initial_List', (DB)=> {
			this.setState({todos: DB, server: true})
		}); 

		server.on('task_changed', (todos) =>{
			this.modifyTodoState(todos)
		});

		server.on('task_added', (task) => {
		    this.pushNewTask(task)
		})

		server.on('task_deleted', (tasks) => {
			this.modifyTodoState(tasks)

		})
	}	
	retrieveData () {
		let cachedTodos = JSON.parse(localStorage.getItem('list'));
		//check to see if server is connected 
		//if server is connected && have ran before, retrieve data from cache
			if(cachedTodos  === null||cachedTodos.length === 0){
				console.log('this is null')
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

	 toggleFilter(event) {
	 	event.preventDefault();
	 	var value = event.target.value;
    	console.log(value, " was selected");
    	this.setState({filter: event.target.value});
	 }
	render(){
		 console.log('rerendering');
		 let inputStyle = {
            padding: '16px 16px 11px 60px',
            boxSizing: 'border-box'
        };
        let underlineStyle = {marginLeft: '-60px', bottom: '0px'};
		return(
			<div>
				<Grid className="body-container">
					<Row>
					{ this.state.server ?
						<div>
						<Col mdOffset={1} md={8}> 
							<form onSubmit={this.addTask.bind(this)}>
							<TextField hintText="What needs to be done?"
				                fullWidth={ true }
				                value={ this.state.todoItem }
				                onChange= {this.handleChange.bind(this)}
				                style={ inputStyle }
				                underlineStyle={ underlineStyle }
				                />
				            </form>
			            </Col>
			            <Col md={2}> 
			            	<Button type="submit" value="submit"  disabled={!this.state.todoItem} bsStyle="info">Add Task!</Button>
			            </Col>
			            </div>
			                : 
		
			            <h5> Server Disconnected! </h5>
					}
				</Row>
				{ this.state.todos && this.state.todos.length ?
					<Col mdOffset={1} md={10} className="todo-container">
						<PageHeader>Your Todo List</PageHeader>
						<Panel>
							<select className="btn btn-default filter-selector" onChange={this.toggleFilter.bind(this)}> 
								<option value="all"> Show All </option> 
								<option value="completed"> Show Completed </option> 
								<option value="incompletes"> Show Incompletes </option> 

							</select>
						    <Button onClick={this.deleteAll.bind(this)}> Delete All </Button> 
							<Button onClick={this.completeAll.bind(this)}> Complete All </Button> 
						</Panel>
						<Todos filters={this.state.filter} tasks={this.state.todos} toggleComplete={this.todoChanged.bind(this)} deleteTask={this.removeTodo.bind(this)}/>
					</Col>
					// </div> 
					:
					"No Todos Yet!"
				}
				</Grid>
			</div>
			);
	}
}
         // <button type="submit" value="submit"  disabled={!this.state.todoItem}> Add! </button> 

	// { this.state.server ? <form onSubmit={this.addTask.bind(this)}>
					// 	<input placeholder="Add Todo Items" value={this.state.todoItem} onChange={this.handleChange.bind(this)} /> 
					// 	<button type="submit" value="submit"> Add! </button> 
					// </form> : <h5> Server Disconnected! </h5>
					// }