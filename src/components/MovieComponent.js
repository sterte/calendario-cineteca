import React, { Component } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody,
  Form, FormGroup, Label, Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { Fade } from 'react-animation-components';
import Loading from './LoadingComponent';
import { addFavourite, getMovieDetail } from '../redux/ActionCreators';
import ReactAddToCalendar from 'react-add-to-calendar';
import { fetchUrl } from '../shared/baseUrl';
import '../App.css';


const mapStateToProps = (state) => {
  return {
    movie: state.movies
  }
}

const mapDispatchToProps = (dispatch) => ({
  getMovieDetail: (categoryId, movieId, repeatId) => { dispatch(getMovieDetail(categoryId, movieId, repeatId)) },
  addFavourite: (fav) => dispatch(addFavourite(fav)),
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


  var oraInizio = new Date();
  oraInizio.setFullYear(year);
  oraInizio.setMonth(month);
  oraInizio.setDate(day);

  return (
    <div className='container'>
      <Fade in>
        <div className='row mt-4'>                
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
            <div className='row d-flex'>
              <div className='col-12 col-md-2 mt-0 mb-0 mb-md-4'>
                {show}
              </div>
              { isFuture && 
              <div className='col-12 col-md-3 mt-2 mt-md-0  mb-0 mb-md-4'>
                <ReactAddToCalendar listItems={items} event={event} buttonLabel="Aggiungi al calendario" buttonTemplate={icon} />
              </div>                            
              }
              { showBuyButton && isFuture ?
              <div className='col-12 col-md-3 mt-4 mt-md-0  mb-0 mb-md-4'>
                  <a class='react-add-to-calendar__button' href={this.props.movie.movies.buyLink} rel='noopenoer noreferrer'>Acquista</a>          
              </div>
              :
              <div className='col-12 col-md-3 mt-4 mt-md-0  mb-0 mb-md-4'></div>
              }
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
          <div className='container'>
            <div className='row d-flex justify-content-center mt-5'>
              <div className='col-9 d-flex align-self-center'>
                <div className='row'>
                  <div className='col-auto d-flex align-self-center'>
                    <h2>{this.props.movie.movies.title}</h2>
                  </div>
                  <div className='col-auto'>
                    <Button color='primary' onClick={() => this.toggleEditModal(this.props.movie.movies.title)}>
                      <span className="fa fa-eye" />
                    </Button>
                  </div>
                  <div className='col-12 d-flex align-self-center' dangerouslySetInnerHTML={{__html: this.props.movie.movies.duration}}>                    
                  </div>    
                  { this.props.movie.movies.isVO > 0 &&
                  <div><img className='col-12 d-flex align-self-center' src={fetchUrl + "/images/subtitles.gif"} alt='subtitles' /></div>
                  }
                </div>
              </div>
              <div className='col-3'>
                <img src={this.props.movie.movies.image} className='img-fluid d' alt={'img-' + this.props.movie.movies.image} />
              </div>
            </div>            

            <div className='row d-flex'>
              <div className='col-12 d-flex align-self-center'>
                {this.composeCalendarButton(this.props.movie.movies.currentHour)}
              </div>
            </div>

            <div className='row d-flex justify-content-center'>
              <div className='col-12 mt-5' >
                {this.props.movie.movies.extras}
              </div>
            </div>            
            <div className='row d-flex justify-content-center'>
              <div className='col-12 mt-3' dangerouslySetInnerHTML={{ __html: this.props.movie.movies.summary }} >
              </div>
            </div>            
            {
            this.props.movie.movies.hours.length ?               
            <div className='row d-flex justify-content-center'>
              <div className='col-12 mt-4'>
                <p>
                <h4>Altre repliche</h4>                
                {timetable}
                </p>
              </div>
            </div>
            :<></>
            }
          </div>

          <Modal isOpen={this.state.isEditModalOpen} toggle={this.toggleEditModal}>
            <ModalHeader toggle={this.toggleEditModal}>Add Movie</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.handleFavouriteAdd}>
                <FormGroup>
                  <Label htmlFor="title">Title:</Label> {this.state.title}
                </FormGroup>
                <FormGroup>
                  <Label className='mr-2' htmlFor="rating">Rating</Label>
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
                  <Label htmlFor="comment">Comment</Label>
                  <Input type="text" id="comment" name="comment" defaultValue={this.state.currentlyEdited ? this.state.currentlyEdited.comment : ''}
                    innerRef={(input) => this.comment = input} />
                </FormGroup>
                <Button className='mr-3' type="submit" value="Edit" color="primary">Edit</Button>
                <Button onClick={() => this.toggleEditModal()}>Cancel</Button>
              </Form>
            </ModalBody>
          </Modal>
        </>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Movie);