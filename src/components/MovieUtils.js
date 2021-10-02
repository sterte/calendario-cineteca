import React from 'react';
import { fetchUrl } from '../shared/baseUrl'
import { Link } from 'react-router-dom';
import { Fade, Stagger } from 'react-animation-components';

export const Vo = (props) => {
    if (props.isVO) {
        return (<img className='mr-3' src={fetchUrl + "/images/subtitles.gif"} alt='subtitles' />);
    } else {
        return (<></>);
    }
};

export const Music = (props) => {
    if (props.isMUSIC) {
        return (<img className='mr-3' src={fetchUrl + "/images/nota.gif"} alt='music' />);
    } else {
        return (<></>);
    }
};

export const isFuture = (movieTime, currentDate) => {
    const now = new Date();
    const oraInizio = currentDate;
    movieTime = movieTime.replace('H ', '');
    let [hh, mm] = movieTime.split('.');                
    oraInizio.setHours(hh);
    oraInizio.setMinutes(mm);
    return now < oraInizio;
}


export const movieListDetail = (movie, showDay = false) => {
const isSoldOut = 'Sold Out' === movie.extras;
return (
    <Stagger in className='row ml-1 mr-1 mb-5'>
            <div className='col-4 col-md-4'>
                <img src={movie.image} className='img-fluid' alt={'img-' + movie.id} />
            </div>
            <div className='ml-3 ml-md-0 col-12 col-md-8'>
                <div className={(isFuture(movie.time, new Date()) && !isSoldOut) || showDay ? 'row' : 'row past-movie-title'}>
                    <Link to={`/movie/${movie.categoryId}/${movie.id}/${movie.repeatId}`}><h4>{movie.title}</h4></Link>
                </div>
                {showDay &&
                <div className='row'>
                    <h5>{movie.date}</h5>
                </div>
                }
                <div className='row'>
                    <h5>{movie.time}</h5><span class='ml-1'>- {movie.place.replace(/Cinema Lumi.re/, 'Cinema Lumiére')} {/*non ho trovato un modo più furbo...*/}</span>
                </div>
                <div className='row'>
                    {isSoldOut ?
                        <b>{movie.extras}</b>
                        :
                        <em>{movie.extras}</em>
                    }
                </div>
                <div className='row mt-1'>
                    <Vo isVO={movie.isVO} />
                    <Music isMUSIC={movie.isMUSIC} />
                </div>
            </div>
    </Stagger>
)}