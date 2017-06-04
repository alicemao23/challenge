import React from 'react';
import { ListItem, Divider, Checkbox, TextField } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';
import { trim, isFunction, clone } from 'lodash';
// import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';


class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDelete: false,
            itemStyle: this.getTodoStyle(this.props.data.completed, true),
            txtStyle: this.getEditStyle(false)
        };
        this.props.deleteTask.bind(this)
    }

    componentWillReceiveProps(nextProps){
    	this.setState({
    		itemStyle: this.getTodoStyle(nextProps.data.completed, true)
    	})
    }

    getTodoStyle(completed, shouldDisplay) {
        let itemStyle = {
            display: shouldDisplay ? 'block' : 'none',
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
            textDecoration: completed ? 'line-through' : 'none',
            color: completed ? Colors.grey500 : Colors.black
        };
        return itemStyle;
    }

    checkTask(e, checked) {
        this.setState({
            itemStyle: this.getTodoStyle(checked, true)
        });
        if (isFunction(this.props.toggleComplete)) {
	        let newTodo = clone(this.props.data);
	        newTodo.completed = checked;
	        this.props.toggleComplete(newTodo);
    	}
    }

    getEditStyle(shouldDisplay) {
        let txtStyle = {
            display: shouldDisplay ? 'block' : 'none',
            padding: '16px 16px 11px 60px',
            boxSizing: 'border-box'
        };
        return txtStyle;
    }

    showDelete() {
        this.setState({showDelete: true});
    }

    hideDelete() {
        this.setState({showDelete: false});
    }
    enableEdit() {
        this.setState({
            itemStyle: this.getTodoStyle(this.props.data.completed, false),
            txtStyle: this.getEditStyle(true)
        });
    }

    saveEdit(e) {
        if(e.type === 'keydown' && e.nativeEvent.keyCode !== 13){
            return;
        }
        if (!trim(this.refs.txt.getValue())) {
            return;
        }
        this.setState({
            itemStyle: this.getTodoStyle(this.props.data.completed, true),
            txtStyle: this.getEditStyle(false)
        });
        if(e.type === 'keydown' && e.nativeEvent.keyCode === 13){
        	if (isFunction(this.props.editTask)) {
	            var newTodo = clone(this.props.data);
	            newTodo.title = this.refs.txt.getValue();
	            this.props.editTask(newTodo);
        	}
        }
    }
     render() {
        let delBtnStyle = {
            display: this.state.showDelete ? 'block' : 'none'
        };
        let underlineStyle = {marginLeft: '-60px', bottom: '0px'};


		return (

			<div>
	              <ListItem 
	              	onMouseEnter={ this.showDelete.bind(this) }
	                onMouseLeave={ this.hideDelete.bind(this) }
	                style={ this.state.itemStyle }
	                primaryText={ this.props.data.title }
	                leftIcon={ <Checkbox style={{width: "35px"}} onCheck={ this.checkTask.bind(this) } defaultChecked={ this.props.data.completed } /> }
	                rightIconButton={ <IconButton style={ delBtnStyle } iconClassName="material-icons" onClick={() => this.props.deleteTask.bind(this)(this.props.data.id)}>delete</IconButton> }
	                onDoubleClick={ this.enableEdit.bind(this) }
	                ></ListItem>
	                <TextField ref='txt'
		                // id={ this.props.data.id }
		                style={ this.state.txtStyle }
		                underlineStyle={ underlineStyle }
		                fullWidth={ true }
		                defaultValue={ this.props.data.title }
		                onBlur={ this.saveEdit.bind(this) }
		                onKeyDown={ this.saveEdit.bind(this) }></TextField>
	              <Divider />
	            </div>
			)
	}
}


export default Todo;