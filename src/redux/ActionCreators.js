import { fetchUrl } from '../shared/baseUrl';
import * as ActionTypes from './ActionTypes';


export const getDayProgram = (day) => (dispatch) => {
    dispatch(dayLoading(day))
    const url = fetchUrl + '/day/' + day;    
    return fetch(url)
    .then(res => res.json())
    .then(res => dispatch(addDay(res)))
    .catch((err) => {console.log(err); dispatch(dayFailed(day))});
}

export const dayLoading = (day) => ({
	type: ActionTypes.DAY_LOADING,
    payload: day
})

export const addDay = (dayMovies) => ({
    type: ActionTypes.ADD_DAY,
    payload: dayMovies
})

export const dayFailed = (day) => ({
	type: ActionTypes.DAY_FAILED,
    payload: day
})

export const getTracks = () => (dispatch) => {
    dispatch(tracksLoading(true))
    const url = fetchUrl + '/tracks';
    return fetch(url)
    .then(res => res.json())
    .then(tracks => dispatch(addTracks(tracks)))
    .catch((err) => console.log(err));
}

export const tracksLoading = () => ({
	type: ActionTypes.TRACKS_LOADING
})

export const addTracks = (tracks) => ({
    type: ActionTypes.ADD_TRACKS,
    payload: tracks
})

export const getTrackDetail = (trackId) => (dispatch) => {
    dispatch(trackDetailLoading(true))
    const url = fetchUrl + '/tracks/' + trackId;
    return fetch(url)
    .then(res => res.json())
    .then(tracks => dispatch(addTrackDetail(tracks)))
    .catch((err) => console.log(err));
}

export const trackDetailLoading = () => ({
	type: ActionTypes.TRACK_DETAIL_LOADING
})

export const addTrackDetail = (tracks) => ({
    type: ActionTypes.ADD_TRACK_DETAIL,
    payload: tracks
})


export const getMovieDetail = (categoryId, movieId, repeatId) => (dispatch) => {
    dispatch(movieLoading(true))
    var url= fetchUrl + '/movies/' + categoryId + '/' + movieId + '/' + repeatId;
    return fetch(url)
    .then(res => res.json())            
    .then(movie => dispatch(addMovie(movie)))
    .catch((err) => console.log(err));
}

export const movieLoading = () => ({
	type: ActionTypes.MOVIE_LOADING
})

export const addMovie = (program) => ({
    type: ActionTypes.ADD_MOVIE,
    payload: program
})


export const fetchFavourites = () => (dispatch) => {
    dispatch(favouritesLoading(true));

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(fetchUrl + '/favourites', {
        headers: {
            'Authorization': bearer
        },
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(favourites => dispatch(addFavourites(favourites)))
    .catch(error => dispatch(favouritesFailed(error.message)));
}


export const addFavourite = (fav) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(fetchUrl + '/favourites/', {
        method: 'POST',
        body: JSON.stringify(fav),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        credentials: "same-origin"
    })    
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(favourites => dispatch(fetchFavourites()))
    .catch(error => dispatch(favouritesFailed(error.message)));
}

export const editFavourite = (fav) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(fetchUrl + '/favourites/' + fav.id, {
        method: 'PUT',
        body: JSON.stringify(fav),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        credentials: "same-origin"
    })    
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(favourites => dispatch(fetchFavourites()))
    .catch(error => dispatch(favouritesFailed(error.message)));
}


export const deleteFavourite = (id) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(fetchUrl + '/favourites/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': bearer
        },
        credentials: "same-origin"
    })    
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(favourites => dispatch(fetchFavourites()))
    .catch(error => dispatch(favouritesFailed(error.message)));
}


export const favouritesLoading = () => ({
	type: ActionTypes.FAVOURITES_LOADING
})

export const addFavourites = (favourites) => ({
    type: ActionTypes.ADD_FAVOURITES,
    payload: favourites
})

export const favouritesFailed = (errmess) => ({
    type: ActionTypes.FAVOURITES_FAILED,
    payload: errmess
})


export const fetchImdb = (title, year) => (dispatch) => {
    dispatch(imdbLoading(true));
    return fetch("https://imdb8.p.rapidapi.com/auto-complete?q=" + title, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "imdb8.p.rapidapi.com",
            "x-rapidapi-key": "4eac66e9b5msh32881c1535a40e0p1d8ceajsn8f74f898d71d"
        }
    })    
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(response => {        
        let items = response.d.filter(el => el.l === title && (el.y && el.y === year));                  
        if(items.length === 0){
            items = response.d.filter(el => el.l === title && (el.y && el.y-1 === year));            
        }
        if(items.length === 0){
            items = response.d.filter(el => el.l === title && (el.y && el.y+1 === year));            
        }
        if(items.length === 0){
            items = response.d.filter(el => el.l === title || (el.y && el.y === year));  
        }
        if(items.length === 0){
            items = response.d.filter(el => el.l === title || (el.y && el.y-1 === year));
        }
        if(items.length === 0){
            items = response.d.filter(el => el.l === title || (el.y && el.y+1 === year));
        }

        let id = items[0].id;
        return id;
    })
    .then(id => {
        return fetch("https://imdb8.p.rapidapi.com/title/get-overview-details?tconst=" + id + "&currentCountry=IT", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "imdb8.p.rapidapi.com",
            "x-rapidapi-key": "4eac66e9b5msh32881c1535a40e0p1d8ceajsn8f74f898d71d"
        }
    })    
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(response => {return({imdbId: response.id, imdbRating: response.ratings.rating, imdbRatingCount: response.ratings.ratingCount })} )
    .then(imdb => dispatch(addImdb(imdb)))
    .catch(error => dispatch(imdbFailed(error.message)));
}

export const imdbLoading = () => ({
	type: ActionTypes.IMDB_LOADING
})

export const addImdb = (favourites) => ({
    type: ActionTypes.ADD_IMDB,
    payload: favourites
})

export const imdbFailed = (errmess) => ({
    type: ActionTypes.IMDB_FAILED,
    payload: errmess
})


export const fetchChatResponse = (conversationId, title, lastMessage, charachter, temperature) => (dispatch) => {
    dispatch(addChatResponse({conversationId: conversationId, content: lastMessage, role: "user", timestamp: new Date().getTime(), title: title}))
    dispatch(chatResponseLoading(true));

    const bearer = 'Bearer ' + localStorage.getItem('token');
    var body = {};
    body.conversationId = conversationId;
    body.charachter = charachter ? charachter : 'cinefilo';
    body.temperature = Number(temperature);
    body.question = lastMessage;
    body.title = title;
    return fetch(fetchUrl + '/chat/prompt', {
        "method": "POST",
        headers: {
            'Authorization': bearer,
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })    
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(response => {console.dir(response); dispatch(addChatResponse(response))})
    .catch(error => dispatch(chatResponseFailed(error.message)));
}


export const resetChatResponse = () => ({
	type: ActionTypes.RESET_CHAT_RESPONSE
})

export const chatResponseLoading = () => ({
	type: ActionTypes.CHAT_RESPONSE_LOADING
})

export const addChatResponse = (response) => ({
    type: ActionTypes.ADD_CHAT_RESPONSE,
    payload: response
})

export const chatResponseFailed = (errmess) => ({
    type: ActionTypes.CHAT_RESPONSE_FAILED,
    payload: errmess
})


export const fetchCharachters = () => (dispatch) => {
    dispatch(charachtersLoading(true))
    const url = fetchUrl + '/chat/charachters';
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(url, {
        "method": "GET",
        headers: {
            'Authorization': bearer,
            'Content-Type':'application/json'
        }
    })
    .then(res => res.json())
    .then(charachters => dispatch(addCharachters(charachters)))
    .catch((err) => dispatch(charachtersFailed(err.message)));
}

export const charachtersLoading = () => ({
	type: ActionTypes.CHARACHTERS_LOADING
})

export const addCharachters = (charachters) => ({
    type: ActionTypes.ADD_CHARACHTERS,
    payload: charachters
})


export const charachtersFailed = (errmess) => ({
    type: ActionTypes.CHARACHTERS_FAILED,
    payload: errmess
})

export const fetchConversations = () => (dispatch) => {
    dispatch(conversationsLoading(true))
    const url = fetchUrl + '/chat/previousConversations';
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(url, {
        "method": "GET",
        headers: {
            'Authorization': bearer,
            'Content-Type':'application/json'
        }
    })
    .then(res => res.json())
    .then(charachters => dispatch(addConversations(charachters)))
    .catch((err) => dispatch(conversationsFailed(err.message)));
}

export const conversationsLoading = () => ({
	type: ActionTypes.CONVERSATIONS_LOADING
})

export const addConversations = (conversations) => ({
    type: ActionTypes.ADD_CONVERSATIONS,
    payload: conversations
})


export const conversationsFailed = (errmess) => ({
    type: ActionTypes.CONVERSATIONS_FAILED,
    payload: errmess
})



export const fetchConversationLog = (conversationId) => (dispatch) => {
    dispatch(conversationLogLoading(true))
    const url = fetchUrl + '/chat/conversationLog';
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(url, {
        "method": "POST",
        headers: {
            'Authorization': bearer,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({conversationId: conversationId})
    })
    .then(res => res.json())
    .then(conversationLog => dispatch(addConversationLog(conversationLog)))
    .catch((err) => dispatch(conversationsFailed(err.message)));
}

export const conversationLogLoading = () => ({
	type: ActionTypes.CONVERSATIONLOG_LOADING
})

export const addConversationLog = (conversationLog) => ({
    type: ActionTypes.ADD_CONVERSATIONLOG,
    payload: conversationLog
})


export const conversationLogFailed = (errmess) => ({
    type: ActionTypes.CONVERSATIONLOG_FAILED,
    payload: errmess
})


export const deleteConversation = (conversationId) => (dispatch) => {
    dispatch(conversationsLoading(true))
    const url = fetchUrl + '/chat/previousConversations';
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(url, {
        "method": "DELETE",
        headers: {
            'Authorization': bearer,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({conversationId: conversationId})
    })
    .then(res => res.json())
    .then(conversationLog => dispatch(conversationDeleted(conversationLog)))
    .catch((err) => dispatch(conversationsFailed(err.message)));
}

export const conversationDeleted = (conversationLog) => ({
    type: ActionTypes.CONVERSATION_DELETED,
    payload: conversationLog
})


//USER
export const requestLogin = (creds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    }
}
  
export const receiveLogin = (response) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.token,
        isAdmin: response.isAdmin
    }
}
  
export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
}


export const requestSignup = (creds) => {
    return {
        type: ActionTypes.SIGNUP_REQUEST,
        creds
    }
}
  
export const receiveSignup = (response) => {
    return {
        type: ActionTypes.SIGNUP_SUCCESS,        
    }
}
  
export const signupError = (message) => {
    return {
        type: ActionTypes.SIGNUP_FAILURE,
        message
    }
}

export const loginUser = (creds) => (dispatch) => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))

    return fetch(fetchUrl + '/users/login', {
        method: 'POST',
        headers: { 
            'Content-Type':'application/json' 
        },
        body: JSON.stringify(creds)
    })
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
        },
        error => {
            throw error;
        })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            // If login was successful, set the token in local storage
            localStorage.setItem('token', response.token);
            localStorage.setItem('creds', JSON.stringify(creds));
            // Dispatch the success action
            //dispatch(fetchFavorites());
            dispatch(receiveLogin(response));
        }
        else {
            var error = new Error('Error ' + response.status);
            error.response = response;
            dispatch(loginError(response));
            throw error;
        }
    })
    .catch(error => dispatch(loginError(error.message)))
};

export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
}
  
export const receiveLogout = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
}

// Logs the user out
export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout())
    localStorage.removeItem('token');
    localStorage.removeItem('creds');
    //dispatch(favoritesFailed("Error 401: Unauthorized"));
    dispatch(receiveLogout())
}

export const signupUser = (creds) => (dispatch) => {
// We dispatch requestLogin to kickoff the call to the API
dispatch(requestSignup(creds))

return fetch(fetchUrl + '/users/signup', {
    method: 'POST',
    headers: { 
        'Content-Type':'application/json' 
    },
    body: JSON.stringify(creds)
})
.then(response => {
    if (response.ok) {
        return response;
    } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
    }
    },
    error => {
        throw error;
    })
.then(response => response.json())
.then(response => {
    if (response.success) {        
        dispatch(receiveSignup(response));
    }
    else {
        var error = new Error('Error ' + response.status);
        error.response = response;
        throw error;
    }
})
.catch(error => dispatch(signupError(error.message)))}

//USER END