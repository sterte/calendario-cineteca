import { baseUrl } from '../shared/baseUrl';
import * as ActionTypes from './ActionTypes';


export const getDayProgram = (year, month, day) => (dispatch) => {
    dispatch(dayLoading(true))
    const url = baseUrl + '/days/' + year + '/' + month + '/' + day;    
    return fetch(url)
    .then(res => res.json())
    .then(day => dispatch(addDay(day)))
    .catch((err) => console.log(err));
}

export const dayLoading = () => ({
	type: ActionTypes.DAY_LOADING
})

const addDay = (program) => ({
    type: ActionTypes.ADD_DAY,
    payload: program
})


export const getMovieDetail = (movieId) => (dispatch) => {
    dispatch(movieLoading(true))
    const url= baseUrl + '/movies/' + movieId;    
    return fetch(url)
    .then(res => res.json())            
    .then(movie => dispatch(addMovie(movie)))
    .catch((err) => console.log(err));
}

export const movieLoading = () => ({
	type: ActionTypes.MOVIE_LOADING
})

const addMovie = (program) => ({
    type: ActionTypes.ADD_MOVIE,
    payload: program
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

    return fetch(baseUrl + '/users/login', {
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

return fetch(baseUrl + '/users/signup', {
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