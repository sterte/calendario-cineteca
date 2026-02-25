import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		isLoading: false,
		isAuthenticated: localStorage.getItem('token') ? true : false,
		token: localStorage.getItem('token'),
		user: localStorage.getItem('creds') ? JSON.parse(localStorage.getItem('creds')) : null,
		errMess: null
	},
	reducers: {
		requestLogin(state, action) {
			state.isLoading = true;
			state.isAuthenticated = false;
			state.user = { ...action.payload, password: '' };
		},
		receiveLogin(state, action) {
			state.isLoading = false;
			state.isAuthenticated = true;
			state.isAdmin = action.payload.isAdmin;
			state.errMess = '';
			state.token = action.payload.token;
		},
		loginError(state, action) {
			state.isLoading = false;
			state.isAuthenticated = false;
			state.errMess = action.payload;
		},
		requestLogout(state) {
			state.isLoading = true;
			state.isAuthenticated = false;
		},
		receiveLogout(state) {
			state.isLoading = false;
			state.isAuthenticated = false;
			state.token = '';
			state.user = null;
		},
		requestSignup(state, action) {
			state.isLoading = true;
			state.isAuthenticated = false;
			state.user = action.payload;
		},
		receiveSignup(state) {
			state.isLoading = false;
			state.isAuthenticated = false;
			state.errMess = '';
			state.token = '';
		},
		signupError(state, action) {
			state.isLoading = false;
			state.isAuthenticated = false;
			state.errMess = action.payload;
		}
	}
});

export const { requestLogin, receiveLogin, loginError, requestLogout, receiveLogout, requestSignup, receiveSignup, signupError } = authSlice.actions;
export const Auth = authSlice.reducer;
