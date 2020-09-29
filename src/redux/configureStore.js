import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Days } from './days.js'
import { Movies } from './movies.js'
import { Auth } from './auth'
import { Favourites } from './favourites'

export const ConfigureStore = () => {
	const store = createStore(
		combineReducers({
			days: Days,
			movies: Movies,
			auth: Auth,
			favourites: Favourites
		}),

		applyMiddleware(thunk, logger)
		);

	return store;
}