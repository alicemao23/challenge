import React from 'react';
import { ListItem, Divider, TextField, Checkbox } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';
import { isFunction, clone, trim } from 'lodash';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';


class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDelete: false,
            itemStyle: this._getItemStyle(this.props.data.completed, true),
            // txtStyle: this._getTextStyle(false)
        };
        this.props.deleteTask.bind(this)
    }

    componentWillReceiveProps(nextProps){
    	this.setState({
    		itemStyle: this._getItemStyle(nextProps.data.completed, true)
    	})
    	console.log('prop updated', nextProps)
    }

    _getItemStyle(completed, shouldDisplay) {
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
            itemStyle: this._getItemStyle(checked, true)
        });
        let newTodo = clone(this.props.data);
        newTodo.completed = checked;
        this.props.toggleComplete(newTodo);
    }

    // _getTextStyle(shouldDisplay) {
    //     let txtStyle = {
    //         display: shouldDisplay ? 'block' : 'none',
    //         padding: '16px 16px 11px 60px',
    //         boxSizing: 'border-box'
    //     };
    //     return txtStyle;
    // }

    _showDeleteBtn(e) {
        this.setState({showDelete: true});
    }

    _hideDeleteBtn(e) {
        this.setState({showDelete: false});
    }

    // _onDeleteItem(e) {
    //     if (!isFunction(this.props.onDelete)) {
    //         return;
    //     }
    //     this.props.onDelete(this.props.data.id);
    // }

    // _runInEdit() {
    //     this.setState({
    //         itemStyle: this._getItemStyle(this.props.data.completed, false),
    //         txtStyle: this._getTextStyle(true)
    //     });
    // }

    // _saveEdit(e) {
    //     if(e.type === 'keydown' && e.nativeEvent.keyCode !== 13){
    //         return;
    //     }
    //     if (!trim(this.refs.txt.getValue())) {
    //         return;
    //     }
    //     this.setState({
    //         itemStyle: this._getItemStyle(this.props.data.completed, true),
    //         txtStyle: this._getTextStyle(false)
    //     });
    //     if (isFunction(this.props.onChange)) {
    //         var newTodo = clone(this.props.data);
    //         newTodo.text = this.refs.txt.getValue();
    //         this.props.onChange(newTodo);
    //     }
    // }
     render() {
        let delBtnStyle = {
            display: this.state.showDelete ? 'block' : 'none'
        };

		return (

			<div>
	              <ListItem 
	              	onMouseEnter={ this._showDeleteBtn.bind(this) }
	                onMouseLeave={ this._hideDeleteBtn.bind(this) }
	                style={ this.state.itemStyle }
	                primaryText={ this.props.data.title }
	                leftIcon={ <Checkbox style={{width: "35px"}} onCheck={ this.checkTask.bind(this) } defaultChecked={ this.props.data.completed } /> }
	                rightIconButton={ <IconButton style={ delBtnStyle } iconClassName="material-icons" onClick={() => this.props.deleteTask.bind(this)(this.props.data.id)}>delete</IconButton> }
	                // onDoubleClick={ this._runInEdit.bind(this) }
	                ></ListItem>

	              <Divider />
	            </div>
			)
	}
}


export default Todo;