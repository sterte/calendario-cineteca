import React, { Component } from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Calendar from './CalendarComponent';
import PersonalArea from './PersonalAreaComponent';
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


const MovieWithId = ({match}) => {
  return(
    <Movie movieId={match.params.movieId} />
  );
}

class Main extends Component{


  render() {

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={(props) => (
        this.props.auth.isAuthenticated
          ? <Component {...props} />
          : <Redirect to={{
              pathname: '/days',
              state: { from: props.location }
            }} />
      )} />
    );

    return (
      <div>      
      <Header auth={this.props.auth} 
          loginUser={this.props.loginUser} 
          logoutUser={this.props.logoutUser}
          signupUser={this.props.signupUser} />
      <TransitionGroup>
      <CSSTransition key={this.props.location.key} classNames="page" timeout={300} >
      <Switch>      
      <Route path="/movie/:movieId" component={MovieWithId} />
      <Route path="/days" component={() => <Calendar />} />
      <PrivateRoute path="/personalarea" component={() => <PersonalArea />} />
      <Redirect to="/days" />
      </Switch>
      </CSSTransition>
      </TransitionGroup>
      <Footer />
      </div>
      );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (Main));
