//Root Reducer
import { combineReducers } from 'redux';
import alert from './alert'
import auth from './auth'
import profile from './profile'

//combineReducers will have all reducers we create
export default combineReducers({
    alert,
    auth,
    profile
});