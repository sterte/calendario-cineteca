import React, { useState, useEffect, useRef } from 'react';
import { fetchCharachters } from '../redux/charachters';
import { fetchConversations, deleteConversation } from '../redux/conversations';
import { fetchChatResponse, fetchConversationLog, resetChatResponse } from '../redux/chatResponses';
import { useSelector, useDispatch } from 'react-redux';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const downloadChat = (messages) => {
    const now = new Date();
    const year = now.getFullYear();
    var month = now.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var day = now.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    var hours = now.getHours();
    if (hours < 10) {
        hours = '0' + hours;
    }
    var minutes = now.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    var seconds = now.getSeconds();
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    const fileName = "chat-log-" + year + month + day + hours + minutes + seconds;
    const content = messages.map(el => { return { "role": el.role, "message": el.content, "timestamp": el.timestamp } });
    const json = JSON.stringify(content);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};

function ChatAI({ isAdmin }) {
    const charachters = useSelector(state => state.charachters);
    const messages = useSelector(state => state.chatResponses);
    const conversations = useSelector(state => state.conversations);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    const [selectedConversation, setSelectedConversation] = useState(null);
    const charachterRef = useRef(null);
    const promptRef = useRef(null);
    const titleRef = useRef(null);
    const temperatureRef = useRef(null);

    useEffect(() => {
        if (isAdmin && !charachters.isLoading) {
            dispatch(fetchCharachters());
        }
        if (!conversations.isLoading) {
            dispatch(fetchConversations());
        }
        if (auth.isAuthenticated && location?.state && !messages.isLoading) {
            let question = '';
            let conversationTitle = '';
            if (location.state.requestType === 'info') {
                question = 'Mi dai delle informazioni sul film ';
                conversationTitle = 'Info: ' + location.state.title;
            } else if (location.state.requestType === 'similar') {
                question = 'Mi suggeriresti dei film simili a ';
                conversationTitle = 'Simili a: ' + location.state.title;
            }
            question += location.state.title;
            if (location.state.year && location.state.year.length > 0) {
                question += ' ti do qualche dettaglio in più: ' + location.state.year;
            }
            question += '?';
            dispatch(fetchConversations());
            dispatch(resetChatResponse());
            dispatch(fetchChatResponse({ conversationId: messages.conversationId, title: conversationTitle, lastMessage: question, charachter: charachterRef.current?.value, temperature: temperatureRef.current?.value }));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleReset = () => {
        dispatch(fetchConversations());
        dispatch(resetChatResponse());
        if (promptRef.current) promptRef.current.value = '';
    };

    const handleSend = () => {
        if (!promptRef.current?.value?.length) {
            alert('Messaggio obbligatorio');
        } else if (!titleRef.current?.value?.length && !messages.messages.length) {
            alert('Titolo obbligatorio');
        } else {
            dispatch(fetchChatResponse({ conversationId: messages.conversationId, title: titleRef.current?.value, lastMessage: promptRef.current.value, charachter: charachterRef.current?.value, temperature: temperatureRef.current?.value }));
            promptRef.current.value = '';
        }
    };

    return (
        <div className='container white-back'>
            <div className='row row-content d-flex justify-content-center'>
                {messages.title ?
                    <div className='col-12 col-md-6'>
                        <h2 style={{ textAlign: 'center' }}>{messages.title}</h2>
                    </div>
                    :
                    <div className='col-12 col-md-6'>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input disabled={messages.conversationId != null} type="text" id="title" name="title" innerRef={titleRef} />
                        </FormGroup>
                    </div>
                }
                <div className='col-12 hide-scrollbar' style={{ display: 'flex', flexDirection: 'column-reverse', height: '400px', overflowY: 'scroll' }}>
                    <div className='row'>
                        {messages.messages.map(el => <div key={el.timestamp} style={'user' === el.role ? { backgroundColor: 'gray', borderRadius: '10px', marginLeft: 'auto', marginRight: '0px', maxWidth: '60%' } : { backgroundColor: 'orange', borderRadius: '10px', marginLeft: '0px', marginRight: 'auto', maxWidth: '60%' }} className={el.role === 'user' ? 'col-12 mt-3 p-3 mr-3' : 'col-12 mt-3 p-3 ml-3'}>{el.content + (isAdmin && el.tokenCount ? ' [' + el.tokenCount + ']' : '')}</div>)}
                        {messages.isLoading &&
                            <div className='col-12 mt-3 p-3'>
                                <i className="fa fa-spinner fa-spin fa-fw"></i>
                            </div>
                        }
                        {isAdmin > 0 &&
                            <div className='col-12 mt-3 p-3'>
                                Token count of current chat: {messages.totalTokenCount}
                            </div>
                        }
                    </div>
                </div>
                <div className='col-12 mt-4'>
                    <div className='row ml-2'>
                        <div className='col-10 col-md-11'>
                            <FormGroup>
                                <Input type="text" id="prompt" name="prompt"
                                    innerRef={promptRef}
                                    onKeyPress={(e) => {
                                        if (e.charCode === 13) {
                                            dispatch(fetchChatResponse({ conversationId: messages.conversationId, title: titleRef.current?.value, lastMessage: promptRef.current.value, charachter: charachterRef.current?.value, temperature: temperatureRef.current?.value }));
                                            promptRef.current.value = '';
                                        }
                                    }} />
                            </FormGroup>
                        </div>
                        <div className='col-2 col-md-1'>
                            <Button className='navigation-button mr-3 mr-md-0' type="button" value="send" color="primary"
                                onClick={handleSend}>
                                <span className="fa fa-paper-plane" />
                            </Button>
                        </div>

                        <div className='col-12 col-md-7'>
                            <FormGroup>
                                <Dropdown disabled={conversations.isLoading || conversations.errMess} id="selectedConversation" options={conversations.conversations}
                                    onChange={(value) => { setSelectedConversation(value); }} placeholder="Conversazioni precedenti"
                                />
                            </FormGroup>
                        </div>
                        <div className='col-1 ml-1 ml-md-0'>
                            <Button disabled={!selectedConversation} className='navigation-button mr-3 mr-md-0' type="button" value="loadConversation" color="primary"
                                onClick={() => { dispatch(fetchConversationLog(selectedConversation.value)); }}>
                                <span className="fa fa-upload" />
                            </Button>
                        </div>
                        <div className='col-1 ml-1 ml-md-0'>
                            <Button disabled={messages.messages.length > 0} className='navigation-button mr-3 mr-md-0' type="button" value="loadConversation" color="primary"
                                onClick={() => { dispatch(deleteConversation(selectedConversation.value)); }}>
                                <span className="fa fa-trash" />
                            </Button>
                        </div>

                        <div className='col-1 ml-1 ml-md-0'>
                            <Button className='navigation-button' type="button" value="send" color="primary"
                                onClick={handleReset}>
                                <span className="fa fa-refresh" />
                            </Button>
                        </div>
                        <div className='col-1 ml-1 ml-md-0'>
                            <Button className='navigation-button mr-3 mr-md-0' type="button" value="send" color="primary"
                                onClick={() => { downloadChat(messages.messages); }}>
                                <span className="fa fa-save" />
                            </Button>
                        </div>
                        {location?.state?.backUrl?.length > 0 &&
                            <div className='col-1 ml-1 ml-md-0'>
                                <button type='button' className='navigation-button btn btn-primary'><Link to={location.state.backUrl} style={{ color: 'white' }}><span className="fa fa-arrow-left" /></Link></button>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {isAdmin &&
                <div className='row mt-4'>
                    <div className='col-12 col-md-6'>
                        <FormGroup>
                            <Label for="charachter">Charachter</Label>
                            <Dropdown disabled={charachters.isLoading || charachters.errMess || messages.conversationId != null} id="charachter" options={charachters.charachters}
                                onChange={(value) => { charachterRef.current = value; }} placeholder="Select an option"
                            />
                        </FormGroup>
                    </div>
                    <div className='col-12 col-md-6'>
                        <FormGroup>
                            <Label for="temperature">Temperature</Label>
                            <Input type="number" id="temperature" name="temperature" innerRef={temperatureRef} />
                        </FormGroup>
                    </div>
                </div>
            }
        </div>
    );
}

export default ChatAI;
