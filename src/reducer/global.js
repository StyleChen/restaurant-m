import { combineReducers } from 'redux';

function mask(state=false, action) {
  switch(action.type) {
    case 'GLOBAL_MASK_CHANGE':
      return action.payload;
    default:
      return state;
  }
}

function message(state=false, action) {
  switch(action.type) {
    case 'GLOBAL_MESSAGE_CHANGE':
      return action.payload;
    default:
      return state;
  }
}

function is_fetching(state=false, action) {
  switch(action.type) {
    case 'GLOBAL_DATA_FETCHING':
      return action.payload;
    default:
      return state;
  }
}

function once(state=true, action) {
  switch(action.type) {
    case 'GLOBAL_ONCE_CHANGE':
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
  mask,
  message,
  is_fetching,
  once
})