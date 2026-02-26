import React, { useEffect } from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Calendar from './CalendarComponent';
import PersonalArea from './PersonalAreaComponent';
import Movie from './MovieComponent';
import Tracks from './TracksComponent';
import TrackDetail from './TrackDetailComponent';
import ChatAI from './ChatAIComponent';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const auth = useSelector(state => state.auth);
    return (
        <Route {...rest} render={(props) => (
            auth.isAuthenticated
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/calendar', state: { from: props.location } }} />
        )} />
    );
};

function Main() {
    const location = useLocation();
    const auth = useSelector(state => state.auth);
    const provider = useSelector(state => state.provider.activeProvider);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', provider);
    }, [provider]);

    return (
        <div>
        <Header />
        <TransitionGroup>
        <CSSTransition key={location.key} classNames="page" timeout={300}>
        <Switch location={location}>
        <Route exact path="/movie/:categoryId/:movieId/:repeatId" render={({match}) => (
            <Movie categoryId={match.params.categoryId} movieId={match.params.movieId} repeatId={match.params.repeatId} />
        )} />
        <Route path="/calendar" component={() => <Calendar />} />
        <Route path="/tracks/:trackId" render={({match}) => <TrackDetail trackId={match.params.trackId} />} />
        <Route path="/tracks" component={() => <Tracks />} />
        <PrivateRoute path="/personalarea" component={() => <PersonalArea />} />
        <PrivateRoute path="/chat-ai" component={() => <ChatAI isAdmin={auth.isAdmin} />} />
        <Redirect to="/calendar" />
        </Switch>
        </CSSTransition>
        </TransitionGroup>
        <Footer />
        </div>
    );
}

export default Main;
