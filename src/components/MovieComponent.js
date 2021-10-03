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
import { monthToNum } from './MovieUtils';
import { cinetecaUrl, imdbUrl } from '../shared/baseUrl';
import StarRatings from 'react-star-ratings';


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


composeCalendarButton(hour, showBuyButton = true){
  let items = [
    { google: 'Google' },
    { outlook: 'Outlook' },
    { yahoo: 'Yahoo' }
  ];

  let icon = { 'calendar-plus-o': 'left' };
  //hour.day = hour.day.replace('&igrave;', 'ì');
  const splitDate = hour.day.trim().split(/\s+/);
  const year = '20' + splitDate[3];
  var month = splitDate[2];
  const day = splitDate[1];

  month = monthToNum(month);
  
  var now = new Date();
  var oraInizio = new Date();
  oraInizio.setFullYear(year);
  oraInizio.setMonth(month);
  oraInizio.setDate(day);

  var giornoInizio = new Date(oraInizio);
  giornoInizio.setHours(23);
  giornoInizio.setMinutes(59);
  


  return (
    <div className='container' key={hour.day}>
      <Fade in>
        <div className={giornoInizio > now ? 'row mt-5 mb-0 mb-md-3' : 'row mt-5 mb-0 mb-md-3 past-movie-title'}>      
          <h5 dangerouslySetInnerHTML={{__html:hour.day}}></h5>
        </div>
        {hour.hours.map((show) => {

          show = show.replace('H ', '');
          let [hh, mm] = show.split('.');
      
          oraInizio.setHours(hh, mm, 0, 0);
          var isFuture = new Date() < oraInizio;
          let oraFine = new Date(oraInizio.getTime() + (1000 * 60 * 60 * 2));

          let event = {
            title: this.props.movie.movies.title,
            location: 'Cinema Lumière, Via Azzo Gardino, 65, 40122 Bologna, Italia',
            startTime: oraInizio.toISOString(),
            endTime: oraFine.toISOString(),
            description: this.props.movie.movies.originalUrl
          };

          return (
            <div className='row d-flex' key={event.title+event.startTime}>
              <div className={isFuture ? 'col-12 col-md-2 mt-4 mt-md-0 mb-0 mb-md-4' : 'col-12 col-md-2 mt-4 mt-md-0 mb-0 mb-md-4 past-movie-title'}>
                {show}
              </div>
              { isFuture && 
              <div className='col-12 col-md-auto mt-2 mt-md-0  mb-0 mb-md-4'>
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
      const timetable = this.props.movie.movies.hours.map((hour) => this.composeCalendarButton(hour));

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
                  { this.props.movie.movies.isVO > 0 &&
                  <div><img className='col-12 d-flex align-self-center' src='/assets/images/subtitles.gif' alt='subtitles' /></div>
                  }
                </div>
              </div>
              <div className='col-12 d-flex col-md-3 mt-3 mt-md-0'>
                <img src={this.props.movie.movies.image} className='img-fluid' alt={'img-' + this.props.movie.movies.image} />
              </div>
            </div>            

            <div className='col-12 p-0 d-flex align-self-center mt-3'>
            <a className='col-1 d-flex align-self-center' href={cinetecaUrl + '/' + this.props.categoryId + '/' + this.props.movieId + '/?' + this.props.repeatId} target="_blank" rel='noopener noreferrer'><img width='50' src='/assets/images/logo-black.png' alt='link-cineteca' /></a>
            {this.props.movie.isLoadingImdb && this.props.auth.isAuthenticated ?
            <div><Loading /></div>
            : this.props.auth.isAuthenticated &&
            <div className='col-auto d-flex align-self-center'>
              <a className='col-auto d-flex align-self-center' href={imdbUrl + this.props.movie.imdbId} target="_blank" rel='noopener noreferrer'><img width='50' src='/assets/images/logo-imdb.png' alt='link-imdb' /></a>
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

              <div className='col-12 col-md-6 p-0 d-flex align-self-center' style={{zIndex: 1}}>
                {this.composeCalendarButton(this.props.movie.movies.currentHour)}
              </div>

              <div className='col-12 mt-2' >
                {this.props.movie.movies.extras}
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