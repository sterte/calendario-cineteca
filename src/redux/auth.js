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

export const requestPasswordReset = createAsyncThunk('auth/requestPasswordReset', async (email, { rejectWithValue }) => {
	const response = await fetch(fetchUrl + '/users/reset-request', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email })
	});
	if (!response.ok) {
		return rejectWithValue('Error ' + response.status + ': ' + response.statusText);
	}
	return response.json();
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, newPassword }, { rejectWithValue }) => {
	const response = await fetch(fetchUrl + '/users/reset-password', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token, newPassword })
	});
	if (!response.ok) {
		return rejectWithValue('Error ' + response.status + ': ' + response.statusText);
	}
	const data = await response.json();
	if (!data.success) {
		return rejectWithValue(data.err || 'Reset failed');
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
		errMess: null,
		signupSuccess: false,
		resetStatus: null,   // null | 'sent' | 'done'
		resetErrMess: null
	},
	reducers: {
		clearAuthError(state) {
			state.errMess = null;
		},
		clearSignupSuccess(state) {
			state.signupSuccess = false;
		},
		clearResetStatus(state) {
			state.resetStatus = null;
			state.resetErrMess = null;
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
				state.signupSuccess = true;
			})
			.addCase(signupUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.errMess = action.payload || action.error.message;
			})
			.addCase(requestPasswordReset.pending, (state) => {
				state.isLoading = true;
				state.resetStatus = null;
				state.resetErrMess = null;
			})
			.addCase(requestPasswordReset.fulfilled, (state) => {
				state.isLoading = false;
				state.resetStatus = 'sent';
			})
			.addCase(requestPasswordReset.rejected, (state, action) => {
				state.isLoading = false;
				state.resetStatus = null;
				state.resetErrMess = action.payload || action.error.message;
			})
			.addCase(resetPassword.pending, (state) => {
				state.isLoading = true;
				state.resetStatus = null;
				state.resetErrMess = null;
			})
			.addCase(resetPassword.fulfilled, (state) => {
				state.isLoading = false;
				state.resetStatus = 'done';
			})
			.addCase(resetPassword.rejected, (state, action) => {
				state.isLoading = false;
				state.resetStatus = null;
				state.resetErrMess = action.payload || action.error.message;
			});
	}
});

export const { logoutUser, clearAuthError, clearSignupSuccess, clearResetStatus } = authSlice.actions;
export const Auth = authSlice.reducer;
