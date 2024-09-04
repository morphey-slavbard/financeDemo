import { combineReducers } from "redux"
import userReducer from './user'
import settingsReducer from './settings.js'

const reducers = combineReducers({
  user: userReducer,
  settings: settingsReducer
});

export default reducers
