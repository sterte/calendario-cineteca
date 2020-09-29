import React, { Component } from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Calendar from './CalendarComponent';
import Movie from './MovieComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import { loginUser, logoutUser, signupUser } from '../redux/ActionCreators';




const mapStateToProps = state => {
  return {    
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => ({
  loginUser: (creds) => dispatch(loginUser(creds)),
  logoutUser: () => dispatch(logoutUser()),
  signupUser: (creds) => dispatch(signupUser(creds))
});


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
    const todayUrl = '/days/'+year+'/'+month+'/'+day;

    return (
      <div>      
      <Header auth={this.props.auth} 
          loginUser={this.props.loginUser} 
          logoutUser={this.props.logoutUser}
          signupUser={this.props.signupUser} />
      <TransitionGroup>
      <CSSTransition key={this.props.location.key} classNames="page" timeout={300} >
      <Switch>
      <Redirect exact from="/days" to={todayUrl} />
      <Route path="/days/:year/:month/:day" component={CalendarWithDate} />
      <Route path="/movie/:movieId" component={MovieWithId} />
      <Redirect to={todayUrl} />
      </Switch>
      </CSSTransition>
      </TransitionGroup>
      <Footer />
      </div>
      );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (Main));
