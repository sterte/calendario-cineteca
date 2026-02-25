import { createSlice } from '@reduxjs/toolkit';

const favouritesSlice = createSlice({
	name: 'favourites',
	initialState: { isLoading: true, errMess: null, favourites: [] },
	reducers: {
		favouritesLoading(state) {
			state.isLoading = true;
			state.errMess = null;
			state.favourites = [];
		},
		addFavourites(state, action) {
			state.isLoading = false;
			state.errMess = null;
			state.favourites = action.payload;
		},
		favouritesFailed(state, action) {
			state.isLoading = false;
			state.errMess = action.payload;
			state.favourites = [];
		}
	}
});

export const { favouritesLoading, addFavourites, favouritesFailed } = favouritesSlice.actions;
export const Favourites = favouritesSlice.reducer;
