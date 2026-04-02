import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { Days } from './days.js'
import { Movies } from './movies.js'
import { Auth } from './auth'
import { Favourites } from './favourites'
import { Tracks } from './tracks'
import { TrackDetail } from './trackDetail'
import { ChatResponses } from './chatResponses.js';
import { Conversations } from './conversations.js';
import { ProviderReducer } from './provider.js';
import { LetterboxdReducer } from './letterboxd';
import { UserPrefsReducer } from './userPrefs';
import { TabsReducer } from './tabs';

export const ConfigureStore = () => {
	const store = configureStore({
		reducer: {
			days: Days,
			movies: Movies,
			auth: Auth,
			favourites: Favourites,
			tracks: Tracks,
			trackDetail: TrackDetail,
			chatResponses: ChatResponses,
			conversations: Conversations,
			provider: ProviderReducer,
			letterboxd: LetterboxdReducer,
			userPrefs: UserPrefsReducer,
			tabs: TabsReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(logger)
	});

	return store;
}