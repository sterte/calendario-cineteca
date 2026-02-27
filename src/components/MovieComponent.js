import React, { useState, useEffect, useRef } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody,
  Form, FormGroup, Label, Input
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Fade } from 'react-animation-components';
import Loading from './LoadingComponent';
import { getMovieDetail, fetchImdb } from '../redux/movies';
import { addFavourite } from '../redux/favourites';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import ScrollToTopButton from './ScrollToTopButton';
import '../App.css';
import { weekDays, monthToNum, monthToCompleteName } from './MovieUtils';
import { cinetecaUrl, imdbUrl } from '../shared/baseUrl';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function Movie({ categoryId, movieId, repeatId }) {
  const movie = useSelector(state => state.movies);
  const auth = useSelector(state => state.auth);
  const provider = useSelector(state => state.provider.activeProvider);
  const dispatch = useDispatch();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const ratingRef = useRef(null);
  const commentRef = useRef(null);

  useEffect(() => {
    dispatch(getMovieDetail({ categoryId, movieId, repeatId }));
  }, [dispatch, categoryId, movieId, repeatId]);

  const prevIsLoadingRef = useRef(true);
  useEffect(() => {
    if (auth.isAuthenticated && prevIsLoadingRef.current && !movie.isLoading && movie.movies?.duration) {
      const from = movie.movies.duration.indexOf('/') + 1;
      const to = movie.movies.duration.indexOf(')');
      const year = parseInt(movie.movies.duration.substring(from, to));
      const div = document.createElement('div');
      div.innerHTML = movie.movies.duration;
      const originalTitle = div.querySelector('span')?.textContent?.trim() || movie.movies.title;
      dispatch(fetchImdb({ title: originalTitle, year }));
    }
    prevIsLoadingRef.current = movie.isLoading;
  });

  const toggleEditModal = (t) => {
    setIsEditModalOpen(open => !open);
    setTitle(t || '');
  };

  const handleFavouriteAdd = () => {
    dispatch(addFavourite({ title, rating: ratingRef.current, comment: commentRef.current.value }));
  };

  const composeCalendarButton = (hour, durationNumber, showBuyButton = true, showIndexOffset = 0) => {
    const splitDate = hour.day.trim().split(/\s+/);
    const year = '20' + splitDate[3];
    var monthString = splitDate[2];
    const day = splitDate[1];
    const month = monthToNum(monthString);

    var now = new Date();
    var oraInizio = new Date();
    oraInizio.setFullYear(year);
    oraInizio.setMonth(month);
    oraInizio.setDate(day);

    var giornoInizio = new Date(oraInizio);
    giornoInizio.setHours(23);
    giornoInizio.setMinutes(59);

    var dateString = weekDays[giornoInizio.getDay()] + ' ' + day + ' ' + monthToCompleteName(monthString);
    if (year !== now.getFullYear().toString()) {
      dateString = dateString + ' ' + year;
    }

    return (
      <div className='container'>
        <Fade in='true' key={hour.day}>
          <div className={giornoInizio > now ? 'row mt-5 mb-0' : 'row mt-5 mb-0 past-movie-title'}>
            <h5 style={{marginBottom: 0}}>{dateString}</h5>
          </div>
          {hour.hours.map((show, showIndex) => {
            let orario = show.orario;
            orario = orario.replace('H ', '');
            let [hh, mm] = orario.split(':');

            oraInizio.setHours(hh, mm, 0, 0);
            var isFuture = new Date() < oraInizio;
            durationNumber = isNaN(durationNumber) ? 120 : durationNumber;
            let oraFine = new Date(oraInizio.getTime() + (1000 * 60 * durationNumber));

            const pad = n => String(n).padStart(2, '0');
            const startDateStr = `${oraInizio.getFullYear()}-${pad(oraInizio.getMonth()+1)}-${pad(oraInizio.getDate())}`;
            const startTimeStr = `${pad(parseInt(hh))}:${pad(parseInt(mm))}`;
            const endDateStr = `${oraFine.getFullYear()}-${pad(oraFine.getMonth()+1)}-${pad(oraFine.getDate())}`;
            const endTimeStr = `${pad(oraFine.getHours())}:${pad(oraFine.getMinutes())}`;

            let eventDescription = window.location.href + "\n\n" + movie.movies.originalUrl + "\n\n" + imdbUrl + movie.imdbId;

            let address = 'Cinema Lumière, Via Azzo Gardino, 65, 40122 Bologna, Italia';
            if (hour.place.toLowerCase().includes('cinema cervi')) {
              address = 'Sala Cervi, Via Riva di Reno, 72/A, 40122 Bologna, Italia';
            } else if (hour.place.toLowerCase().includes('cinema modernissimo')) {
              address = ' Cinema Modernissimo, Piazza Re Enzo, 4, 40125 Bologna, Italia';
            } else if (provider === 'ccb') {
              const p = hour.place.toLowerCase();
              if (p.includes('odeon'))        address = 'Cinema Odeon, Via Mascarella, 3, 40126 Bologna BO';
              else if (p.includes('rialto'))  address = 'Cinema Rialto, Via Rialto, 19, 40126 Bologna BO';
              else if (p.includes('roma'))    address = 'Cinema Roma d\'essai, Via Fondazza, 4, 40100 Bologna BO';
              else if (p.includes('chaplin')) address = 'Cinema Chaplin, P.za di Porta Saragozza, 5/a, 40123 Bologna BO';
              else if (p.includes('europa'))  address = 'Cinema Europa, Via Pietralata, 55, 40100 Bologna BO';
            }

            let event = {
              title: movie.movies.title,
              location: address,
              startTime: oraInizio.toISOString(),
              endTime: oraFine.toISOString(),
              description: eventDescription
            };

            return (
              <div className={`row d-flex show-row${(showIndexOffset + showIndex) % 2 === 0 ? ' show-row-odd' : ''}`} key={event.title+event.startTime}>
                <div className={isFuture ? 'col-12 mt-2 mb-0' : 'col-12 mt-2 mb-0 mb-md-2 past-movie-title'}>
                  <span>
                    {orario} - {hour.place}
                  </span>
                  {show.isVO > 0 &&
                    <img className='ml-2 mb-1' src='/assets/images/subtitles.gif' alt='subtitles' />
                  }
                </div>
                <div style={{textTransform: 'capitalize'}} className={'col-12 mt-0 mb-3'}>
                  <span dangerouslySetInnerHTML={{__html: show.additionalInfo}} />
                </div>
                {isFuture &&
                  <div className='col-12 col-md-auto mt-2 mt-md-0 mb-0 mb-md-4 d-flex align-items-center'>
                    <AddToCalendarButton
                      name={movie.movies.title}
                      startDate={startDateStr}
                      startTime={startTimeStr}
                      endDate={endDateStr}
                      endTime={endTimeStr}
                      timeZone="Europe/Rome"
                      location={address}
                      description={eventDescription}
                      options={['Google','Apple','Outlook.com','Yahoo','iCal']}
                      label="Aggiungi al calendario"
                      hideCheckmark
                      styleLight={provider === 'ccb'
                        ? '--btn-background:#ffabad;--btn-hover-background:#ffc7c8;--btn-border:#ffc7c8;--btn-hover-border:#ffc7c8;--btn-text:#000;--btn-hover-text:#000;--btn-border-radius:20px;--btn-shadow:none;--btn-hover-shadow:none;--btn-active-shadow:none;--btn-padding-x:10px;--btn-padding-y:10px;--wrapper-padding:0;'
                        : '--btn-background:#f99e00;--btn-hover-background:#fccd00;--btn-border:#fccd00;--btn-hover-border:#fccd00;--btn-text:#000;--btn-hover-text:#000;--btn-border-radius:20px;--btn-shadow:none;--btn-hover-shadow:none;--btn-active-shadow:none;--btn-padding-x:10px;--btn-padding-y:10px;--wrapper-padding:0;'
                      }
                    />
                  </div>
                }
                <div className='d-flex col-12 col-md-3 mt-4 mt-md-0 mb-0 mb-md-4'>
                  {showBuyButton && movie.movies.buyLink.length > 0 && isFuture &&
                    <a className='cal-button' href={movie.movies.buyLink} target="_blank" rel='noopener noreferrer'>Acquista</a>
                  }
                </div>
              </div>
            );
          })}
        </Fade>
      </div>
    );
  };

  if (movie.isLoading) {
    return <div className='container'><Loading /></div>;
  }

  const durationString = movie.movies.duration;
  const durationNumber = parseInt(durationString.substring(durationString.lastIndexOf('(') + 1, durationString.lastIndexOf('\')') ));
  let showCounter = 0;
  const timetable = movie.movies.hours.map((hour) => {
    const el = composeCalendarButton(hour, durationNumber, true, showCounter);
    showCounter += hour.hours.length;
    return el;
  });
  // year: original code used this.from/this.to which were undefined → substring(0, length) = full duration string
  const year = movie.movies.duration;

  return (
    <>
      <Helmet>
        <title>Cinetecalendar - {movie.movies.title}</title>
        <meta name='description' content={'Cinetecalendar - ' + movie.movies.title} />
      </Helmet>
      <div className='container white-back'>
        <div className='row row-content ml-1 mr-1 p-2 p-md-5'>
          <div className='row d-flex justify-content-center mt-5'>
            <div className='col-md-9 d-flex align-self-center'>
              <div className='row'>
                <div className='col-auto d-flex align-self-center'>
                  <h2>{movie.movies.title}</h2>
                </div>
                {auth.isAuthenticated && movie.movies.duration &&
                  <div className='col-auto'>
                    <Button className='navigation-button' onClick={() => toggleEditModal(movie.movies.title)}>
                      <span className="fa fa-eye" />
                    </Button>
                  </div>
                }
                {movie.movies.duration &&
                  <div className='col-12 d-flex align-self-center' dangerouslySetInnerHTML={{__html: movie.movies.duration}} />
                }
                {movie.movies.currentHour.isVO > 0 &&
                  <div><img className='col-12 d-flex align-self-center' src='/assets/images/subtitles.gif' alt='subtitles' /></div>
                }
              </div>
            </div>
            <div className='col-12 d-flex col-md-3 mt-3 mt-md-0'>
              <img src={movie.movies.image} className='img-fluid' alt={'img-' + movie.movies.image} />
            </div>
          </div>

          <div className='col-12 col-md-6 p-2 d-flex align-items-center mt-3 row-content'>
            Link: {provider === 'ccb'
            ? <a className='col-1 d-flex align-self-center ml-3 mr-3 p-0' href={movie.movies.originalUrl} target="_blank" rel='noopener noreferrer'><img width='50' src='/assets/images/logo-ccb.svg' alt='link-ccb' /></a>
            : <a className='col-1 d-flex align-self-center ml-3 mr-3 p-0' href={cinetecaUrl + '/' + categoryId + '/' + movieId + '/?' + repeatId} target="_blank" rel='noopener noreferrer'><img width='50' src='/assets/images/logo-base.png' alt='link-cineteca' /></a>
          }
            {movie.isLoadingImdb && auth.isAuthenticated ?
              <div className='col-12'><Loading /></div>
              : auth.isAuthenticated && movie.imdbId &&
              <div className='col-auto d-flex align-self-center'>
                <a className='col-auto d-flex align-self-center' href={imdbUrl + movie.imdbId} target="_blank" rel='noopener noreferrer'><img width='50' src='/assets/images/logo-imdb.png' alt='link-imdb' /></a>
                {movie.imdbRatingCount > -1 &&
                  <div className='col-6 col-md-12 p-0'>
                    <div className='col-auto d-flex align-self-center'>{movie.imdbRating} ({movie.imdbRatingCount})</div>
                    <StarRatings
                      rating={parseFloat(movie.imdbRating) / 2}
                      numberOfStars={5}
                      starRatedColor={provider === 'ccb' ? '#ffabad' : '#f99e00'}
                      starEmptyColor="#a8a8a8"
                      starDimension="30px"
                      starSpacing="0px"
                    />
                  </div>
                }
              </div>
            }
          </div>

          {auth.isAuthenticated &&
            <div className='col-12 col-md-6 p-2 d-flex align-items-center mt-3 row-content'>
              Chiedi all'AI:
              <button type='button' style={{height: '80%'}} className='col- d-flex navigation-button btn btn-secondary align-self-center ml-3 mr-3'><Link to={{pathname:`/chat-ai`, state:{requestType: 'info', title: movie.movies.title, year: year, backUrl: window.location.pathname}}}><h4 style={{color: 'white'}}>Info</h4></Link></button>
              <button type='button' style={{height: '80%'}} className='col-auto d-flex navigation-button btn btn-secondary align-self-center mr-auto'><Link to={{pathname:`/chat-ai`, state:{requestType: 'similar', title: movie.movies.title, year: year, backUrl: window.location.pathname}}} state={{requestType: 'similar', title: movie.movies.title, year: year}}><h4 style={{color: 'white'}}>Simili</h4></Link></button>
            </div>
          }

          <div className='col-12 col-md-6 p-0 d-flex align-self-center' style={{zIndex: 1}}>
            {composeCalendarButton(movie.movies.currentHour, durationNumber)}
          </div>

          <div className='col-12 mt-2' dangerouslySetInnerHTML={{ __html: movie.movies.currentHour.additionalInfo }} />
          <div className='col-12 mt-2' dangerouslySetInnerHTML={{ __html: movie.movies.summary }} />
          {movie.movies.hours.length ?
            <div className='row d-flex justify-content-center'>
              <div className='col-12 mt-4'>
                <h4>Altre repliche</h4>
                {timetable}
              </div>
            </div>
            : <></>
          }
        </div>
        <ScrollToTopButton />
      </div>

      <Modal isOpen={isEditModalOpen} toggle={() => toggleEditModal()}>
        <ModalHeader className='navigation-button' toggle={() => toggleEditModal()}>Valuta Film</ModalHeader>
        <ModalBody>
          <div className='white-back row-content'>
            <Form onSubmit={handleFavouriteAdd}>
              <FormGroup>
                <Label htmlFor="title">Film:</Label> {title}
              </FormGroup>
              <FormGroup>
                <Label className='mr-2' htmlFor="rating">Voto</Label>
                <select className='form-control' onChange={(evt) => { ratingRef.current = evt.target.value; }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="comment">Commento</Label>
                <Input type="text" id="comment" name="comment" defaultValue=''
                  innerRef={commentRef} />
              </FormGroup>
              <Button className='navigation-button mr-3' type="submit" value="Edit" color="primary">Salva</Button>
              <Button onClick={() => toggleEditModal()}>Annulla</Button>
            </Form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Movie;
