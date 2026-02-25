import { createSlice } from '@reduxjs/toolkit';

const chatResponsesSlice = createSlice({
	name: 'chatResponses',
	initialState: { isLoading: false, errMess: null, messages: [], conversationId: null, totalTokenCount: 0, title: null },
	reducers: {
		addChatResponse(state, action) {
			state.messages.push({
				role: action.payload.role,
				content: action.payload.content,
				timestamp: action.payload.timestamp,
				tokenCount: action.payload.tokenCount
			});
			if (action.payload.tokenCount) {
				state.totalTokenCount += action.payload.tokenCount;
			}
			if (action.payload.title) {
				state.title = action.payload.title;
			}
			state.isLoading = false;
			state.errMess = null;
			state.conversationId = action.payload.conversationId;
		},
		chatResponseLoading(state) {
			state.isLoading = true;
			state.errMess = null;
		},
		conversationLogLoading(state) {
			state.isLoading = true;
			state.errMess = null;
		},
		chatResponseFailed(state, action) {
			state.isLoading = false;
			state.errMess = action.payload;
		},
		conversationLogFailed(state, action) {
			state.isLoading = false;
			state.errMess = action.payload;
		},
		resetChatResponse(state) {
			state.isLoading = false;
			state.errMess = null;
			state.messages = [];
			state.conversationId = null;
			state.totalTokenCount = 0;
			state.title = null;
		},
		addConversationLog(state, action) {
			state.isLoading = false;
			state.errMess = null;
			state.messages = action.payload.messages;
			state.conversationId = action.payload.conversationId;
			state.totalTokenCount = 0;
			state.title = action.payload.title;
		}
	}
});

export const { addChatResponse, chatResponseLoading, conversationLogLoading, chatResponseFailed, conversationLogFailed, resetChatResponse, addConversationLog } = chatResponsesSlice.actions;
export const ChatResponses = chatResponsesSlice.reducer;
