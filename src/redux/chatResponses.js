import * as ActionTypes from './ActionTypes';


export const ChatResponses = (state = {isLoading: false, errMess: null, messages: [], conversationId: null, totalTokenCount: 0, title: null}, action) => {
	switch(action.type) {
		case ActionTypes.ADD_CHAT_RESPONSE:
			var tmpMessages = state.messages;
			tmpMessages.push({role: action.payload.role, content: action.payload.content, timestamp: action.payload.timestamp, tokenCount: action.payload.tokenCount});

			var tmpTotalTokenCount = action.payload.tokenCount ? state.totalTokenCount + action.payload.tokenCount : state.totalTokenCount;
			var tmpTitle = action.payload.title ? action.payload.title : state.title;
			return {...state, isLoading: false, errMess: null, messages: tmpMessages, conversationId: action.payload.conversationId, totalTokenCount: tmpTotalTokenCount, title: tmpTitle}; 

		case ActionTypes.CHAT_RESPONSE_LOADING:
		case ActionTypes.CONVERSATIONLOG_LOADING:
			return {...state, isLoading: true, errMess: null}; 

		case ActionTypes.CHAT_RESPONSE_FAILED:
		case ActionTypes.CONVERSATIONLOG_FAILED:
			return {...state, isLoading: false, errMess: action.payload}; 

		case ActionTypes.RESET_CHAT_RESPONSE:
			return {...state, isLoading: false, errMess: action.payload, messages: [], conversationId: null, totalTokenCount: 0, title: null }; 

		case ActionTypes.ADD_CONVERSATIONLOG:
			return {...state, isLoading: false, errMess: null, messages: action.payload.messages, conversationId: action.payload.conversationId, totalTokenCount: 0, title: action.payload.title}; 

		default:
			return state;
	}
}