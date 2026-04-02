import React, { useState, useEffect } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserPrefs, updateUserPrefs } from '../redux/userPrefs';
import { requestPasswordReset, clearResetStatus } from '../redux/auth';
import PageLoader from './PageLoader';

function Settings() {
    const dispatch = useDispatch();
    const userPrefs = useSelector(state => state.userPrefs);
    const auth = useSelector(state => state.auth);

    const [imdbEnabled, setImdbEnabled] = useState(true);
    const [letterboxdEnabled, setLetterboxdEnabled] = useState(true);
    const [letterboxdUsername, setLetterboxdUsername] = useState('');
    const [preferredCalendar, setPreferredCalendar] = useState('');
    const [autoSwitchTab, setAutoSwitchTab] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        dispatch(fetchUserPrefs());
        dispatch(clearResetStatus());
    }, [dispatch]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!userPrefs.isLoading) {
            setImdbEnabled(userPrefs.prefs.imdbEnabled);
            setLetterboxdEnabled(userPrefs.prefs.letterboxdEnabled);
            setLetterboxdUsername(userPrefs.prefs.letterboxdUsername || '');
            setPreferredCalendar(userPrefs.prefs.preferredCalendar || '');
            setAutoSwitchTab(userPrefs.prefs.autoSwitchTab !== false);
        }
    }, [userPrefs.isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSave = () => {
        dispatch(updateUserPrefs({ imdbEnabled, letterboxdEnabled, letterboxdUsername, preferredCalendar, autoSwitchTab }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleResetRequest = () => {
        if (userPrefs.prefs.email) {
            dispatch(requestPasswordReset(userPrefs.prefs.email));
        }
    };

    if (userPrefs.isLoading) {
        return <PageLoader />;
    }

    return (
        <div className='container white-back'>
            <div className='row row-content ms-1 me-1 p-2 p-md-5'>
                <h3 className='mb-4'>Area Personale</h3>

                <div className='section-box col-12 col-md-8 mt-3'>
                    <span className='section-box-title'>Integrazioni</span>
                    <FormGroup check className='mb-2'>
                        <Input type="checkbox" id="imdb-check" checked={imdbEnabled} onChange={e => setImdbEnabled(e.target.checked)} />
                        <Label check htmlFor="imdb-check">Mostra dati IMDb nella scheda film</Label>
                    </FormGroup>
                    <FormGroup check className='mb-3'>
                        <Input type="checkbox" id="lb-check" checked={letterboxdEnabled} onChange={e => setLetterboxdEnabled(e.target.checked)} />
                        <Label check htmlFor="lb-check">Mostra dati Letterboxd nella scheda film</Label>
                    </FormGroup>

                    {letterboxdEnabled && (
                        <FormGroup className='mb-3'>
                            <Label htmlFor="lb-username">Username Letterboxd</Label>
                            <Input type="text" id="lb-username" value={letterboxdUsername}
                                onChange={e => setLetterboxdUsername(e.target.value)}
                                placeholder="Il tuo username su Letterboxd" />
                            <small className='text-muted'>Usato per verificare la tua watchlist Letterboxd.</small>
                        </FormGroup>
                    )}

                    <FormGroup check className='mb-3 mt-3'>
                        <Input type="checkbox" id="autoswitch-check" checked={autoSwitchTab} onChange={e => setAutoSwitchTab(e.target.checked)} />
                        <Label check htmlFor="autoswitch-check">Spostati automaticamente sul tab del film all'apertura</Label>
                    </FormGroup>

                    <FormGroup className='mb-3'>
                        <Label htmlFor="cal-select">Calendario preferito</Label>
                        <Input type="select" id="cal-select" value={preferredCalendar} onChange={e => setPreferredCalendar(e.target.value)}>
                            <option value=''>— Mostra sempre il menu —</option>
                            <option value='Google'>Google Calendar</option>
                            <option value='Apple'>Apple Calendar</option>
                            <option value='Outlook.com'>Outlook.com</option>
                            <option value='Yahoo'>Yahoo Calendar</option>
                            <option value='iCal'>iCal (.ics)</option>
                        </Input>
                        <small className='text-muted'>Se impostato, "Aggiungi al calendario" aggiunge direttamente senza mostrare il menu.</small>
                    </FormGroup>

                    <div className='d-flex align-items-center mt-3'>
                        <Button className='navigation-button me-3' onClick={handleSave}>Salva</Button>
                        {saved && <span className='text-success'>Salvato!</span>}
                        {userPrefs.errMess && <span className='text-danger'>{userPrefs.errMess}</span>}
                    </div>
                </div>

                <div className='section-box col-12 col-md-8 mt-4'>
                    <span className='section-box-title'>Password</span>
                    <p className='mb-3'>Ricevi un'email con il link per cambiare la tua password.</p>
                    {auth.resetStatus === 'sent'
                        ? <p className='text-success mb-0'>Email inviata! Controlla la tua casella di posta.</p>
                        : <>
                            {auth.resetErrMess && <p className='text-danger'>{auth.resetErrMess}</p>}
                            <Button className='navigation-button' onClick={handleResetRequest} disabled={auth.isLoading || !userPrefs.prefs.email}>
                                {auth.isLoading ? 'Attendi...' : 'Invia email di reset'}
                            </Button>
                            {!userPrefs.prefs.email && (
                                <p className='text-muted mt-2 mb-0' style={{fontSize: '0.85rem'}}>Nessuna email associata all'account.</p>
                            )}
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default Settings;
