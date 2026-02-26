import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Fade } from 'react-animation-components';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './LoadingComponent';
import ScrollToTopButton from './ScrollToTopButton';
import { getTracks } from '../redux/tracks';
import { Helmet } from 'react-helmet-async';

function Tracks() {
    const tracks = useSelector(state => state.tracks);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTracks());
    }, [dispatch]);

    if (tracks.isLoading) {
        return <div className='container'><Loading /></div>;
    }

    const tracksList = tracks.tracks.length === 0 ?
        <Fade in={true}>
            <h4 className='row mt-4 p-4 p-md-0'>Non ci sono rassegne in corso</h4>
        </Fade>
        :
        tracks.tracks.map((track) => (
            <Fade in={true} className='row ml-1 mr-1 mb-5' key={track.id}>
                <div className='col-4 col-md-4'>
                    <img src={track.image} className='img-fluid' alt={'img-' + track.id} />
                </div>
                <div className='ml-3 ml-md-0 col-12 col-md-8'>
                    <div className='row'>
                        <Link to={`/tracks/${track.id}`}><h4 dangerouslySetInnerHTML={{__html: track.title}}></h4></Link>
                    </div>
                    <div className='row'>
                        <h5>{track.dateInfo}</h5>
                    </div>
                    <div className='row'>
                        <p dangerouslySetInnerHTML={{__html: track.description}}></p>
                    </div>
                </div>
            </Fade>
        ));

    return (
        <div className='container white-back'>
            <Helmet>
                <title>Cinetecalendar - Rassegne</title>
                <meta name='description' content={'Cinetecalendar - Rassegne'} />
            </Helmet>
            <div className='row row-content d-flex justify-content-center'>
                <Fade in={true}>
                    {tracksList}
                </Fade>
            </div>
            <ScrollToTopButton />
        </div>
    );
}

export default Tracks;
