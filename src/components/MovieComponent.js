import React, { Component } from 'react';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl'
import Loading from './LoadingComponent';
import { getMovieDetail } from '../redux/ActionCreators';

const mapStateToProps = (state) => {
    return {
      movies: state.movies
    }
  }
  
  const mapDispatchToProps = (dispatch) => ({
    getMovieDetail: (movieId) => {dispatch(getMovieDetail(movieId))}
  });

class Movie extends Component{

    render(){
        return(
            <div className='row row-content'>
                {/*TODO*/}
                {this.props.movieId}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Movie);