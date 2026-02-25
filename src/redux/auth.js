import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';

export const loginUser = createAsyncThunk('auth/loginUser', async (creds, { rejectWithValue }) => {
	const response = await fetch(fetchUrl + '/users/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(creds)
	});
	if (!response.ok) {
		return rejectWithValue('Error ' + response.status + ': ' + response.statusText);
	}
	const data = await response.json();
	if (!data.success) {
		return rejectWithValue(data.status || 'Login failed');
	}
	localStorage.setItem('token', data.token);
	localStorage.setItem('creds', JSON.stringify(creds));
	return data;
});

export const signupUser = createAsyncThunk('auth/signupUser', async (creds, { rejectWithValue }) => {
	const response = await fetch(fetchUrl + '/users/signup', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(creds)
	});
	if (!response.ok) {
		return rejectWithValue('Error ' + response.status + ': ' + response.statusText);
	}
	const data = await response.json();
	if (!data.success) {
		return rejectWithValue(data.status || 'Signup failed');
	}
	return data;
});

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
		clearAuthError(state) {
			state.errMess = null;
		},
		logoutUser(state) {
			localStorage.removeItem('token');
			localStorage.removeItem('creds');
			state.isLoading = false;
			state.isAuthenticated = false;
			state.token = '';
			state.user = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state, action) => {
				state.isLoading = true;
				state.isAuthenticated = false;
				state.user = { ...action.meta.arg, password: '' };
				state.errMess = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.isAdmin = action.payload.isAdmin;
				state.errMess = '';
				state.token = action.payload.token;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.errMess = action.payload || action.error.message;
			})
			.addCase(signupUser.pending, (state, action) => {
				state.isLoading = true;
				state.isAuthenticated = false;
				state.user = action.meta.arg;
				state.errMess = null;
			})
			.addCase(signupUser.fulfilled, (state) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.errMess = '';
				state.token = '';
			})
			.addCase(signupUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.errMess = action.payload || action.error.message;
			});
	}
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export const Auth = authSlice.reducer;
