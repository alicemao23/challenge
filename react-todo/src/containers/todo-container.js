import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Grid, Row, Col, Button, PageHeader, Panel, } from 'react-bootstrap';
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
			this.setState({
				server: true
			})
			this.retrieveData();
		})

		server.on('reconnection_established', (tasks)=> {
			this.setState({
				todos: tasks
			})
		})

		server.once('connect_error', () => {
			if(this.state.server){
				this.setState({
					server: false
				})
			} 
			this.retrieveCached();

		})

		server.on('disconnect', () => {
				this.setState({
					server: false
				})
			localStorage.setItem('list', JSON.stringify(this.state.todos));
		})

		server.on('initial_List', (DB)=> {
			this.setState({todos: DB, server: true})
		}); 

		server.on('task_changed', (todos) =>{
			this.modifyTodoState(todos)
		});

		server.on('task_added', (task) => {
			console.log(task)
		    this.pushNewTask(task)
		})

		server.on('task_deleted', (tasks) => {
			this.modifyTodoState(tasks)
		})

	}	

	retrieveCached(){
		let cachedTodos = JSON.parse(localStorage.getItem('list'));
		if(cachedTodos.length > 0){
				this.setState({
					todos: cachedTodos
				})
		}
	}
	retrieveData () {
		let cachedTodos = JSON.parse(localStorage.getItem('list'));
		//check to see user was previously connected to server and saved cached
			if(cachedTodos  === null||cachedTodos.length === 0){
				server.emit('GET_INITIAL_TASK')
			}else if(cachedTodos.length > 0){
				server.emit('RECONNECTED')
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
		console.log('adding')
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
				if (todo.id === task.id){
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
	 	this.updateState('ALL_TASK_DELETED', [])
	 }

	 completeAll(event){
	 	event.preventDefault(); 
	 	let newtodos = this.state.todos.map((todo)=> {
			todo.completed = true; 
			return todo;
		});
		this.updateState('TASK_CHANGED', newtodos);
	 }

	 toggleFilter(event) {
	 	//Added Toggle UI for Users to quickly look through completed/Incomplete tasks 
	 	event.preventDefault();
    	this.setState({filter: event.target.value});
	 }

	 editTask(task){
		let newtodos = this.state.todos.map((todo)=> {
				if (todo.id === task.id){
					todo.title = task.title; 
					todo.completed = false;
					return todo
				} else {
					return todo;
				}
			})	
	 	this.updateState('TASK_CHANGED', newtodos);
	 }
	render(){
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
							<form onSubmit={this.addTask.bind(this)}>
								<Col mdOffset={1} md={8} xsOffset={1} xs={7}> 
									
									<TextField hintText="new tasks here"
						                fullWidth={ true }
						                value={ this.state.todoItem }
						                onChange= {this.handleChange.bind(this)}
						                style={ inputStyle }
						                underlineStyle={ underlineStyle }
						                />
					            </Col>
					            <Col md={2} xs={2}> 
					            	<Button type="submit" value="submit"  disabled={!this.state.todoItem} bsStyle="info">Add Task!</Button>
					            </Col>
			            	</form>
			              </div>
			                : 
		
			            <h5> Server Disconnected! </h5>
					}
				</Row>
				{ this.state.todos && this.state.todos.length ?
					<Col mdOffset={1} md={10} sm={12} className="todo-container">
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
						<Todos filters={this.state.filter} tasks={this.state.todos} toggleComplete={this.todoChanged.bind(this)} deleteTask={this.removeTodo.bind(this)} editTask={this.editTask.bind(this)}/>
					</Col>
					:
					<Col mdOffset={1} md={10} className="todo-container">
					<PageHeader>No More Tasks!</PageHeader>
					</Col>

				}
				</Grid>
			</div>
			);
	}
}