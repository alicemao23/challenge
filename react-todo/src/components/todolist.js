import React from 'react';
import Todo from './todoitem';

export default function TodoList (props) {
		return(
			<div>
				{props.tasks.map(task=> <Todo taskInfo={task}/>)}
			</div>
		)

}

