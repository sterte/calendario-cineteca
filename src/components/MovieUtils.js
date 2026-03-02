import React from 'react';
import { Link } from 'react-router-dom';
import { Fade } from 'react-animation-components';

export const Vo = (props) => {
    if (props.isVO) {
        return (<img className='me-3' src='/assets/images/subtitles.gif' alt='subtitles' style={{height: '1.25rem', width: 'auto'}} />);
    } else {
        return (<></>);
    }
};

export const Music = (props) => {
    if (props.isMUSIC) {
        return (<img className='me-3' src='/assets/images/nota.gif' alt='music' style={{height: '1.25rem', width: 'auto'}} />);
    } else {
        return (<></>);
    }
};

export const isFuture = (movie, currentDate) => {
    const now = new Date();
    const oraInizio = currentDate;
    let dateDay = parseInt(movie.date.split(' ')[1]);
    let dateMonth = parseInt(monthToNum(movie.date.split(' ')[2]));
    let currentDay = currentDate.getUTCDate();
    let currentMonth = currentDate.getUTCMonth();

    if(currentMonth === dateMonth){
        if(currentDay === dateDay){
            let movieTime = movie.time.replace('H ', '');
            let [hh, mm] = movieTime.split(':');                
            oraInizio.setHours(hh);
            oraInizio.setMinutes(mm);
            return now < oraInizio;
        }    
        if(currentDay > dateDay){
            return false;
        }else {
            return true
        }
    }else if(currentMonth > dateMonth){
        return false;
    }else{
        return true;
    }
}


export const movieListDetail = (movie, showDay = false, provider = 'cineteca') => {
let movieExtras = movie.extras;
if(movie.extras.includes('Sold out')){
  movieExtras = movieExtras.replace('Sold out', '<b>Sold out</b>');
}
return (
    <Fade in={true} className='row ms-1 me-1 p-3 p-md-3 movie-card-row' key={movie.repeatId}>
            <div className='col-4 p-0 pe-md-3'>
                <img src={movie.image} className='img-fluid' alt={'img-' + movie.id} />
            </div>
            <div className='col-12 col-md-8 ps-0'>
                <div className={isFuture(movie, new Date()) ? '' : 'past-movie-title'}>
                    <Link to={`/movie/${provider}/${movie.categoryId}/${movie.id}/${movie.repeatId}`}><h4>{movie.title}</h4></Link>
                </div>
                {showDay &&
                <div>
                    <h5>{movie.date}</h5>
                </div>
                }
                <div className='d-flex align-items-baseline gap-1'>
                    <h5 className='mb-0'>{movie.time}</h5><span>- {movie.place.replace(/Cinema Lumi.re/, 'Cinema Lumiére')} {/*non ho trovato un modo più furbo...*/}</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: movieExtras }} />
                <div className='d-flex mt-1'>
                    <Vo isVO={movie.isVO} />
                    <Music isMUSIC={movie.isMUSIC} />
                </div>
            </div>
    </Fade>
)}


export const monthToNum = (month) => {
switch (month) {
    case 'Gen':
      month = 0;
      break;
    case 'Feb':
      month = 1;
      break;
    case 'Mar':
      month = 2;
      break;
    case 'Apr':
      month = 3;
      break;
    case 'Mag':
      month = 4;
      break;
    case 'Giu':
      month = 5;
      break;
    case 'Lug':
      month = 6;
      break;
    case 'Ago':
      month = 7;
      break;
    case 'Set':
      month = 8;
      break;
    case 'Ott':
      month = 9;
      break;
    case 'Nov':
      month = 10;
      break;
    case 'Dic':
      month = 11;
      break;
    default:
      month = 0;
      break;
  }
  return month;
}

export const monthToCompleteName = (month) => {
  switch (month) {
      case 'Gen':
        month = 'Gennaio';
        break;
      case 'Feb':
        month = 'Febbraio';
        break;
      case 'Mar':
        month = 'Marzo';
        break;
      case 'Apr':
        month = 'Aprile';
        break;
      case 'Mag':
        month = 'Maggio';
        break;
      case 'Giu':
        month = 'Giugno';
        break;
      case 'Lug':
        month = 'Luglio';
        break;
      case 'Ago':
        month = 'Agosto';
        break;
      case 'Set':
        month = 'Settembre';
        break;
      case 'Ott':
        month = 'Ottobre';
        break;
      case 'Nov':
        month = 'Novembre';
        break;
      case 'Dic':
        month = 'Dicembre';
        break;
      default:
        month = 0;
        break;
    }
    return month;
  }

export const weekDays = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
