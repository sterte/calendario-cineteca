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
import TabBar from './TabBar';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { refreshToken } from '../redux/auth';
import { clearTabs, swipeTabCircular } from '../redux/tabs';
import { useSwipeable, RIGHT, LEFT } from 'react-swipeable';

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
    const tabs = useSelector(state => state.tabs);
    const dispatch = useDispatch();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', provider);
        dispatch(clearTabs());
    }, [provider]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!auth.isAuthenticated) return;
        dispatch(refreshToken());
    }, [auth.isAuthenticated, dispatch]);

    const swipeHandlers = useSwipeable({
        swipeDuration: 500,
        onSwiped: (eventData) => {
            const step = eventData.dir === LEFT ? 1 : eventData.dir === RIGHT ? -1 : 0;
            if (step !== 0) {
                dispatch(swipeTabCircular(step))
            }
        }
    });

    // Circuit selector is full-screen, no header/footer
    if (location.pathname === '/' || location.pathname === '/circuits') {
        return <CircuitSelect />;
    }

    const isCalendarPath = tabs.selectedTabIndex === 0;
    const isMoviePath = location.pathname.startsWith('/movie');
    const currentMovieInTabs = isMoviePath ? tabs.tabs.find(t => t.url === location.pathname) : null;
    const calendarProviderFromUrl = isCalendarPath ? location.pathname.split('/')[2] : provider;

    return (
        <div>
            <Header />
            <TabBar />
            <div {...swipeHandlers}>
                {/* Keep-alive: Calendar — always mounted, visible only on /calendar */}
                <div style={{ display: isCalendarPath ? 'block' : 'none' }}>
                    <Calendar provider={calendarProviderFromUrl} />
                </div>

                {/* Keep-alive: Movie tabs — each mounted once, visible only when active */}
                {tabs.tabs.map((tab, index) => (
                    <div key={tab.id} style={{ display: (tabs.selectedTabIndex === (index + 1)) ? 'block' : 'none' }}>
                        <Movie provider={tab.provider} categoryId={tab.categoryId} movieId={tab.movieId} repeatId={tab.repeatId} visible={location.pathname === tab.url} />
                    </div>
                ))}

                {/* Switch: handles non-tab routes + fallback for direct movie URL (no tab) */}
                <Switch location={location}>
                    {/* Prevent redirect from firing on calendar paths (handled by keep-alive above) */}
                    <Route path="/calendar" render={() => null} />
                    {/* Movie via direct URL (no open tab): render normally */}
                    <Route exact path="/movie/:provider/:categoryId/:movieId/:repeatId" render={({ match }) => (
                        currentMovieInTabs ? null : (
                            <Movie provider={match.params.provider} categoryId={match.params.categoryId} movieId={match.params.movieId} repeatId={match.params.repeatId} />
                        )
                    )} />
                    <Route path="/reset-password" component={() => <ResetPassword />} />
                    <Route path="/tracks/:provider/:trackId" render={({ match }) => <TrackDetail provider={match.params.provider} trackId={match.params.trackId} />} />
                    <Route path="/tracks/:provider" render={({ match }) => <Tracks provider={match.params.provider} />} />
                    <Redirect from="/tracks" to={`/tracks/${provider}`} />
                    <PrivateRoute path="/diary" component={() => <PersonalArea />} />
                    <PrivateRoute path="/personalarea" component={() => <Settings />} />
                    <Redirect to="/" />
                </Switch>
            </div>
            <Footer />
        </div>
    );
}

export default Main;
