import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Fade } from 'react-animation-components';
import { connect } from 'react-redux';
import Loading from './LoadingComponent';
import ScrollToTopButton from './ScrollToTopButton';
import { getTracks } from '../redux/ActionCreators';


const mapStateToProps = (state) => {
    return {
        tracks: state.tracks
    }
}

const mapDispatchToProps = (dispatch) => ({
    getTracks: () => { dispatch(getTracks()) }
});


class Tracks extends Component {

    constructor(props){
        super(props);
        this.state = {
            currentDate: new Date()          
        }
    }
   
    componentDidMount() {
        this.props.getTracks()
    }

    render() {
        if (this.props.tracks.isLoading) {
            return (<div className='container'>            
                <Loading />
            </div>);
        }
        else {
            
            const tracksList = this.props.tracks.tracks.length === 0 ?
                <Fade in={true}>                
                    <h4 className='row mt-4 p-4 p-md-0'>Non ci sono rassegne in corso</h4>                
                </Fade>
            :            
            this.props.tracks.tracks.map((track) => {                
                return (
                    <Fade in={true} className='row ml-1 mr-1 mb-5' key={track.id}>
                            <div className='col-4 col-md-4'>
                                <img src={track.image} className='img-fluid' alt={'img-' + track.id} />
                            </div>
                            <div className='ml-3 ml-md-0 col-12 col-md-8'>
                                <div className='row'>
                                    <Link to={`/tracks/${track.id}`}><h4>{track.title}</h4></Link>
                                </div>
                                <div className='row'>
                                    <h5>{track.dateInfo}</h5>
                                </div>
                            </div>
                    </Fade>
                );
            });

            return (
                <div className='container white-back'>
                    <div className='row row-content d-flex justify-content-center'>
                        <Fade in={true}>                            
                            {tracksList}                            
                        </Fade>
                    </div>
                    <ScrollToTopButton />
                </div>                
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tracks);