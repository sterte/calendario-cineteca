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
            currentDate: new Date()          
        }
    }
    componentDidMount() {        
        if(!this.props.days.isLoading){
            var tmpMoment = moment(new Date());        
            for(let i = 0; i < 7; i++){ 
                const currentDate = tmpMoment.format('YYYY-MM-DD');   
                let currentMovies = this.props.days.days.find(el => el.day === currentDate)
                if(!currentMovies){
                    this.props.getDayProgram(currentDate);
                }
                tmpMoment.add(1, 'days');
            }
        }
    }

    changeCurrentDate(days){        
        var origDate = new Date(this.state.currentDate);
        var tmpMoment = moment(origDate);
        tmpMoment.add(days, 'days');
        var newDate = tmpMoment.toDate();
        const formattedDate = tmpMoment.format('YYYY-MM-DD');

        let currentMovies = this.props.days.days.find(el => el.day === formattedDate)
        if(!currentMovies){
            this.props.getDayProgram(formattedDate); //TODO singoli giorni   
        }            
        this.setState({currentDate: newDate});     
    }

    formatDate(date, format = 'YYYY-MM-DD'){
        var tmpDate = new Date(date);
        var tmpMoment = moment(tmpDate);
        return tmpMoment.format(format);
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
            this.props.days.days.filter((day) => day.day === this.formatDate(this.state.currentDate))[0].movies.map((movie) => {
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