import React, { useEffect } from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Calendar from './CalendarComponent';
import PersonalArea from './PersonalAreaComponent';
import Settings from './SettingsComponent';
import Movie from './MovieComponent';
import Tracks from './TracksComponent';
import TrackDetail from './TrackDetailComponent';
import CircuitSelect from './CircuitSelectComponent';
import ResetPassword from './ResetPasswordComponent';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { refreshToken } from '../redux/auth';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const auth = useSelector(state => state.auth);
    return (
        <Route {...rest} render={(props) => (
            auth.isAuthenticated
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/calendar/cineteca', state: { from: props.location } }} />
        )} />
    );
};

function Main() {
    const location = useLocation();
    const auth = useSelector(state => state.auth);
    const provider = useSelector(state => state.provider.activeProvider);
    const dispatch = useDispatch();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', provider);
    }, [provider]);

    useEffect(() => {
        if (!auth.isAuthenticated) return;
        dispatch(refreshToken());
    }, [auth.isAuthenticated, dispatch]);

    // Circuit selector is full-screen, no header/footer
    if (location.pathname === '/' || location.pathname === '/circuits') {
        return <CircuitSelect />;
    }

    return (
        <div>
        <Header />
        <Switch location={location}>
        <Route exact path="/movie/:provider/:categoryId/:movieId/:repeatId" render={({match}) => (
            <Movie provider={match.params.provider} categoryId={match.params.categoryId} movieId={match.params.movieId} repeatId={match.params.repeatId} />
        )} />
        <Route path="/reset-password" component={() => <ResetPassword />} />
        <Route path="/calendar/:provider" render={({match}) => <Calendar provider={match.params.provider} />} />
        <Redirect from="/calendar" to="/calendar/cineteca" />
        <Route path="/tracks/:provider/:trackId" render={({match}) => <TrackDetail provider={match.params.provider} trackId={match.params.trackId} />} />
        <Route path="/tracks/:provider" render={({match}) => <Tracks provider={match.params.provider} />} />
        <Redirect from="/tracks" to={`/tracks/${provider}`} />
        <PrivateRoute path="/diary" component={() => <PersonalArea />} />
        <PrivateRoute path="/personalarea" component={() => <Settings />} />
        <Redirect to="/" />
        </Switch>
        <Footer />
        </div>
    );
}

export default Main;
