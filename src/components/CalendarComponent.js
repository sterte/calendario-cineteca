import React, { useState, useEffect } from 'react';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { getDayProgram } from '../redux/days';
import { Fade, Stagger } from 'react-animation-components';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './LoadingComponent';
import moment from 'moment';
import ScrollToTopButton from './ScrollToTopButton';
import { weekDays, movieListDetail } from './MovieUtils';
import { setProvider } from '../redux/provider';
import { Helmet } from 'react-helmet-async';

function Calendar({ provider: providerParam }) {
    const days = useSelector(state => state.days);
    const provider = useSelector(state => state.provider.activeProvider);
    const dispatch = useDispatch();

    useEffect(() => {
        if (providerParam && providerParam !== provider) {
            dispatch(setProvider(providerParam));
        }
    }, [providerParam]);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [filter, setFilter] = useState({});
    const [filterOpen, setFilterOpen] = useState(false);

    const locationFilters = {
        cineteca: [
            { key: 'cervi',        label: 'Cervi',        match: 'ervi' },
            { key: 'lumiere',      label: 'Lumiére',      match: 'umi' },
            { key: 'modernissimo', label: 'Modernissimo', match: 'oder' },
        ],
        ccb: [
            { key: 'europa', label: 'Europa', match: 'Europa' },
            { key: 'odeon',  label: 'Odeon',  match: 'Odeon' },
            { key: 'rialto', label: 'Rialto', match: 'Rialto' },
            { key: 'roma',   label: 'Roma',   match: 'Roma' },
        ],
        popup: [
            { key: 'arlecchino', label: 'Arlecchino', match: 'rlecchino' },
            { key: 'bristol',    label: 'Bristol',     match: 'ristol' },
            { key: 'jolly',      label: 'Jolly',       match: 'olly' },
            { key: 'medica',     label: 'Medica',      match: 'edica' },
        ],
    };

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
        setFilter({});
        preloadDays(new Date(), provider === 'popup' ? 1 : 8);
    }, [provider]); // eslint-disable-line react-hooks/exhaustive-deps

    const changeCurrentDate = (numDays) => {
        const newDate = moment(currentDate).add(numDays, 'days').toDate();
        if (provider === 'popup') {
            preloadDays(newDate, 1);
        } else {
            preloadDays(newDate, -3);
        }
        setCurrentDate(newDate);
    };

    const formatDate = (date, format = 'YYYY-MM-DD') => moment(new Date(date)).format(format);

    const isMovieFiltered = (movie) => {
        const locations = locationFilters[provider] || [];
        const active = locations.filter(loc => filter[loc.key]);
        if (active.length === 0) return true;
        return active.some(loc => movie.place.includes(loc.match));
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
            .map(movie => movieListDetail(movie, false, provider));

    return (
        <div className='container white-back'>
            <Helmet>
                <title>Cinetecalendar</title>
                <meta name='description' content={'Cinetecalendar'} />
            </Helmet>

            <div className='row row-content d-flex justify-content-center'>
                <div className='col-12'>
                    <div className='row d-flex justify-content-center'>
                        <div className='col-3 col-md-auto order-2 order-md-1 d-flex align-items-center justify-content-center'>
                            <Button className='navigation-button' onClick={() => changeCurrentDate(-7)}>
                                <span className="fa fa-angle-double-left" />
                                <span className="d-none d-md-block">Settimana</span>
                            </Button>
                        </div>
                        <div className='col-3 col-md-auto order-3 order-md-2 d-flex align-items-center justify-content-center'>
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
                        <div className='col-3 col-md-auto order-4 d-flex align-items-center justify-content-center'>
                            <Button className='navigation-button' onClick={() => changeCurrentDate(1)}>
                                <span className="fa fa-angle-right" />
                                <span className="d-none d-md-block">Giorno</span>
                            </Button>
                        </div>
                        <div className='col-3 col-md-auto order-5 d-flex align-items-center justify-content-center'>
                            <Button className='navigation-button' onClick={() => changeCurrentDate(7)}>
                                <span className="fa fa-angle-double-right" />
                                <span className="d-none d-md-block">Settimana</span>
                            </Button>
                        </div>
                        {(locationFilters[provider] || []).length > 0 &&
                        <div className='col-3 col-md-auto order-6 d-flex align-items-center justify-content-center'>
                            <Dropdown isOpen={filterOpen} toggle={() => setFilterOpen(o => !o)}>
                                <DropdownToggle className='navigation-button btn btn-secondary' tag='button'>
                                    <span className="fa fa-photo-film" />
                                    {Object.values(filter).filter(Boolean).length > 0 &&
                                        <span className='badge badge-light ml-1'>
                                            {Object.values(filter).filter(Boolean).length}
                                        </span>
                                    }
                                    <span className="d-none d-md-block">Sale</span>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    {Object.values(filter).some(Boolean) && <>
                                        <DropdownItem onClick={() => setFilter({})}>
                                            <span className='fa fa-times mr-2' />
                                            Rimuovi filtri
                                        </DropdownItem>
                                        <DropdownItem divider />
                                    </>}
                                    {(locationFilters[provider] || []).map(loc => (
                                        <DropdownItem key={loc.key} toggle={false}
                                            onClick={() => setFilter(f => ({...f, [loc.key]: !f[loc.key]}))}>
                                            <span className={`fa mr-2 ${filter[loc.key] ? 'fa-check-square' : 'fa-square-o'}`} />
                                            {loc.label}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        }
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
