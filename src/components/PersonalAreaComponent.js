import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Label, Input } from 'reactstrap';
import { Fade } from 'react-animation-components';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './LoadingComponent';
import { fetchFavourites, editFavourite, deleteFavourite } from '../redux/favourites';

function PersonalArea() {
    const favourites = useSelector(state => state.favourites);
    const dispatch = useDispatch();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentlyEdited, setCurrentlyEdited] = useState(null);
    const ratingRef = useRef(null);
    const commentRef = useRef(null);

    useEffect(() => {
        dispatch(fetchFavourites());
    }, [dispatch]);

    const toggleEditModal = (fav = null) => {
        setIsEditModalOpen(open => !open);
        setCurrentlyEdited(fav);
    };

    const handleFavouriteEdit = () => {
        dispatch(editFavourite({ id: currentlyEdited._id, rating: ratingRef.current, comment: commentRef.current.value }));
    };

    if (favourites.isLoading) {
        return <div className='container'><Loading /></div>;
    }
    if (favourites.errMess != null) {
        return <div className='container'>{favourites.errMess}</div>;
    }

    const favlist = favourites.favourites.map((fav) => (
        <Fade in={true} key={fav.title}>
            <div className='row row-content justify-content-around d-flex mt-4'>
                <div className='col-12 col-md-10'>
                    <div className='row p-1 p-md-0'>
                        <div className='col-4 col-md-4'>{fav.title}</div>
                        <div className='col-4 col-md-4'>{fav.rating}</div>
                        <div className='col-4 col-md-4'>{fav.comment}</div>
                    </div>
                </div>
                <div className='col-12 col-md-2'>
                    <div className='row ml-1 ml-md-0 mt-1 mt-md-0'>
                        <Button className='navigation-button' onClick={() => toggleEditModal(fav)}>
                            <span className="fa fa-edit" />
                        </Button>
                        <Button className='navigation-button ml-1 mr-auto' onClick={() => dispatch(deleteFavourite(fav._id))}>
                            <span className="fa fa-trash" />
                        </Button>
                    </div>
                </div>
            </div>
        </Fade>
    ));

    return (
        <>
            <div className='container white-back'>
                {favlist}
            </div>
            <Modal isOpen={isEditModalOpen} toggle={() => toggleEditModal()}>
                <ModalHeader className='navigation-button' toggle={() => toggleEditModal()}>Valuta film</ModalHeader>
                <ModalBody>
                    <div className='white-back row-content'>
                        <Form onSubmit={handleFavouriteEdit}>
                            <FormGroup>
                                <Label htmlFor="title">Film:</Label> {currentlyEdited ? currentlyEdited.title : ''}
                            </FormGroup>
                            <FormGroup>
                                <Label className='mr-2' htmlFor="rating">Voto</Label>
                                <select className='form-control' defaultValue={currentlyEdited?.rating} onChange={(evt) => { ratingRef.current = evt.target.value; }}>
                                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="comment">Commento</Label>
                                <Input type="text" id="comment" name="comment"
                                    defaultValue={currentlyEdited ? currentlyEdited.comment : ''}
                                    innerRef={commentRef} />
                            </FormGroup>
                            <Button className='navigation-button mr-3' type="submit" value="Edit" color="primary">Salva</Button>
                            <Button onClick={() => toggleEditModal()}>Annulla</Button>
                        </Form>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}

export default PersonalArea;
