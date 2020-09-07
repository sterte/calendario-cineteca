import React, { Component } from 'react';
import { Button, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getDayProgram } from '../redux/ActionCreators'
import { Fade, Stagger } from 'react-animation-components';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl'
import Loading from './LoadingComponent';


const mapStateToProps = (state) => {
    return {
      days: state.days
    }
  }
  
  const mapDispatchToProps = (dispatch) => ({
    getDayProgram: (year, month, day) => {dispatch(getDayProgram(year, month, day))}
  });


class Calendar extends Component{

    componentDidMount(){
        this.props.getDayProgram(this.props.year, this.props.month, this.props.day)
    }

    render(){            
        if(this.props.days.isLoading){
            return(<Loading />);
        }
        else{
            let date = new Date();        
            date.setFullYear(this.props.year);        
            date.setMonth(this.props.month - 1);
            date.setDate(this.props.day);        
            
            let tomorrow = new Date(date);
            tomorrow.setDate(date.getDate() + 1);                
            const tomorrowDay = tomorrow.getDate();
            const tomorrowMonth = tomorrow.getMonth() + 1;
            const tomorrowYear = tomorrow.getFullYear();        

            let nextWeek = new Date(date);
            nextWeek.setDate(date.getDate() + 7);
            const nextWeekDay = nextWeek.getDate();
            const nextWeekMonth = nextWeek.getMonth() + 1;
            const nextWeekYear = nextWeek.getFullYear();

            let yesterday = new Date(date);
            yesterday.setDate(date.getDate() - 1);
            const yesterdayDay = yesterday.getDate();
            const yesterdayMonth = yesterday.getMonth() + 1;
            const yesterdayYear = yesterday.getFullYear();

            let prevWeek = new Date(date);
            prevWeek.setDate(date.getDate() - 7);
            const prevWeekDay = prevWeek.getDate();
            const prevWeekMonth = prevWeek.getMonth() + 1;
            const prevWeekYear = prevWeek.getFullYear();

            const Vo = (props) => {
                if(props.isVO){
                    return(<img className='mr-3' src={baseUrl + "/assets/images/subtitles.gif"} alt='subtitles' />);
                }else{
                    return(<></>);
                }
            };
            
            const Music = (props) => {
                if(props.isMUSIC){
                    return(<img className='mr-3' src={baseUrl + "/assets/images/nota.gif"} alt='music' />);
                }else{
                    return(<></>);
                }
            };

            const movielist = this.props.days.days.movies.map((movie) => {
                return(
                    <Stagger in>
                        <div className='row mt-4'>
                            <div className='col-2'>
                                <img src={movie.image} className='img-fluid' alt={'img-'+movie.id}/>
                            </div>
                            <div className='col-10'>
                                <div className='row'>
                                <Link to={`/movie/${movie.id}`}><h4>{movie.title}</h4></Link>
                                </div>
                                <div className='row'>
                                <h5>{movie.time}</h5> - {movie.place}
                                </div>
                                <div className='row'>                                
                                <Vo isVO={movie.isVO} />                                
                                <Music isMUSIC={movie.isMUSIC} />
                                </div>                                    
                            </div>
                        </div>
                    </Stagger>
                );
            });

            return(
                <div className='container'>
                <div className='row row-content'>
                    <div className='col-2 col-md-1 order-2 order-md-1'>
                        <Link to={`/calendar/${prevWeekYear}/${prevWeekMonth}/${prevWeekDay}`} >
                        <Button>
                            <span className="fa fa-angle-double-left"> Prev</span>
                        </Button>
                        </Link>
                    </div>
                    
                    <div className='col-2 col-md-1 order-3 order-md-2'>
                        <Link to={`/calendar/${yesterdayYear}/${yesterdayMonth}/${yesterdayDay}`} >
                        <Button>
                            <span className="fa fa-angle-left"> Prev</span>
                        </Button>
                        </Link>
                    </div>
                    
                    <div className='col-12 col-md-auto order-1 order-md-3'>
                        <h4>{this.props.day} - {this.props.month} - {this.props.year}</h4>
                    </div>

                    <div className='col-2 col-md-1 order-4 order-md-4'>
                        <Link to={`/calendar/${tomorrowYear}/${tomorrowMonth}/${tomorrowDay}`} >
                        <Button>
                            <span className="fa fa-angle-right"> Next</span>
                        </Button>	
                        </Link>
                    </div>

                    <div className='col-2 col-md-1 order-5 order-md-5'>
                        <Link to={`/calendar/${nextWeekYear}/${nextWeekMonth}/${nextWeekDay}`} >
                        <Button>
                            <span className="fa fa-angle-double-right"> Next</span>
                        </Button>	
                        </Link>
                    </div>
                </div>

                <div className='row row-content'>
                    <Fade in>
                        <CardText>
                            {movielist}                        
                        </CardText>
                    </Fade>
                </div>
                </div>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);