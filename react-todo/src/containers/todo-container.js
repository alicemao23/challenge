import React, { Component } from 'react';
import Todos from '../components/todolist';

export default class TodoContainer extends Component {
	constructor () {
		super();

		this.state= {
			todos: []
		}
	}
	render(){
		return(
			<div>
				<div>
					<form>
						<input placeholder="Add Todo Items" /> 
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