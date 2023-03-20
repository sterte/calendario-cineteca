import * as ActionTypes from './ActionTypes';


export const ChatResponses = (state = {isLoading: false, errMess: null, messages: [], conversationId: null}, action) => {
	switch(action.type) {
		case ActionTypes.ADD_CHAT_RESPONSE:
			var tmpMessages = state.messages;
			tmpMessages.push({role: action.payload.role, content: action.payload.content});
			return {...state, isLoading: false, errMess: null, messages: tmpMessages, conversationId: action.payload.conversationId}; 

		case ActionTypes.CHAT_RESPONSE_LOADING:
			return {...state, isLoading: true, errMess: null}; 

		case ActionTypes.CHAT_RESPONSE_FAILED:
			return {...state, isLoading: false, errMess: action.payload}; 


		case ActionTypes.RESET_CHAT_RESPONSE:
			return {...state, isLoading: false, errMess: action.payload, messages: [], conversationId: null}; 

		default:
			return state;
	}
}