const initial_list = [];

function foodList(state=initial_list, action) {
  switch(action.type) {
    case 'RECEIVE_FOOD_LIST':
      return action.payload
    case 'CHANGE_FOOD_NUMBER':
      return initial_list.concat(action.payload)
    default: 
      return state;
  }
}

export default foodList;