import { fetchUrl } from '../shared/baseUrl';
import { dayLoading, addDay, dayFailed } from './days';
import { movieLoading, addMovie, imdbLoading, addImdb, imdbFailed } from './movies';
import { favouritesLoading, addFavourites, favouritesFailed } from './favourites';
import { tracksLoading, addTracks } from './tracks';
import { trackDetailLoading, addTrackDetail } from './trackDetail';
import { addChatResponse, chatResponseLoading, chatResponseFailed, conversationLogLoading, conversationLogFailed, addConversationLog } from './chatResponses';
import { charachtersLoading, addCharachters, charachtersFailed } from './charachters';
import { conversationsLoading, addConversations, conversationsFailed, conversationDeleted } from './conversations';
import { requestLogin, receiveLogin, loginError, requestLogout, receiveLogout, requestSignup, receiveSignup, signupError } from './auth';

// Re-export sync action creators needed by components
export { resetChatResponse } from './chatResponses';


export const getDayProgram = (day) => (dispatch) => {
    dispatch(dayLoading(day));
    const url = fetchUrl + '/day/' + day;
    return fetch(url)
        .then(res => res.json())
        .then(res => dispatch(addDay(res)))
        .catch((err) => { console.log(err); dispatch(dayFailed(day)); });
};

export const getTracks = () => (dispatch) => {
    dispatch(tracksLoading());
    const url = fetchUrl + '/tracks';
    return fetch(url)
        .then(res => res.json())
        .then(tracks => dispatch(addTracks(tracks)))
        .catch((err) => console.log(err));
};

export const getTrackDetail = (trackId) => (dispatch) => {
    dispatch(trackDetailLoading());
    const url = fetchUrl + '/tracks/' + trackId;
    return fetch(url)
        .then(res => res.json())
        .then(tracks => dispatch(addTrackDetail(tracks)))
        .catch((err) => console.log(err));
};

export const getMovieDetail = (categoryId, movieId, repeatId) => (dispatch) => {
    dispatch(movieLoading());
    var url = fetchUrl + '/movies/' + categoryId + '/' + movieId + '/' + repeatId;
    return fetch(url)
        .then(res => res.json())
        .then(movie => dispatch(addMovie(movie)))
        .catch((err) => console.log(err));
};

export const fetchFavourites = () => (dispatch) => {
    dispatch(favouritesLoading());
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(fetchUrl + '/favourites', {
        headers: { 'Authorization': bearer }
    })
    .then(response => {
        if (response.ok) { return response; }
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
    },
    error => { throw new Error(error.message); })
    .then(response => response.json())
    .then(favourites => dispatch(addFavourites(favourites)))
    .catch(error => dispatch(favouritesFailed(error.message)));
};

export const addFavourite = (fav) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(fetchUrl + '/favourites/', {
        method: 'POST',
        body: JSON.stringify(fav),
        headers: { 'Content-Type': 'application/json', 'Authorization': bearer },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) { return response; }
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
    },
    error => { throw new Error(error.message); })
    .then(response => response.json())
    .then(() => dispatch(fetchFavourites()))
    .catch(error => dispatch(favouritesFailed(error.message)));
};

export const editFavourite = (fav) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(fetchUrl + '/favourites/' + fav.id, {
        method: 'PUT',
        body: JSON.stringify(fav),
        headers: { 'Content-Type': 'application/json', 'Authorization': bearer },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) { return response; }
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
    },
    error => { throw new Error(error.message); })
    .then(response => response.json())
    .then(() => dispatch(fetchFavourites()))
    .catch(error => dispatch(favouritesFailed(error.message)));
};

export const deleteFavourite = (id) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(fetchUrl + '/favourites/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': bearer },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) { return response; }
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
    },
    error => { throw new Error(error.message); })
    .then(response => response.json())
    .then(() => dispatch(fetchFavourites()))
    .catch(error => dispatch(favouritesFailed(error.message)));
};

export const fetchImdb = (title, year) => (dispatch) => {
    dispatch(imdbLoading());
    return fetch('https://imdb8.p.rapidapi.com/auto-complete?q=' + title, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'imdb8.p.rapidapi.com',
            'x-rapidapi-key': '4eac66e9b5msh32881c1535a40e0p1d8ceajsn8f74f898d71d'
        }
    })
    .then(response => {
        if (response.ok) { return response; }
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
    },
    error => { throw new Error(error.message); })
    .then(response => response.json())
    .then(response => {
        let items = response.d.filter(el => el.l === title && (el.y && el.y === year));
        if (items.length === 0) { items = response.d.filter(el => el.l === title && (el.y && el.y - 1 === year)); }
        if (items.length === 0) { items = response.d.filter(el => el.l === title && (el.y && el.y + 1 === year)); }
        if (items.length === 0) { items = response.d.filter(el => el.l === title || (el.y && el.y === year)); }
        if (items.length === 0) { items = response.d.filter(el => el.l === title || (el.y && el.y - 1 === year)); }
        if (items.length === 0) { items = response.d.filter(el => el.l === title || (el.y && el.y + 1 === year)); }
        return items[0].id;
    })
    .then(id => fetch('https://imdb8.p.rapidapi.com/title/get-overview-details?tconst=' + id + '&currentCountry=IT', {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'imdb8.p.rapidapi.com',
            'x-rapidapi-key': '4eac66e9b5msh32881c1535a40e0p1d8ceajsn8f74f898d71d'
        }
    }))
    .then(response => {
        if (response.ok) { return response; }
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
    },
    error => { throw new Error(error.message); })
    .then(response => response.json())
    .then(response => ({ imdbId: response.id, imdbRating: response.ratings.rating, imdbRatingCount: response.ratings.ratingCount }))
    .then(imdb => dispatch(addImdb(imdb)))
    .catch(error => dispatch(imdbFailed(error.message)));
};

export const fetchChatResponse = (conversationId, title, lastMessage, charachter, temperature) => (dispatch) => {
    dispatch(addChatResponse({ conversationId, content: lastMessage, role: 'user', timestamp: new Date().getTime(), title }));
    dispatch(chatResponseLoading());
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const body = {
        conversationId,
        charachter: charachter ? charachter : 'cinefilo',
        temperature: Number(temperature),
        question: lastMessage,
        title
    };
    return fetch(fetchUrl + '/chat/prompt', {
        method: 'POST',
        headers: { 'Authorization': bearer, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(response => {
        if (response.ok) { return response; }
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
    },
    error => { throw new Error(error.message); })
    .then(response => response.json())
    .then(response => { console.dir(response); dispatch(addChatResponse(response)); })
    .catch(error => dispatch(chatResponseFailed(error.message)));
};

export const fetchCharachters = () => (dispatch) => {
    dispatch(charachtersLoading());
    const url = fetchUrl + '/chat/charachters';
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(url, {
        method: 'GET',
        headers: { 'Authorization': bearer, 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(charachters => dispatch(addCharachters(charachters)))
    .catch((err) => dispatch(charachtersFailed(err.message)));
};

export const fetchConversations = () => (dispatch) => {
    dispatch(conversationsLoading());
    const url = fetchUrl + '/chat/previousConversations';
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(url, {
        method: 'GET',
        headers: { 'Authorization': bearer, 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(conversations => dispatch(addConversations(conversations)))
    .catch((err) => dispatch(conversationsFailed(err.message)));
};

export const fetchConversationLog = (conversationId) => (dispatch) => {
    dispatch(conversationLogLoading());
    const url = fetchUrl + '/chat/conversationLog';
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(url, {
        method: 'POST',
        headers: { 'Authorization': bearer, 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId })
    })
    .then(res => res.json())
    .then(conversationLog => dispatch(addConversationLog(conversationLog)))
    .catch((err) => dispatch(conversationLogFailed(err.message)));
};

export const deleteConversation = (conversationId) => (dispatch) => {
    dispatch(conversationsLoading());
    const url = fetchUrl + '/chat/previousConversations';
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': bearer, 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId })
    })
    .then(res => res.json())
    .then(result => dispatch(conversationDeleted(result)))
    .catch((err) => dispatch(conversationsFailed(err.message)));
};


export const loginUser = (creds) => (dispatch) => {
    dispatch(requestLogin(creds));
    return fetch(fetchUrl + '/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
    })
    .then(response => {
        if (response.ok) { return response; }
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
    },
    error => { throw error; })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('creds', JSON.stringify(creds));
            dispatch(receiveLogin(response));
        } else {
            var error = new Error('Error ' + response.status);
            error.response = response;
            dispatch(loginError(response));
            throw error;
        }
    })
    .catch(error => dispatch(loginError(error.message)));
};

export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout());
    localStorage.removeItem('token');
    localStorage.removeItem('creds');
    dispatch(receiveLogout());
};

export const signupUser = (creds) => (dispatch) => {
    dispatch(requestSignup(creds));
    return fetch(fetchUrl + '/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
    })
    .then(response => {
        if (response.ok) { return response; }
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
    },
    error => { throw error; })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            dispatch(receiveSignup());
        } else {
            var error = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => dispatch(signupError(error.message)));
};
