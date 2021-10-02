import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getDayProgram } from '../redux/ActionCreators'
import { Fade, Stagger } from 'react-animation-components';
import { connect } from 'react-redux';
import { fetchUrl } from '../shared/baseUrl'
import Loading from './LoadingComponent';
import moment from 'moment';
import ScrollToTopButton from './ScrollToTopButton';
import { movieListDetail } from './MovieUtils';


const mapStateToProps = (state) => {
    return {
        days: state.days
    }
}

const mapDispatchToProps = (dispatch) => ({
    getDayProgram: (from, to) => { dispatch(getDayProgram(from, to)) }
});

const weekDays = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

class Calendar extends Component {

    constructor(props){
        super(props);
        this.state = {
            currentDate: new Date()          
        }
    }
    componentDidMount() {        
        var tmpMoment = moment(new Date());        
        var from = tmpMoment.format('YYYYMMDD');                        
        tmpMoment.add(7, 'days');                 
        var to = tmpMoment.format('YYYYMMDD');                
        this.props.getDayProgram(from, to)
    }

    changeCurrentDate(days){        
        var origDate = new Date(this.state.currentDate);
        var tmpMoment = moment(origDate);
        tmpMoment.add(days, 'days');
        var newDate = tmpMoment.toDate();
        const formattedDate = tmpMoment.format('YYYYMMDD');
        if(this.props.days.days.length !== 0 && formattedDate < this.props.days.days[0].day){            
            tmpMoment.add(1, 'days');
            const to = tmpMoment.format('YYYYMMDD');
            tmpMoment.add(-8, 'days');
            const from = tmpMoment.format('YYYYMMDD');
            this.props.getDayProgram(from, to);               
        }
        else if(this.props.days.days.length !== 0 && formattedDate > this.props.days.days[this.props.days.days.length - 1].day){
            tmpMoment.add(-1, 'days');
            const from = tmpMoment.format('YYYYMMDD');
            tmpMoment.add(7, 'days');
            const to = tmpMoment.format('YYYYMMDD');
            this.props.getDayProgram(from, to);                        
        }       
        else if(this.props.days.days.length === 0){
            tmpMoment.add(-7, 'days');
            const from = tmpMoment.format('YYYYMMDD');            
            tmpMoment.add(14, 'days');
            const to = tmpMoment.format('YYYYMMDD');            
            this.props.getDayProgram(from, to);               
        }   
        this.setState({currentDate: newDate});     
    }

    formatDate(date, format = 'YYYYMMDD'){
        var tmpDate = new Date(date);
        var tmpMoment = moment(tmpDate);
        return tmpMoment.format(format);
    }

    render() {
        if (this.props.days.isLoading) {
            return (<div className='container'>            
                <Loading />
            </div>);
        }
        else {

            const movielist = this.props.days.days.filter((day) => day.day === this.formatDate(this.state.currentDate)).length === 0 ?
                <Stagger in>                
                    <h4 className='row mt-4 p-4 p-md-0'>Programma non disponibile per la data selezionata</h4>                
                </Stagger>
            :            
            this.props.days.days.filter((day) => day.day === this.formatDate(this.state.currentDate))[0].movies.map((movie) => {
                return movieListDetail(movie);
            });

            return (
                <div className='container white-back'>
                    <div className='row row-content d-flex justify-content-center'>
                        <div className='col-3 col-md-auto order-2 order-md-1'>
                            <Button className='navigation-button' onClick={() => this.changeCurrentDate(-7)}>                    
                                <span className="fa fa-angle-double-left" />
                                <span class="d-none d-md-block">Settimana</span>
                            </Button>                
                        </div>

                        <div className='col-3 col-md-auto order-3 order-md-2'>
                            <Button className='navigation-button' onClick={() => this.changeCurrentDate(-1)}>                    
                                <span className="fa fa-angle-left" />
                                <span class="d-none d-md-block">Giorno</span>
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
                                <span class="d-none d-md-block">Giorno</span>
                            </Button>                
                        </div>

                        <div className='col-3 col-md-auto order-5'>
                            <Button className='navigation-button' onClick={() => this.changeCurrentDate(7)}>                    
                                <span className="fa fa-angle-double-right" />
                                <span class="d-none d-md-block">Settimana</span>
                            </Button>
                        </div>
                    </div>
                    <div className='row row-content d-flex justify-content-center'>
                        <Fade in>                            
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