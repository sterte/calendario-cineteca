import * as ActionTypes from './ActionTypes';


export const Conversations = (state = {isLoading: false, errMess: null, conversations: []}, action) => {
	switch(action.type) {
		case ActionTypes.ADD_CONVERSATIONS:
			return {...state, isLoading: false, errMess: null, conversations: action.payload}; 

		case ActionTypes.CONVERSATIONS_LOADING:
			return {...state, isLoading: true, errMess: null}; 

		case ActionTypes.CONVERSATIONS_FAILED:
			return {...state, isLoading: false, errMess: action.payload, conversations: []}; 

		case ActionTypes.CONVERSATION_DELETED:
			let tmpConversations = [];
			for(let el of state.conversations){
				if(el.value !== action.payload.conversationId){
					tmpConversations.push(el);
				}
			}
			return {...state, isLoading: false, errMess: null, conversations: tmpConversations}

		default:
			return state;
	}
}