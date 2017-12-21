import { combineReducers } from 'redux';
import shop from './shop';
import global from './global';

export default combineReducers({
  shopList: shop,
  global
});