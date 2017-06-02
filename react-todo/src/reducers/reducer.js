import { List } from 'immutable';

let id = 0;
const initialState = { items:List([])}


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'ADD_TASK':
        return {
            ...state,
            items:state.items.push({id:action.itemId,item:action.item,completed:action.completed})
        } 	

    case 'COMPLETED_TASK':
	  return {
        ...state,
        items:state.items.update( action.itemId-1,(value)=> {
           return {...value,completed:  action.completed}
        })
      }
    case 'INITIAL_TASKS':
    return {
        ...state,
        items:List(action.items)
      }
    default:
      return state
  }
}


export default reducer