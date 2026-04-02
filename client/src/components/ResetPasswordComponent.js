import React, { useRef } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { resetPassword, clearResetStatus } from '../redux/auth';

function ResetPassword() {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const auth = useSelector(state => state.auth);

    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const token = new URLSearchParams(location.search).get('token');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPasswordRef.current.value !== confirmPasswordRef.current.value) {
            alert('Le password non coincidono');
            return;
        }
        dispatch(resetPassword({ token, newPassword: newPasswordRef.current.value }));
    };

    const handleGoToLogin = () => {
        dispatch(clearResetStatus());
        history.push('/calendar');
    };

    if (!token) {
        return (
            <div className='container white-back mt-4'>
                <div className='row row-content'>
                    <div className='col-12 text-center'>
                        <p>Link non valido. Richiedi un nuovo link di reset dalla pagina di login.</p>
                        <Button className='navigation-button' onClick={() => history.push('/calendar')}>Torna al sito</Button>
                    </div>
                </div>
            </div>
        );
    }

    if (auth.resetStatus === 'done') {
        return (
            <div className='container white-back mt-4'>
                <div className='row row-content'>
                    <div className='col-12 text-center'>
                        <h4>Password aggiornata!</h4>
                        <p>Ora puoi accedere con la nuova password.</p>
                        <Button className='navigation-button' onClick={handleGoToLogin}>Vai al login</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='container white-back mt-4'>
            <div className='row row-content'>
                <div className='col-12 col-md-6 offset-md-3'>
                    <h4 className='mb-4'>Reimposta la password</h4>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor='newPassword'>Nuova password</Label>
                            <Input type='password' id='newPassword' innerRef={newPasswordRef} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor='confirmPassword'>Conferma password</Label>
                            <Input type='password' id='confirmPassword' innerRef={confirmPasswordRef} required />
                        </FormGroup>
                        {auth.resetErrMess &&
                            <p className='text-danger'>{auth.resetErrMess}</p>
                        }
                        <Button className='navigation-button' type='submit' disabled={auth.isLoading}>
                            {auth.isLoading ? 'Attendi...' : 'Reimposta password'}
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
