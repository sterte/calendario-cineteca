import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getDayProgram } from '../redux/ActionCreators'
import { Fade, Stagger } from 'react-animation-components';
import { connect } from 'react-redux';
import { fetchUrl } from '../shared/baseUrl'
import Loading from './LoadingComponent';
import moment from 'moment';


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


            const Vo = (props) => {
                if (props.isVO) {
                    return (<img className='mr-3' src={fetchUrl + "/images/subtitles.gif"} alt='subtitles' />);
                } else {
                    return (<></>);
                }
            };

            const Music = (props) => {
                if (props.isMUSIC) {
                    return (<img className='mr-3' src={fetchUrl + "/images/nota.gif"} alt='music' />);
                } else {
                    return (<></>);
                }
            };
            

            const isFuture = (movieTime) => {
                const now = new Date();
                const oraInizio = this.state.currentDate;
                movieTime = movieTime.replace('H ', '');
                let [hh, mm] = movieTime.split('.');                
                oraInizio.setHours(hh);
                oraInizio.setMinutes(mm);
                return now < oraInizio;
            }

            const movielist = this.props.days.days.filter((day) => day.day === this.formatDate(this.state.currentDate)).length === 0 ?
                <Stagger in>
                <div className='row mt-4'>
                    <h4>Programma non disponibile per la data selezionata</h4>
                </div>
                </Stagger>
            :            
            this.props.days.days.filter((day) => day.day === this.formatDate(this.state.currentDate))[0].movies.map((movie) => {
                return (
                    <Stagger in>
                        <div className='row ml-1 mr-1 mb-5'>
                            <div className='col-2'>
                                <img src={movie.image} className='img-fluid' alt={'img-' + movie.id} />
                            </div>
                            <div className='col-10'>
                                <div className={isFuture(movie.time) ? 'row' : 'row past-movie-title'}>
                                    <Link to={`/movie/${movie.categoryId}/${movie.id}/${movie.repeatId}`}><h4>{movie.title}</h4></Link>
                                </div>
                                <div className='row'>
                                    <h5>{movie.time}</h5><span class='ml-1'>- {movie.place.replace(/Cinema Lumi.re/, 'Cinema Lumiére')} {/*non ho trovato un modo più furbo...*/}</span>
                                </div>
                                <div className='row'>
                                    <em>{movie.extras}</em>
                                </div>
                                <div className='row mt-1'>
                                    <Vo isVO={movie.isVO} />
                                    <Music isMUSIC={movie.isMUSIC} />
                                </div>
                            </div>
                        </div>
                    </Stagger>
                );
            });

            return (
                <div className='container white-back'>
                    <div className='row row-content d-flex justify-content-between justify-content-md-center'>
                        <div className='d-flex align-items-center col-2 col-md-1 order-2 order-md-1'>                
                            <Button className='navigation-button' onClick={() => this.changeCurrentDate(-7)}>                    
                                <span className="fa fa-angle-double-left" />
                                <span class="d-none d-md-block">Week</span>
                            </Button>                
                        </div>

                        <div className='d-flex align-items-center col-2 col-md-1 order-3 order-md-2'>                
                            <Button className='navigation-button' onClick={() => this.changeCurrentDate(-1)}>                    
                                <span className="fa fa-angle-left" />
                                <span class="d-none d-md-block">Day</span>
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

                        <div className='d-flex align-items-center col-2 col-md-1 order-4 order-md-4'>                
                            <Button className='navigation-button' onClick={() => this.changeCurrentDate(1)}>                    
                                <span className="fa fa-angle-right" />                        
                                <span class="d-none d-md-block">Day</span>
                            </Button>                
                        </div>

                        <div className='d-flex align-items-center col-2 col-md-1 order-5 order-md-5'>
                            <Button className='navigation-button' onClick={() => this.changeCurrentDate(7)}>                    
                                <span className="fa fa-angle-double-right" />
                                <span class="d-none d-md-block">Week</span>
                            </Button>
                        </div>
                    </div>
                    <div className='row row-content d-flex justify-content-center'>
                        <Fade in>                            
                            {movielist}                            
                        </Fade>
                    </div>
                </div>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);