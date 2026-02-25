import { createSlice } from '@reduxjs/toolkit';

const conversationsSlice = createSlice({
	name: 'conversations',
	initialState: { isLoading: false, errMess: null, conversations: [] },
	reducers: {
		conversationsLoading(state) {
			state.isLoading = true;
			state.errMess = null;
		},
		addConversations(state, action) {
			state.isLoading = false;
			state.errMess = null;
			state.conversations = action.payload;
		},
		conversationsFailed(state, action) {
			state.isLoading = false;
			state.errMess = action.payload;
			state.conversations = [];
		},
		conversationDeleted(state, action) {
			state.isLoading = false;
			state.errMess = null;
			state.conversations = state.conversations.filter(el => el.value !== action.payload.conversationId);
		}
	}
});

export const { conversationsLoading, addConversations, conversationsFailed, conversationDeleted } = conversationsSlice.actions;
export const Conversations = conversationsSlice.reducer;
