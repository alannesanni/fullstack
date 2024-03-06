import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice ({
  name: 'notification',
  initialState: '',
  reducers: {
    notificationChange(state, action){
        return action.payload
    }
    },
  })

export const { notificationChange} = notificationSlice.actions

export const setNotification = (text, sec) => {
  return async dispatch => {
    const time = sec * 1000
    dispatch(notificationChange(text))
    setTimeout(() => {dispatch(notificationChange(''))}, time)
  }
}

export default notificationSlice.reducer