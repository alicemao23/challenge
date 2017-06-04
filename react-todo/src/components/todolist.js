import React from 'react';
import Todo from './todoitem';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Checkbox from 'material-ui/Checkbox';


class TodoList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let _this = this;
        let listStyle = {
            padding: '0px',
            display: this.props.tasks.length ? 'block' : 'none'
        };

        var filterHandler = (todo) => {
            if (this.props.filters === 'all') {
                return true;
            }
            if (this.props.filters === 'completed') {
                return todo.completed;
            }

            if (this.props.filters === 'incompletes') {
                return !todo.completed;
            }
        };

        return (
            <List style={ listStyle }>
              { this.props.tasks.filter(filterHandler).map(function(todo, index) {
                    return <Todo deleteTask={ _this.props.deleteTask }
                             toggleComplete={ _this.props.toggleComplete }
                             key={ todo.id }
                             data={ todo }/>;
                }) }
            </List>
            );
    }
}
export default TodoList;