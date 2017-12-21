// import { isFetching } from './global';

export function receiveFoodList(data) {
  return {
    type: 'RECEIVE_FOOD_LIST',
    payload: data
  }
}

export function requestStart() {
  return {
    type: 'START',
  }
}

export function changeFoodNumber(foodid, foodnumber, foodlist) {
  foodlist.forEach(item => {
    item.productList.forEach(product => {
      if (product.rf_id === foodid) {
        Object.assign(product, { rf_number: foodnumber});
      }
    });
  });
  return {
    type: 'CHANGE_FOOD_NUMBER',
    payload: foodlist,
  }
}

export const fetchFoodList = (params) => (dispatch) => {
  dispatch(requestStart());
  return fetch('/Restaurant/Client/FoodList', {
    method: 'post',
    body: JSON.stringify(params),
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
    .then(res => {
      const data = res.result;
      data.forEach(item => {
        item.productList.forEach(product => {
          Object.assign(product, { rf_number: 0});
        });
      });
      dispatch(receiveFoodList(data));
    })
}

export const clearOrder = (list) => (dispatch) => {
  list.forEach(item => {
    item.productList.forEach(product => {
      Object.assign(product, { rf_number: 0});
    });
  });
  dispatch(receiveFoodList(list));
}
