import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { getDayProgram } from '../redux/days';
import { Fade, Stagger } from 'react-animation-components';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './LoadingComponent';
import moment from 'moment';
import ScrollToTopButton from './ScrollToTopButton';
import { weekDays, movieListDetail } from './MovieUtils';
import { Helmet } from 'react-helmet-async';

function Calendar() {
    const days = useSelector(state => state.days);
    const dispatch = useDispatch();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [filter, setFilter] = useState({ lumiere: false, cervi: false, modernissimo: false });

    const preloadDays = (date, lookahead) => {
        let tmpMoment = moment(date);
        let from = 0;
        let to = lookahead;
        if (lookahead < 0) {
            from = lookahead;
            to = lookahead * -1;
            tmpMoment.add(lookahead + 1, 'days');
        }
        for (let i = from; i < to; i++) {
            const dateStr = tmpMoment.format('YYYY-MM-DD');
            if (!days.days.find(el => el.day === dateStr)) {
                dispatch(getDayProgram(dateStr));
            }
            tmpMoment.add(1, 'days');
        }
    };

    useEffect(() => {
        preloadDays(new Date(), 8);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const changeCurrentDate = (numDays) => {
        const newDate = moment(currentDate).add(numDays, 'days').toDate();
        preloadDays(newDate, -3);
        setCurrentDate(newDate);
    };

    const formatDate = (date, format = 'YYYY-MM-DD') => moment(new Date(date)).format(format);

    const isMovieFiltered = (movie) => {
        if (!filter.lumiere && !filter.cervi && !filter.modernissimo) return true;
        if (movie.place.includes('ervi') && filter.cervi) return true;
        if (movie.place.includes('umi') && filter.lumiere) return true;
        if (movie.place.includes('oder') && filter.modernissimo) return true;
        return false;
    };

    const tmpMoment = moment(currentDate).format('YYYY-MM-DD');
    if (days.loadingState[tmpMoment] !== 1) {
        return <div className='container'><Loading size={5} /></div>;
    }

    const movielist = days.days.filter(day => day.day === formatDate(currentDate)).length === 0 ?
        <Stagger in='true'>
            <h4 className='row mt-4 p-4 p-md-0'>Programma non disponibile per la data selezionata</h4>
        </Stagger>
        :
        days.days
            .filter(day => day.day === formatDate(currentDate))[0].movies
            .filter(movie => isMovieFiltered(movie))
            .map(movie => movieListDetail(movie));

    return (
        <div className='container white-back'>
            <Helmet>
                <title>Cinetecalendar</title>
                <meta name='description' content={'Cinetecalendar'} />
            </Helmet>

            {days.isLoading > 0 &&
                <div style={{position: 'absolute', top: 20, right: 20}}>
                    <Loading size={2} />
                </div>
            }

            <div className='row row-content d-flex justify-content-center'>
                <div className='col-12'>
                    <div className='row d-flex justify-content-center'>
                        <div className='col-3 col-md-auto order-2 order-md-1'>
                            <Button className='navigation-button' onClick={() => changeCurrentDate(-7)}>
                                <span className="fa fa-angle-double-left" />
                                <span className="d-none d-md-block">Settimana</span>
                            </Button>
                        </div>
                        <div className='col-3 col-md-auto order-3 order-md-2'>
                            <Button className='navigation-button' onClick={() => changeCurrentDate(-1)}>
                                <span className="fa fa-angle-left" />
                                <span className="d-none d-md-block">Giorno</span>
                            </Button>
                        </div>
                        <div className='col-12 col-md-auto order-1 order-md-3'>
                            <div className='row d-flex justify-content-center'>
                                <h5>{weekDays[currentDate.getDay()]}</h5>
                            </div>
                            <div className='row d-flex justify-content-center'>
                                <h4>{formatDate(currentDate, 'DD/MM/YYYY')}</h4>
                            </div>
                        </div>
                        <div className='col-3 col-md-auto order-4'>
                            <Button className='navigation-button' onClick={() => changeCurrentDate(1)}>
                                <span className="fa fa-angle-right" />
                                <span className="d-none d-md-block">Giorno</span>
                            </Button>
                        </div>
                        <div className='col-3 col-md-auto order-5'>
                            <Button className='navigation-button' onClick={() => changeCurrentDate(7)}>
                                <span className="fa fa-angle-double-right" />
                                <span className="d-none d-md-block">Settimana</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='row d-flex justify-content-around mt-4'>
                        <div>
                            <input type='checkbox' name='lumiere' value='lumiere'
                                checked={filter.lumiere}
                                onChange={() => setFilter(f => ({...f, lumiere: !f.lumiere}))}
                            />
                            <label className='ml-1' htmlFor='lumiere'><h5>Lumiére</h5></label>
                        </div>
                        <div>
                            <input type='checkbox' name='cervi' value='cervi'
                                checked={filter.cervi}
                                onChange={() => setFilter(f => ({...f, cervi: !f.cervi}))}
                            />
                            <label className='ml-1' htmlFor='cervi'><h5>Cervi</h5></label>
                        </div>
                        <div>
                            <input type='checkbox' name='modernissimo' value='modernissimo'
                                checked={filter.modernissimo}
                                onChange={() => setFilter(f => ({...f, modernissimo: !f.modernissimo}))}
                            />
                            <label className='ml-1' htmlFor='modernissimo'><h5>Modernissimo</h5></label>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row row-content d-flex justify-content-center'>
                <Fade in={true}>
                    {movielist}
                </Fade>
            </div>
            <ScrollToTopButton />
        </div>
    );
}

export default Calendar;
