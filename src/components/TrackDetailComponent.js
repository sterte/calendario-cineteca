import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageLoader from './PageLoader';
import ScrollToTopButton from './ScrollToTopButton';
import { getTrackDetail } from '../redux/trackDetail';
import { setProvider } from '../redux/provider';
import { movieListDetail } from './MovieUtils';
import { Fade, Stagger } from './Animations';
import { Helmet } from 'react-helmet-async';

function TrackDetail({ provider: providerParam, trackId }) {
    const trackDetail = useSelector(state => state.trackDetail);
    const provider = useSelector(state => state.provider.activeProvider);
    const dispatch = useDispatch();

    useEffect(() => {
        if (providerParam && providerParam !== provider) {
            dispatch(setProvider(providerParam));
        }
        dispatch(getTrackDetail(trackId));
    }, [dispatch, providerParam, trackId]); // eslint-disable-line react-hooks/exhaustive-deps

    if (trackDetail.isLoading) {
        return <PageLoader />;
    }

    const tracksList = !trackDetail?.trackDetail?.movies?.length ?
        <Stagger in='true'>
            <h4 className='row mt-4 p-4 p-md-0'>Programma non disponibile per la data selezionata</h4>
        </Stagger>
        :
        trackDetail.trackDetail.movies.map((movie) => movieListDetail(movie, true));

    return (
        <div className='container white-back'>
            <Helmet>
                <title>Cinetecalendar - {trackDetail.trackDetail.title}</title>
                <meta name='description' content={'Cinetecalendar - ' + trackDetail.trackDetail.title} />
            </Helmet>
            <div className='row row-content d-flex justify-content-center'>
                <div className='col-12 mt-4 col-auto d-flex align-self-center'>
                    <h2 dangerouslySetInnerHTML={{__html: trackDetail.trackDetail.title}} />
                </div>
                <div className='col-12 m-4' dangerouslySetInnerHTML={{__html: trackDetail.trackDetail.description}} />
                <div className='m-4'>
                    <Fade in='true'>
                        {tracksList}
                    </Fade>
                </div>
            </div>
            <ScrollToTopButton />
        </div>
    );
}

export default TrackDetail;
