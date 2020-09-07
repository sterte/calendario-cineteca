import * as ActionTypes from './ActionTypes';
import { cinetecaUrl } from '../shared/baseUrl';



const parseMovieDetail = (html) => {
    var movie = {};    
    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, 'text/html');    
    const title = parsed.getElementsByClassName('pagetitle minisito').length > 0 ? parsed.getElementsByClassName('pagetitle minisito')[0].innerHTML : '';    
    const extra = parsed.getElementsByClassName('proiezione_corpo');
    const paragraphs = extra.length > 0 ? extra[0].getElementsByTagName('p') : [];

    var image = parsed.getElementsByClassName('mainthumbwrapper');
    if(image.length){
        if(image[0].getElementsByTagName('img').length){
            image = image[0].getElementsByTagName('img');
            if(image.length){
                image = image[0].getAttribute('src').valueOf();
                image = cinetecaUrl + image.substr(image.indexOf('/imageserver'));
            }
            else{
                image ='';
            }
        }
    }
    else{
        image =''
    }

    var durata = paragraphs.length > 0 ? paragraphs[0].innerHTML : '';
    if(durata.length){        
        const to = durata.indexOf('<br>');
        durata = durata.substr(0, to);
        durata = durata.replace('<em>', '');
        durata = durata.replace('</em>', '');
    }

    var sinossi = paragraphs.length > 1 ? paragraphs[1].innerHTML : '';        
    sinossi = sinossi.replace(/<[^>]*>/g, '');
    

    const pagRepliche = parsed.getElementsByClassName('dettagli_cal extra');    
    var i;    
    var days = [];
    for(i=0; i<pagRepliche.length; i++){        
        const giorniRepliche = pagRepliche[i].getElementsByClassName('repliche');        
        var j;
        for(j=0; j<giorniRepliche.length; j++){
            const giornoRepliche = giorniRepliche[j];
            const giorno = giornoRepliche.getElementsByClassName('data_repliche');                        
            if(giorno.length > 0){
                const giornoString = giorno[0].innerHTML
                const orari = giornoRepliche.getElementsByClassName('ora_wrapper').length > 0 ? giornoRepliche.getElementsByClassName('ora_wrapper')[0].getElementsByClassName('ora_repliche') : [];
                var ora = [];
                var k;
                for(k=0; k<orari.length; k++){
                    ora.push(orari[k].innerHTML);
                }
                days.push({day: giornoString, hours: ora});                
            }            
        }   
    }
    movie = {title: title, duration: durata, summary: sinossi, image: image, hours: days};        
    return movie;
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
    const url=cinetecaUrl + '/vedere/programmazione/' + movieId;    
    return fetch(url)
    .then(res => res.text())
    .then(html => parseMovieDetail(html))
    .then(movie => dispatch(addMovie(movie)));    
}

export const movieLoading = () => ({
	type: ActionTypes.MOVIE_LOADING
})

const addMovie = (program) => ({
    type: ActionTypes.ADD_MOVIE,
    payload: program
})