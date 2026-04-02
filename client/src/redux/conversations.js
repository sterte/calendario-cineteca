import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';

export const fetchConversations = createAsyncThunk('conversations/fetchConversations', async () => {
	const bearer = 'Bearer ' + localStorage.getItem('token');
	const response = await fetch(fetchUrl + '/chat/previousConversations', {
		method: 'GET',
		headers: { 'Authorization': bearer, 'Content-Type': 'application/json' }
	});
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	return response.json();
});

export const deleteConversation = createAsyncThunk('conversations/deleteConversation', async (conversationId) => {
	const bearer = 'Bearer ' + localStorage.getItem('token');
	const response = await fetch(fetchUrl + '/chat/previousConversations', {
		method: 'DELETE',
		headers: { 'Authorization': bearer, 'Content-Type': 'application/json' },
		body: JSON.stringify({ conversationId })
	});
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	return response.json();
});

const conversationsSlice = createSlice({
	name: 'conversations',
	initialState: { isLoading: false, errMess: null, conversations: [] },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchConversations.pending, (state) => {
				state.isLoading = true;
				state.errMess = null;
			})
			.addCase(fetchConversations.fulfilled, (state, action) => {
				state.isLoading = false;
				state.conversations = action.payload;
			})
			.addCase(fetchConversations.rejected, (state, action) => {
				state.isLoading = false;
				state.errMess = action.error.message;
			})
			.addCase(deleteConversation.pending, (state) => {
				state.isLoading = true;
				state.errMess = null;
			})
			.addCase(deleteConversation.fulfilled, (state, action) => {
				// use action.meta.arg (the conversationId passed to the thunk) for reliable filtering
				state.isLoading = false;
				state.conversations = state.conversations.filter(el => el.value !== action.meta.arg);
			})
			.addCase(deleteConversation.rejected, (state, action) => {
				state.isLoading = false;
				state.errMess = action.error.message;
			});
	}
});

export const Conversations = conversationsSlice.reducer;
