import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from './LoadingComponent';
import ScrollToTopButton from './ScrollToTopButton';
import { getTrackDetail } from '../redux/ActionCreators';
import { movieListDetail } from './MovieUtils';
import { Fade, Stagger } from 'react-animation-components';
import { Helmet } from 'react-helmet-async';


const mapStateToProps = (state) => {
    return {
        trackDetail: state.trackDetail
    }
}

const mapDispatchToProps = (dispatch) => ({
    getTrackDetail: (trackId) => { dispatch(getTrackDetail(trackId)) }
});


class TrackDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            currentDate: new Date()          
        }
    }
   
    componentDidMount() {
        this.props.getTrackDetail(this.props.trackId)
    }

    render() {
        if (this.props.trackDetail.isLoading) {
            return (<div className='container'>            
                <Loading />
            </div>);
        }
        else {
            const tracksList = !this?.props?.trackDetail?.trackDetail?.movies?.length ?
                <Stagger in='true'>                
                    <h4 className='row mt-4 p-4 p-md-0'>Programma non disponibile per la data selezionata</h4>                
                </Stagger>
            :            
            this.props.trackDetail.trackDetail.movies.map((movie) => {
                return movieListDetail(movie, true);                
            });

            return (                
                <div className='container white-back'>       
                    <Helmet>
                        <title>Cinetecalendar - {this.props.trackDetail.trackDetail.title}</title>
                        <meta name='description' content={'Cinetecalendar - ' + this.props.trackDetail.trackDetail.title} />
                    </Helmet>                                                     
                    <div className='row row-content d-flex justify-content-center'>
                        <div className='col-12 mt-4 col-auto d-flex align-self-center'>
                            <h2 dangerouslySetInnerHTML={{__html: this.props.trackDetail.trackDetail.title}} />
                        </div>
                        <div className='col-12 m-4' dangerouslySetInnerHTML={{__html: this.props.trackDetail.trackDetail.description}} />
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackDetail);