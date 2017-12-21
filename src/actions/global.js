export function changeMaskState(bool) {
  return {
    type: 'GLOBAL_MASK_CHANGE',
    payload: bool
  }
}

export function changeMessageState(bool) {
  return {
    type: 'GLOBAL_MESSAGE_CHANGE',
    payload: bool
  }
}

export function isFetching(bool) {
  return {
    type: 'GLOBAL_DATA_FETCHING',
    payload: bool
  }
}

export function changeOnce(bool) {
  return {
    type: 'GLOBAL_ONCE_CHANGE',
    payload: bool
  }
}