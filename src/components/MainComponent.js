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
import { clearTabs, setCurrentTab, swipeTabCircular } from '../redux/tabs';
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

    // Tab0 hosts Calendar and Rassegne — keep selectedTabIndex in sync when navigating via <Link> or NavLink
    useEffect(() => {
        if (location.pathname.startsWith('/calendar') || location.pathname.startsWith('/tracks')) {
            dispatch(setCurrentTab(0));
        }
    }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    const swipeHandlers = useSwipeable({
        swipeDuration: 500,
        onSwiped: (eventData) => {
            const step = eventData.dir === LEFT ? 1 : eventData.dir === RIGHT ? -1 : 0;
            if (step !== 0) {
                dispatch(swipeTabCircular(step));
            }
        }
    });

    // Circuit selector is full-screen, no header/footer
    if (location.pathname === '/' || location.pathname === '/circuits') {
        return <CircuitSelect />;
    }

    const isTracksPath = location.pathname.startsWith('/tracks');

    // Overlay routes: rendered above the tab system (higher z-index), Tab0 stays active
    const isOverlayPath = location.pathname.startsWith('/diary') ||
                          location.pathname.startsWith('/personalarea') ||
                          location.pathname.startsWith('/reset-password');

    const isMoviePath = location.pathname.startsWith('/movie');
    const currentMovieInTabs = isMoviePath ? tabs.tabs.find(t => t.url === location.pathname) : null;
    const calendarProviderFromUrl = location.pathname.startsWith('/calendar')
        ? (location.pathname.split('/')[2] || provider)
        : provider;

    return (
        <div>
            <div style={{ position: 'sticky', top: 0, zIndex: 1020 }}>
                <Header />
                {!isOverlayPath && <TabBar />}
            </div>
            <div {...swipeHandlers}>

                {/* ── Tab content ── hidden when on overlay routes */}
                <div style={{ display: isOverlayPath ? 'none' : 'block' }}>

                    {/* Tab0: Calendar (keep-alive) + Rassegne (inline, same tab) */}
                    <div style={{ display: tabs.selectedTabIndex === 0 ? 'block' : 'none' }}>
                        {/* Calendar always mounted for keep-alive; hidden while browsing rassegne */}
                        <div style={{ display: isTracksPath ? 'none' : 'block' }}>
                            <Calendar provider={calendarProviderFromUrl} />
                        </div>
                        {isTracksPath && (
                            <Switch location={location}>
                                <Route path="/tracks/:provider/:trackId" render={({ match }) =>
                                    <TrackDetail provider={match.params.provider} trackId={match.params.trackId} />} />
                                <Route path="/tracks/:provider" render={({ match }) =>
                                    <Tracks provider={match.params.provider} />} />
                                <Redirect from="/tracks" to={`/tracks/${provider}`} />
                            </Switch>
                        )}
                    </div>

                    {/* Movie tabs — each mounted once, visible only when active */}
                    {tabs.tabs.map((tab, index) => (
                        <div key={tab.id} style={{ display: tabs.selectedTabIndex === index + 1 ? 'block' : 'none' }}>
                            <Movie provider={tab.provider} categoryId={tab.categoryId} movieId={tab.movieId} repeatId={tab.repeatId} visible={tabs.selectedTabIndex === index + 1} />
                        </div>
                    ))}

                    {/* Fallback Switch: direct movie URL (no open tab) + null-renders to prevent spurious redirects */}
                    <Switch location={location}>
                        <Route path="/calendar" render={() => null} />
                        <Route path="/tracks" render={() => null} />
                        <Route path="/diary" render={() => null} />
                        <Route path="/personalarea" render={() => null} />
                        <Route path="/reset-password" render={() => null} />
                        <Route exact path="/movie/:provider/:categoryId/:movieId/:repeatId" render={({ match }) => (
                            currentMovieInTabs ? null : (
                                <Movie provider={match.params.provider} categoryId={match.params.categoryId} movieId={match.params.movieId} repeatId={match.params.repeatId} />
                            )
                        )} />
                        <Redirect to="/" />
                    </Switch>
                </div>

                {/* ── Overlay div ── covers tab content for non-tab pages */}
                <div style={{ display: isOverlayPath ? 'block' : 'none', position: 'relative', zIndex: 10 }}>
                    <Switch location={location}>
                        <Route path="/reset-password" component={() => <ResetPassword />} />
                        <PrivateRoute path="/diary" component={() => <PersonalArea />} />
                        <PrivateRoute path="/personalarea" component={() => <Settings />} />
                    </Switch>
                </div>

            </div>
            <Footer />
        </div>
    );
}

export default Main;
