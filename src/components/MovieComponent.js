import React, { Component } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody,
  Form, FormGroup, Label, Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { Fade } from 'react-animation-components';
import Loading from './LoadingComponent';
import { addFavourite, getMovieDetail, fetchImdb } from '../redux/ActionCreators';
import ReactAddToCalendar from 'react-add-to-calendar';
import ScrollToTopButton from './ScrollToTopButton';
import '../App.css';
import { weekDays, monthToNum, monthToCompleteName } from './MovieUtils';
import { cinetecaUrl, imdbUrl } from '../shared/baseUrl';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';


const mapStateToProps = (state) => {
  return {
    movie: state.movies
  }
}

const mapDispatchToProps = (dispatch) => ({
  getMovieDetail: (categoryId, movieId, repeatId) => { dispatch(getMovieDetail(categoryId, movieId, repeatId)) },
  addFavourite: (fav) => dispatch(addFavourite(fav)),
  fetchImdb: (title, year) => { dispatch(fetchImdb(title, year)) }
});

class Movie extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditModalOpen: false,
      title: ''
    };
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.handleFavouriteAdd = this.handleFavouriteAdd.bind(this);
  }

  toggleEditModal = (title) => {
    this.setState({ isEditModalOpen: !this.state.isEditModalOpen, title: title });
  }

  handleFavouriteAdd = () => {
    this.props.addFavourite({ title: this.state.title, rating: this.rating, comment: this.comment.value });
  }


  componentDidMount() {
    this.props.getMovieDetail(this.props.categoryId, this.props.movieId, this.props.repeatId)    
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.auth.isAuthenticated && prevProps.movie.isLoading && !this.props.movie.isLoading) {
        let from = this.props.movie.movies.duration.indexOf('/') + 1;
        let to = this.props.movie.movies.duration.indexOf(')');
        let year = parseInt(this.props.movie.movies.duration.substring(from, to));
        this.props.fetchImdb(this.props.movie.movies.title, year)
    }
}


composeCalendarButton(hour, durationNumber, showBuyButton = true){
  let items = [
    { google: 'Google' },
    { apple: 'Apple' },
    { outlook: 'Outlook' },
    { yahoo: 'Yahoo' }
  ];

  let icon = { 'calendar-plus-o': 'left' };
  //hour.day = hour.day.replace('&igrave;', 'ì');
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
  
var dateString = weekDays[giornoInizio.getDay()] + ' ' +  day + ' ' + monthToCompleteName(monthString);
if(year !== now.getFullYear().toString()){  
  dateString = dateString + ' ' + year;
}

  return (
    <div className='container'>
      <Fade in='true' key={hour.day}>
        <div className={giornoInizio > now ? 'row mt-5 mb-0 mb-md-3' : 'row mt-5 mb-0 mb-md-3 past-movie-title'}>      
          <h5>{dateString}</h5>
        </div>
        {hour.hours.map((show) => {
          let orario = show.orario;
          orario = orario.replace('H ', '');
          let [hh, mm] = orario.split('.');
      
          oraInizio.setHours(hh, mm, 0, 0);
          var isFuture = new Date() < oraInizio;
          durationNumber = isNaN(durationNumber) ? 120 : durationNumber;
          let oraFine = new Date(oraInizio.getTime() + (1000 * 60 * durationNumber));

          let eventDescription = window.location.href + "\n\n" + this.props.movie.movies.originalUrl + "\n\n" + imdbUrl + this.props.movie.imdbId

          let event = {
            title: this.props.movie.movies.title,
            location: 'Cinema Lumière, Via Azzo Gardino, 65, 40122 Bologna, Italia',
            startTime: oraInizio.toISOString(),
            endTime: oraFine.toISOString(),
            description: eventDescription
          };

          return (
            <div className='row d-flex' key={event.title+event.startTime}>            
                <div className={isFuture ? 'col-12 mt-2 mb-0' : 'col-12 mt-2 mb-0 mb-md-2 past-movie-title'}>
                  <span>
                    {orario} - {hour.place}
                  </span>
                  { show.isVO > 0 &&
                    <img className='ml-2 mb-1' src='/assets/images/subtitles.gif' alt='subtitles' />
                  }
                </div>
                <div className={'col-12 mt-0 mb-0 mb-md-2'}>                
                  <span dangerouslySetInnerHTML={{__html: show.additionalInfo}} />
                </div>
                { isFuture && 
                <div className='col-12 col-md-auto mt-2 mt-md-0 mb-0 mb-md-4'>
                  <ReactAddToCalendar listItems={items} event={event} buttonLabel="Aggiungi al calendario" buttonTemplate={icon} />
                </div>                            
                }
                <div className='col-12 col-md-3 mt-4 mt-md-0  mb-0 mb-md-4'>
                { showBuyButton && this.props.movie.movies.buyLink.length > 0 && isFuture &&
                    <a className='react-add-to-calendar__button' href={this.props.movie.movies.buyLink} target="_blank" rel='noopener noreferrer'>Acquista</a>          
                }
              
              </div>
            </div>
          );
        })}
      </Fade>
    </div>
  );
}


  render() {
    if (this.props.movie.isLoading) {
      return (<div className='container'><Loading /></div>);
    }
    else {      
      const durationString = this.props.movie.movies.duration;
      const durationNumber = parseInt(durationString.substring(durationString.lastIndexOf('(') + 1, durationString.lastIndexOf('\')')))
      const timetable = this.props.movie.movies.hours.map((hour) => this.composeCalendarButton(hour, durationNumber));      
      const year = this.props.movie.movies.duration.substring(this.from, this.to);
      return (
        <>
        <div className='container white-back'>
          <div className='row row-content ml-1 mr-1 p-2 p-md-5'>
            <div className='row d-flex justify-content-center mt-5'>
              <div className='col-md-9 d-flex align-self-center'>
                <div className='row'>
                  <div className='col-auto d-flex align-self-center'>
                    <h2>{this.props.movie.movies.title}</h2>
                  </div>
                  {this.props.auth.isAuthenticated && this.props.movie.movies.duration &&
                  <div className='col-auto'>
                    <Button className='navigation-button' onClick={() => this.toggleEditModal(this.props.movie.movies.title)}>
                      <span className="fa fa-eye" />
                    </Button>
                  </div>
                  }
                  {this.props.movie.movies.duration &&
                  <div className='col-12 d-flex align-self-center' dangerouslySetInnerHTML={{__html: this.props.movie.movies.duration}}>                    
                  </div>    
                  }
                  { this.props.movie.movies.currentHour.isVO > 0 &&
                  <div><img className='col-12 d-flex align-self-center' src='/assets/images/subtitles.gif' alt='subtitles' /></div>
                  }
                </div>
              </div>
              <div className='col-12 d-flex col-md-3 mt-3 mt-md-0'>
                <img src={this.props.movie.movies.image} className='img-fluid' alt={'img-' + this.props.movie.movies.image} />
              </div>
            </div>            

            <div className='col-12 col-md-6 p-2 d-flex align-items-center mt-3 row-content'>
              Link: <a className='col-1 d-flex align-self-center ml-3 mr-3' href={cinetecaUrl + '/' + this.props.categoryId + '/' + this.props.movieId + '/?' + this.props.repeatId} target="_blank" rel='noopener noreferrer'><img width='50' src='/assets/images/logo-base.png' alt='link-cineteca' /></a>
              {this.props.movie.isLoadingImdb && this.props.auth.isAuthenticated ?
              <div>
                <Loading />
              </div>
              : this.props.auth.isAuthenticated && this.props.movie.imdbId &&
              <div className='col-auto d-flex align-self-center'>
                <a className='col-auto d-flex align-self-center' href={imdbUrl + this.props.movie.imdbId} target="_blank" rel='noopener noreferrer'><img width='50' src='/assets/images/logo-imdb.png' alt='link-imdb' /></a>
                {this.props.movie.imdbRatingCount > -1 &&
                <div>
                  <div className='col-auto d-flex align-self-center'>{this.props.movie.imdbRating} ({this.props.movie.imdbRatingCount})</div>              
                  <StarRatings
                    rating={parseFloat(this.props.movie.imdbRating) / 2}
                    numberOfStars={5}
                    starRatedColor="#f99e00"
                    starEmptyColor="#a8a8a8"
                    starDimension="30px"
                    starSpacing="0px"
                  />
                </div>
                }
              </div>
              }
            </div>

            { this.props.auth.isAuthenticated &&
            <div className='col-12 col-md-6 p-2 d-flex align-items-center mt-3 row-content'>
                Chiedi all'AI:
            <button type='button' style={{height: '80%'}} className='col- d-flex navigation-button btn btn-secondary align-self-center ml-3 mr-3'><Link to={{pathname:`/chat-ai`, state:{requestType: 'info', title: this.props.movie.movies.title, year: year, backUrl: window.location.pathname}}}><h4 style={{color: 'white'}}>Info</h4></Link></button>
            <button type='button' style={{height: '80%'}} className='col-auto d-flex navigation-button btn btn-secondary align-self-center mr-auto'><Link to={{pathname:`/chat-ai`, state:{requestType: 'similar', title: this.props.movie.movies.title, year: year, backUrl: window.location.pathname}}} state={{requestType: 'similar', title: this.props.movie.movies.title, year: year}}><h4 style={{color: 'white'}}>Simili</h4></Link></button>
            </div>
            }

            <div className='col-12 col-md-6 p-0 d-flex align-self-center' style={{zIndex: 1}}>
              {this.composeCalendarButton(this.props.movie.movies.currentHour, durationNumber)}
            </div>
            
            <div className='col-12 mt-2' dangerouslySetInnerHTML={{ __html: this.props.movie.movies.currentHour.additionalInfo }}>                
            </div>
            <div className='col-12 mt-2' dangerouslySetInnerHTML={{ __html: this.props.movie.movies.summary }} >
            </div>
            {
            this.props.movie.movies.hours.length ?               
            <div className='row d-flex justify-content-center'>
              <div className='col-12 mt-4'>                
                <h4>Altre repliche</h4>                
                {timetable}                
              </div>
            </div>
            :<></>
            }
          </div>
          <ScrollToTopButton />
          </div>

          <Modal isOpen={this.state.isEditModalOpen} toggle={this.toggleEditModal}>
            <ModalHeader className='navigation-button' toggle={this.toggleEditModal}>Valuta Film</ModalHeader>
            <ModalBody>
            <div className='white-back row-content' >
              <Form onSubmit={this.handleFavouriteAdd}>
                <FormGroup>
                  <Label htmlFor="title">Film:</Label> {this.state.title}
                </FormGroup>
                <FormGroup>
                  <Label className='mr-2' htmlFor="rating">Voto</Label>
                  <select value={this.rating} onChange={(evt) => this.rating = evt.target.value}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="comment">Commento</Label>
                  <Input type="text" id="comment" name="comment" defaultValue={this.state.currentlyEdited ? this.state.currentlyEdited.comment : ''}
                    innerRef={(input) => this.comment = input} />
                </FormGroup>
                <Button className='navigation-button mr-3' type="submit" value="Edit" color="primary">Salva</Button>
                <Button onClick={() => this.toggleEditModal()}>Annulla</Button>
              </Form>
              </div>
            </ModalBody>
          </Modal>
        </>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Movie);