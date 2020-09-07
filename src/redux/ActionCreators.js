import * as ActionTypes from './ActionTypes';
import { cinetecaUrl } from '../shared/baseUrl';



const parseMovieDetail = (html) => {
    //TODO
}

const parseDayProgram = (html) => {    
    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, 'text/html');
    const day = parsed.getElementById("elenco_giorno");
    const movies = day.getElementsByClassName('clearfix');
    var i;
    var moviesJson = { movies: []};
    for(i=0; i<movies.length; i++){
        const movie = movies[i]
        const place = movie.getElementsByClassName('luogo').length > 0 ?  movie.getElementsByClassName('luogo')[0].innerHTML : '-';
        const time = movie.getElementsByClassName('ora').length > 0 ?  movie.getElementsByClassName('ora')[0].innerHTML : '-';
        const title = movie.getElementsByClassName('caption').length > 0 ? movie.getElementsByClassName('caption')[0].getElementsByTagName('a')[0].innerHTML : '-';
        var url = movie.getElementsByClassName('caption');
        var id;
        if(url.length > 0){
            url = url[0].getElementsByTagName('a')[0].getAttribute('href')
            const from = url.indexOf('/app_');
            const to = url.indexOf('/', from+1);            
            id = url.substr(from+1, to-from-1);
            alert(id);
            url = cinetecaUrl + url.substr(url.indexOf('/vedere'));
        }else{
            url=''
        }

        var image = movie.getElementsByClassName('thumb')
        if(image.length > 0){
            image = image[0].getElementsByTagName('img')[0].getAttribute('src')            
            image = cinetecaUrl + image.substr(image.indexOf('/imageserver'));
        }else{
            image=''
        }                

        var isVO = false;
        var extras = movie.getElementsByClassName('extra');        
        if(extras.length > 0){            
            extras = extras[0].getElementsByTagName('img');            
            var j;
            for(j=0; j<extras.length; j++){                                
                if(extras[j].getAttribute('src').valueOf().indexOf('subtitles.gif') > -1){
                    isVO = true;
                    break;
                }
            }
        }

        var isMUSIC = false;
        extras = movie.getElementsByClassName('extra');
        if(extras.length > 0){
            extras = extras[0].getElementsByTagName('img');
            for(j=0; j<extras.length; j++){                                
                if(extras[j].getAttribute('src').valueOf().indexOf('nota.gif') > -1){
                    isMUSIC = true;
                    break;
                }
            }
        }

        moviesJson.movies.push({           
            id: id,             
            title: title,
            place: place,
            time: time,
            url: url,
            image: image,
            isVO: isVO,
            isMUSIC: isMUSIC
        });        
    }    
    return moviesJson;    
}

export const getDayProgram = (year, month, day) => (dispatch) => {
    dispatch(dayLoading(true))
    const url=cinetecaUrl + '/vedere/programmazione/dp_dt_'+year+'/'+month+'/'+day;    
    return fetch(url)
    .then(res => res.text())
    .then(html => parseDayProgram(html))
    .then(day => dispatch(addDay(day)));
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
    const url=cinetecaUrl + '/vedere/programmazione/movieId';
    return fetch(url)
    .then(res => res.text())
    .then(html => parseMovieDetail(html))
    .then(day => dispatch(addMovie(day)));    
}

export const movieLoading = () => ({
	type: ActionTypes.MOVIE_LOADING
})

const addMovie = (program) => ({
    type: ActionTypes.ADD_MOVIE,
    payload: program
})