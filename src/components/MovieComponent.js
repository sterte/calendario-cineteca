import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Fade } from 'react-animation-components';
import Loading from './LoadingComponent';
import { getMovieDetail } from '../redux/ActionCreators';
import ReactAddToCalendar from 'react-add-to-calendar';


const mapStateToProps = (state) => {
  return {
    movie: state.movies
  }
}

const mapDispatchToProps = (dispatch) => ({
  getMovieDetail: (movieId) => { dispatch(getMovieDetail(movieId)) }
});

class Movie extends Component {

  componentDidMount() {
    this.props.getMovieDetail(this.props.movieId)
  }

  render() {

    if (this.props.movie.isLoading) {
      return (<div className='container'><Loading /></div>);
    }
    else {

      const timetable = this.props.movie.movies.hours.map((hour) => {
        let items = [
          { google: 'Google' },
          { outlook: 'Outlook' },
          { yahoo: 'Yahoo' }
        ];

        let icon = { 'calendar-plus-o': 'left' };

        const splitDate = hour.day.trim().split(/\s+/);
        const year = splitDate[3];
        var month = splitDate[2];
        const day = splitDate[1];

        switch (month) {
          case 'gennaio':
            month = 0;
            break;
          case 'febbraio':
            month = 1;
            break;
          case 'marzo':
            month = 2;
            break;
          case 'aprile':
            month = 3;
            break;
          case 'maggio':
            month = 4;
            break;
          case 'giugno':
            month = 5;
            break;
          case 'luglio':
            month = 6;
            break;
          case 'agosto':
            month = 7;
            break;
          case 'settembre':
            month = 8;
            break;
          case 'ottobre':
            month = 9;
            break;
          case 'novembre':
            month = 10;
            break;
          case 'dicembre':
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
          <Fade in>
            <div className='row mt-4'>
              <h5>{hour.day}</h5>
            </div>
            {hour.hours.map((show) => {


              let [hh, mm] = show.split('.');

              oraInizio.setHours(hh, mm, 0, 0);
              let oraFine = new Date(oraInizio.getTime() + (1000 * 60 * 60 * 2));

              let event = {
                title: this.props.movie.movies.title,
                location: 'Cinema Lumière, Via Azzo Gardino, 65, 40122 Bologna, Italia',
                startTime: oraInizio.toISOString(),
                endTime: oraFine.toISOString()
              };

              return (
                <div className='row'>
                  <div className='col-2'>
                    {show}
                  </div>
                  <div className='col-4'>
                    <ReactAddToCalendar listItems={items} event={event} buttonLabel="Aggiungi al calendario" buttonTemplate={icon} />
                  </div>
                </div>
              );
            })}
          </Fade>
        );
      });

      return (
        <div className='container'>
          <div className='row d-flex justify-content-center mt-5'>
            <div className='col-6 d-flex align-self-center'>
              <div className='row'>
                <div className='col-12 d-flex align-self-center'>
                  <h2>{this.props.movie.movies.title}</h2>
                </div>
                <div className='col-12 d-flex align-self-center'>
                  {this.props.movie.movies.duration}
                </div>
              </div>
            </div>
            <div className='col-6'>
              <img src={this.props.movie.movies.image} className='img-fluid' alt={'img-' + this.props.movie.movies.image} />
            </div>
          </div>
          <div className='row d-flex justify-content-center'>
            <div className='col-12 mt-3'>
              <p>{this.props.movie.movies.summary}</p>
            </div>
          </div>
          <div className='row d-flex justify-content-center'>
            <div className='col-12 mt-3'>
              {timetable}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Movie);