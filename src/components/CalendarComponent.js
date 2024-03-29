import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { getDayProgram } from '../redux/ActionCreators'
import { Fade, Stagger } from 'react-animation-components';
import { connect } from 'react-redux';
import Loading from './LoadingComponent';
import moment from 'moment';
import ScrollToTopButton from './ScrollToTopButton';
import { weekDays, movieListDetail } from './MovieUtils';
import { Helmet } from 'react-helmet-async';


const mapStateToProps = (state) => {
    return {
        days: state.days
    }
}

const mapDispatchToProps = (dispatch) => ({
    getDayProgram: (day) => { dispatch(getDayProgram(day)) }
});

class Calendar extends Component {

    constructor(props){
        super(props);
        this.state = {
            currentDate: new Date(),
            filter: {
                lumiere: false,
                cervi: false,
                modernissimo: false
            }        
        }
    }
    componentDidMount() {        
        if(!this.props.days.isLoading){
            this.preloadDays(new Date(), 8);
        }
    }

    changeCurrentDate(days){        
        var origDate = new Date(this.state.currentDate);
        var tmpMoment = moment(origDate);
        tmpMoment.add(days, 'days');
        var newDate = tmpMoment.toDate();
        this.preloadDays(newDate, -3)            
        this.setState({currentDate: newDate});     
    }

    preloadDays = (date, lookahead) => {
        var tmpMoment = moment(date);  
        let from = 0;
        let to = lookahead;
        if(lookahead < 0){
            from = lookahead;
            to = lookahead * - 1;
            tmpMoment.add(lookahead + 1, 'days')
        }      
        for(let i = from; i < to; i++){ 
            const currentDate = tmpMoment.format('YYYY-MM-DD');   
            let currentMovies = this.props.days.days.find(el => el.day === currentDate)
            if(!currentMovies){
                this.props.getDayProgram(currentDate);
            }
            tmpMoment.add(1, 'days');
        }
    }

    formatDate(date, format = 'YYYY-MM-DD'){
        var tmpDate = new Date(date);
        var tmpMoment = moment(tmpDate);
        return tmpMoment.format(format);
    }

    isMovieFiltered = (movie) => {
        if(!this.state.filter.lumiere && !this.state.filter.cervi && !this.state.filter.modernissimo){
            return true;
        }
        if(movie.place.includes('ervi') && this.state.filter.cervi){
            return true;
        }
        if(movie.place.includes('umi') && this.state.filter.lumiere){
            return true;
        }
        if(movie.place.includes('oder') && this.state.filter.modernissimo){
            return true;
        }
        return false;
    }

    render() {
        var tmpMoment = moment(this.state.currentDate).format('YYYY-MM-DD');
        if (this.props.days.loadingState[tmpMoment] !== 1) {
            return (<div className='container'>            
                <Loading size={5} />
            </div>);
        }
        else {
            const movielist = this.props.days.days.filter((day) => day.day === this.formatDate(this.state.currentDate)).length === 0 ?
                <Stagger in='true'>                
                    <h4 className='row mt-4 p-4 p-md-0'>Programma non disponibile per la data selezionata</h4>                
                </Stagger>
            :            
            this.props.days.days.filter((day) => day.day === this.formatDate(this.state.currentDate))[0].movies
            .filter((movie) => this.isMovieFiltered(movie))
            .map((movie) => {
                return movieListDetail(movie);
            });

            return (
                <div className='container white-back'>
                    <Helmet>
                        <title>Cinetecalendar</title>
                        <meta name='description' content={'Cinetecalendar'} />
                    </Helmet>
                    
                    {this.props.days.isLoading > 0 &&
                    <div style={{position: 'absolute', top: 20, right: 20}}>
                        <Loading size={2} />
                    </div>
                    }

                    <div className='row row-content d-flex justify-content-center'>
                        <div className='col-12'>
                        <div className='row d-flex justify-content-center'>
                        <div className='col-3 col-md-auto order-2 order-md-1'>
                            <Button className='navigation-button' onClick={() => this.changeCurrentDate(-7)}>                    
                                <span className="fa fa-angle-double-left" />
                                <span className="d-none d-md-block">Settimana</span>
                            </Button>                
                        </div>

                        <div className='col-3 col-md-auto order-3 order-md-2'>
                            <Button className='navigation-button' onClick={() => this.changeCurrentDate(-1)}>                    
                                <span className="fa fa-angle-left" />
                                <span className="d-none d-md-block">Giorno</span>
                            </Button>                
                        </div>

                        <div className='col-12 col-md-auto order-1 order-md-3'>
                            <div className='row d-flex justify-content-center'>
                                <h5 style={this.labelStyle}>{weekDays[this.state.currentDate.getDay()]}</h5>
                            </div>
                            <div className='row d-flex justify-content-center'>
                                <h4 style={this.labelStyle}>{this.formatDate(this.state.currentDate, 'DD/MM/YYYY')}</h4>
                            </div>
                        </div>

                        <div className='col-3 col-md-auto order-4'>
                            <Button className='navigation-button' onClick={() => this.changeCurrentDate(1)}>                    
                                <span className="fa fa-angle-right" />                        
                                <span className="d-none d-md-block">Giorno</span>
                            </Button>                
                        </div>

                        <div className='col-3 col-md-auto order-5'>
                            <Button className='navigation-button' onClick={() => this.changeCurrentDate(7)}>                    
                                <span className="fa fa-angle-double-right" />
                                <span className="d-none d-md-block">Settimana</span>
                            </Button>
                        </div>
                        </div>
                        </div>
                        <div className='col-12'>
                        <div className='row d-flex justify-content-around mt-4'>
                        <div>
                            <input
                            type='checkbox' name='lumiere' value='lumiere' 
                            checked={this.state.filter?.lumiere}
                            onChange={() => {;var tmpFilter = {...this.state.filter}; tmpFilter.lumiere = !tmpFilter?.lumiere; this.setState({filter: tmpFilter})}}
                            />
                            <label className='ml-1' htmlFor='lumiere'><h5>Lumiére</h5></label>
                        </div>
                        <div>
                            <input
                            type='checkbox' name='cervi' value='cervi' 
                            checked={this.state.filter?.cervi}
                            onChange={() => {;var tmpFilter = {...this.state.filter}; tmpFilter.cervi = !tmpFilter?.cervi; this.setState({filter: tmpFilter})}}
                            />
                            <label className='ml-1' htmlFor='cervi'><h5>Cervi</h5></label>
                        </div>
                        <div>
                            <input
                            type='checkbox' name='modernissimo' value='modernissimo' 
                            checked={this.state.filter?.modernissimo}
                            onChange={() => {;var tmpFilter = {...this.state.filter}; tmpFilter.modernissimo = !tmpFilter?.modernissimo; this.setState({filter: tmpFilter})}}
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);