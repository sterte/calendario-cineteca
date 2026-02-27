import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';

export const fetchChatResponse = createAsyncThunk(
	'chatResponses/fetchChatResponse',
	async ({ conversationId, title, lastMessage, charachter, temperature, requestType, movieTitle, year }, { dispatch, getState }) => {
		// Optimistic update: add user message immediately
		dispatch(addChatResponse({
			conversationId,
			content: lastMessage,
			role: 'user',
			timestamp: new Date().getTime(),
			title
		}));
		const bearer = 'Bearer ' + localStorage.getItem('token');
		const body = {
			conversationId,
			charachter: charachter || 'cinefilo',
			temperature: Number(temperature),
			question: lastMessage,
			title,
			requestType,
			movieTitle,
			year
		};
		const response = await fetch(fetchUrl + '/chat/prompt', {
			method: 'POST',
			headers: { 'Authorization': bearer, 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
		return response.json();
	}
);

export const fetchConversationLog = createAsyncThunk('chatResponses/fetchConversationLog', async (conversationId) => {
	const bearer = 'Bearer ' + localStorage.getItem('token');
	const response = await fetch(fetchUrl + '/chat/conversationLog', {
		method: 'POST',
		headers: { 'Authorization': bearer, 'Content-Type': 'application/json' },
		body: JSON.stringify({ conversationId })
	});
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	return response.json();
});

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
			if (action.payload.title) {
				state.title = action.payload.title;
			}
		},
		resetChatResponse(state) {
			state.isLoading = false;
			state.errMess = null;
			state.messages = [];
			state.conversationId = null;
			state.totalTokenCount = 0;
			state.title = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchChatResponse.pending, (state) => {
				state.isLoading = true;
				state.errMess = null;
			})
			.addCase(fetchChatResponse.fulfilled, (state, action) => {
				state.isLoading = false;
				state.messages.push({
					role: action.payload.role,
					content: action.payload.content,
					timestamp: action.payload.timestamp,
					tokenCount: action.payload.tokenCount
				});
				if (action.payload.tokenCount) {
					state.totalTokenCount += action.payload.tokenCount;
				}
				state.conversationId = action.payload.conversationId;
			})
			.addCase(fetchChatResponse.rejected, (state, action) => {
				state.isLoading = false;
				state.errMess = action.error.message;
			})
			.addCase(fetchConversationLog.pending, (state) => {
				state.isLoading = true;
				state.errMess = null;
			})
			.addCase(fetchConversationLog.fulfilled, (state, action) => {
				state.isLoading = false;
				state.messages = action.payload.messages;
				state.conversationId = action.payload.conversationId;
				state.totalTokenCount = 0;
				state.title = action.payload.title;
			})
			.addCase(fetchConversationLog.rejected, (state, action) => {
				state.isLoading = false;
				state.errMess = action.error.message;
			});
	}
});

export const { addChatResponse, resetChatResponse } = chatResponsesSlice.actions;
export const ChatResponses = chatResponsesSlice.reducer;
