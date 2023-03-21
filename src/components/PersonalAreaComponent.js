import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody,
	Form, FormGroup, Label, Input } from 'reactstrap';
import { Fade } from 'react-animation-components';
import { connect } from 'react-redux';
import Loading from './LoadingComponent';
import { fetchFavourites, editFavourite, deleteFavourite } from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
        auth: state.auth,
        favourites: state.favourites
    }
}



const mapDispatchToProps = (dispatch) => ({
    fetchFavourites: () => dispatch(fetchFavourites()),
    deleteFavourite: (id) => dispatch(deleteFavourite(id)),
    editFavourite: (fav) => dispatch(editFavourite(fav)),
});

class PersonalArea extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            isEditModalOpen: false,
            currentlyEdited: null
        };
        this.toggleEditModal = this.toggleEditModal.bind(this);   
        this.handleFavouriteEdit = this.handleFavouriteEdit.bind(this);   
    }

    componentDidMount() {
        this.props.fetchFavourites()
    }

    toggleEditModal = (fav = null) => {
        this.setState({isEditModalOpen: !this.state.isEditModalOpen, currentlyEdited: fav});
    }

    handleFavouriteEdit = () => {        
        this.props.editFavourite({id: this.state.currentlyEdited._id, rating: this.rating, comment: this.comment.value});        
    }

    render() {        
        if(this.props.favourites.isLoading){
            return(
                <div className='container'><Loading /></div>
            );
        }
        else if(this.props.favourites.errMess != null){
            return(
                <div className='container'>{this.props.favourites.errMess}</div>
            );
        }
        else{
            const favlist = this.props.favourites.favourites.map((fav) => {
                return (
                        <Fade in={true} key={fav.title}>
                            <div className='row row-content justify-content-around d-flex mt-4'>
                                <div className='col-12 col-md-10'>
                                    <div className='row p-1 p-md-0'>
                                        <div className='col-4 col-md-3'>
                                            {fav.title}
                                        </div>
                                        <div className='col-4 col-md-3'>
                                            {fav.rating}
                                        </div>
                                        <div className='col-4 col-md-4 '>
                                            {fav.comment}
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-2'>
                                    <div className='row ml-1 ml-md-0 mt-1 mt-md-0'>
                                        <Button className='navigation-button' onClick={() => this.toggleEditModal(fav)}>
                                            <span className="fa fa-edit" />
                                        </Button>                                
                                        <Button className='navigation-button ml-1 mr-auto' onClick={() => this.props.deleteFavourite(fav._id)}>
                                            <span className="fa fa-trash" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Fade>                        
                );
            });
            return(
                <>
                <div className='container white-back'>                                            
                {favlist}
                </div>
                <Modal isOpen={this.state.isEditModalOpen} toggle={this.toggleEditModal}>
                    <ModalHeader className='navigation-button' toggle={this.toggleEditModal}>Valuta film</ModalHeader>
                    <ModalBody>
                        <div className='white-back row-content' >
                    <Form onSubmit={this.handleFavouriteEdit}>
                            <FormGroup>
                                <Label htmlFor="title">Film:</Label> {this.state.currentlyEdited ? this.state.currentlyEdited.title : ''}
                            </FormGroup>

                            <FormGroup>
                                <Label className='mr-2' htmlFor="rating">Voto</Label>
                                <select value={this.rating} onChange={(evt) => this.rating = evt.target.value}>
                                {this.state.currentlyEdited && this.state.currentlyEdited.rating===1 ? <option selected value="1">1</option> : <option value="1">1</option>}
                                {this.state.currentlyEdited && this.state.currentlyEdited.rating===2 ? <option selected value="2">2</option> : <option value="2">2</option>}
                                {this.state.currentlyEdited && this.state.currentlyEdited.rating===3 ? <option selected value="3">3</option> : <option value="3">3</option>}
                                {this.state.currentlyEdited && this.state.currentlyEdited.rating===4 ? <option selected value="4">4</option> : <option value="4">4</option>}
                                {this.state.currentlyEdited && this.state.currentlyEdited.rating===5 ? <option selected value="5">5</option> : <option value="5">5</option>}
                                {this.state.currentlyEdited && this.state.currentlyEdited.rating===6 ? <option selected value="6">6</option> : <option value="6">6</option>}
                                {this.state.currentlyEdited && this.state.currentlyEdited.rating===7 ? <option selected value="7">7</option> : <option value="7">7</option>}
                                {this.state.currentlyEdited && this.state.currentlyEdited.rating===8 ? <option selected value="8">8</option> : <option value="8">8</option>}
                                {this.state.currentlyEdited && this.state.currentlyEdited.rating===9 ? <option selected value="9">9</option> : <option value="9">9</option>}
                                {this.state.currentlyEdited && this.state.currentlyEdited.rating===10 ? <option selected value="10">10</option> : <option value="10">10</option>}
                                </select>                                      
                            </FormGroup>                     

                            <FormGroup>
                                <Label htmlFor="comment">Commento</Label>
                                <Input type="text" id="comment" name="comment" defaultValue={this.state.currentlyEdited ? this.state.currentlyEdited.comment: ''}
                                    innerRef={(input) => this.comment = input} />
                            </FormGroup>                     

                            <Button className='navigation-button mr-3' type="submit" value="Edit" color="primary">Salva</Button>
                            <Button onClick={this.toggleEditModal}>Annulla</Button>
                        </Form>
                        </div>
                        </ModalBody>
                </Modal>
                </>
                );
        }
    }



}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalArea);