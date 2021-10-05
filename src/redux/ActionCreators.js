import { fetchUrl } from '../shared/baseUrl';
import * as ActionTypes from './ActionTypes';


export const getDayProgram = (from, to) => (dispatch) => {
    dispatch(dayLoading(true))
    const url = fetchUrl + '/days/' + from + '/' + to;    
    return fetch(url)
    .then(res => res.json())
    .then(day => dispatch(addDay(day)))
    .catch((err) => console.log(err));
}

export const dayLoading = () => ({
	type: ActionTypes.DAY_LOADING
})

export const addDay = (program) => ({
    type: ActionTypes.ADD_DAY,
    payload: program
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
    console.log(title)
    console.log(year)
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
        if(items.length == 0){
            items = response.d.filter(el => el.l === title && (el.y && el.y-1 === year));            
        }
        if(items.length == 0){
            items = response.d.filter(el => el.l === title && (el.y && el.y+1 === year));            
        }
        if(items.length == 0){
            items = response.d.filter(el => el.l === title || (el.y && el.y === year));  
        }
        if(items.length == 0){
            items = response.d.filter(el => el.l === title || (el.y && el.y-1 === year));
            console.log('2')
        console.log(JSON.stringify(items))
        }
        if(items.length == 0){
            items = response.d.filter(el => el.l === title || (el.y && el.y+1 === year));
            console.log('2')
        console.log(JSON.stringify(items))
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
        token: response.token
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