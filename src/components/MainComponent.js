import React, { Component } from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Calendar from './CalendarComponent';
import Movie from './MovieComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


const CalendarWithDate = ({match}) => {
  return(
    <Calendar year={match.params.year} month ={match.params.month} day={match.params.day} />
  );
}

const MovieWithId = ({match}) => {
  return(
    <Movie movieId={match.params.movieId} />
  );
}

class Main extends Component{


  render() {

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();    
    const todayUrl = '/calendar/'+year+'/'+month+'/'+day;

    return (
      <div>      
      <Header />
      <TransitionGroup>
      <CSSTransition key={this.props.location.key} classNames="page" timeout={300} >
      <Switch>
      <Redirect exact from="/calendar" to={todayUrl} />
      <Route path="/calendar/:year/:month/:day" component={CalendarWithDate} />
      <Route path="/movie/:movieId" component={MovieWithId} />
      <Redirect to="/calendar" />
      </Switch>
      </CSSTransition>
      </TransitionGroup>
      <Footer />
      </div>
      );
  }
}

export default withRouter(Main);
