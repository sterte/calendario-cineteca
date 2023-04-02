import React, { Component } from 'react';
import { fetchCharachters, fetchConversations, fetchConversationLog, fetchChatResponse, resetChatResponse, deleteConversation } from '../redux/ActionCreators'
import { connect } from 'react-redux';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { toHaveAttribute } from '@testing-library/jest-dom';

const mapStateToProps = (state) => {
    return {
        charachters: state.charachters,
        messages: state.chatResponses,
        conversations: state.conversations,
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchCharachters: () => { dispatch(fetchCharachters()) },
    fetchConversations: () => { dispatch(fetchConversations()) },
    deleteConversation: (conversationId) => { dispatch(deleteConversation(conversationId)) },
    fetchConversationLog: (conversationId) => { dispatch(fetchConversationLog(conversationId)) },
    fetchChatResponse: (conversationId, title, lastMessage, charachter, temperature) => { dispatch(fetchChatResponse(conversationId, title, lastMessage, charachter, temperature)) },
    resetChatResponse: () => { dispatch(resetChatResponse()) }
});

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
    const content = messages.map(el => { return { "role": el.role, "message": el.content, "timestamp": el.timestamp } })
    const json = JSON.stringify(content);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}

class ChatAI extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedConversation: null
        }
    }

    componentDidMount() {
        if (this.props.isAdmin) {
            this.props.fetchCharachters();
        }
        this.props.fetchConversations();
        if (this.props.auth.isAuthenticated && this.props.location && this.props.location.state) {
            let question = '';
            let conversationTitle = '';
            if (this.props.location.state.requestType === 'info') {
                question = 'Mi dai delle informazioni sul film ';
                conversationTitle = 'Info: ' + this.props.location.state.title;

            } else if (this.props.location.state.requestType === 'similar') {
                question = 'Mi suggeriresti dei film simili a '
                conversationTitle = 'Simili a: ' + this.props.location.state.title;
            }
            question += this.props.location.state.title;
            if (this.props.location.state.year && this.props.location.state.year.length > 0) {
                question += ' ti do qualche dettaglio in più: ' + this.props.location.state.year
            }
            question += '?';
            this.props.resetChatResponse();
            this.props.fetchChatResponse(this.props.messages.conversationId, conversationTitle, question, this.charachter?.value, this.temperature?.value);
        }
    }

    charachter = null;
    temperature = null;
    title = null;

    render() {
        return (
            <div className='container white-back'>
                <div className='row row-content d-flex justify-content-center'>
                    {this.props.messages.title ?
                        <div className='col-12 col-md-6'>
                            <h2 style={{ textAlign: 'center' }} >{this.props.messages.title}</h2>
                        </div>
                        :
                        <div className='col-12 col-md-6'>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input disabled={this.props.messages.conversationId != null} type="text" id="title" name="title" innerRef={(input) => this.title = input} />
                            </FormGroup>
                        </div>
                    }
                    <div className='col-12 hide-scrollbar' style={{ display: 'flex', flexDirection: 'column-reverse', height: '400px', overflowY: 'scroll' }}>
                        <div className='row'>
                            {this.props.messages.messages.map(el => <div key={el.timestamp} style={'user' === el.role ? { backgroundColor: 'gray', borderRadius: '10px', marginLeft: 'auto', marginRight: '0px', maxWidth: '60%' } : { backgroundColor: 'orange', borderRadius: '10px', marginLeft: '0px', marginRight: 'auto', maxWidth: '60%' }} className={el.role === 'user' ? 'col-12 mt-3 p-3 mr-3' : 'col-12 mt-3 p-3 ml-3'}>{el.content + (this.props.isAdmin && el.tokenCount ? ' [' + el.tokenCount + ']' : '')}</div>)}
                            {this.props.messages.isLoading &&
                                <div className='col-12 mt-3 p-3'>
                                    <i className="fa fa-spinner fa-spin fa-fw"></i>
                                </div>
                            }
                            {
                                this.props.isAdmin > 0 &&
                                <div className='col-12 mt-3 p-3'>
                                    Token count of current chat: {this.props.messages.totalTokenCount}
                                </div>
                            }
                        </div>
                    </div>
                    <div className='col-12 mt-4'>
                        <div className='row ml-2'>
                            <div className='col-10 col-md-11'>
                                <FormGroup>
                                    <Input type="text" id="prompt" name="prompt"
                                        innerRef={(input) => this.prompt = input} onKeyPress={(e => { if (e.charCode === 13) { this.props.fetchChatResponse(this.props.messages.conversationId, this.title?.value, this.prompt.value, this.charachter?.value, this.temperature?.value); this.prompt.value = ''; } })} />
                                </FormGroup>
                            </div>
                            <div className='col-2 col-md-1'>
                                <Button className='navigation-button mr-3 mr-md-0' type="button" value="send" color="primary"
                                    onClick={() => {
                                        this.props.fetchChatResponse(this.props.messages.conversationId, this.title?.value, this.prompt.value, this.charachter?.value, this.temperature?.value);
                                        this.prompt.value = '';

                                    }}>
                                    <span className="fa fa-paper-plane" />
                                </Button>
                            </div>

                            <div className='col-12 col-md-7'>
                            <FormGroup>
                                <Dropdown disabled={this.props.conversations.isLoading || this.props.conversations.errMess} id="selectedConversation" options={this.props.conversations.conversations}
                                    onChange={(value) => { this.setState({selectedConversation: value })}} placeholder="Conversazioni precedenti"
                                />
                            </FormGroup>
                        </div>
                        <div className='col-1 ml-1 ml-md-0'>
                            <Button disabled={!this.state.selectedConversation} className='navigation-button mr-3 mr-md-0' type="button" value="loadConversation" color="primary"
                                onClick={() => { this.props.fetchConversationLog(this.state.selectedConversation.value) }}>
                                <span className="fa fa-upload" />
                            </Button>
                        </div>
                        <div className='col-1 ml-1 ml-md-0'>
                            <Button disabled={this.props.messages.messages.length > 0} className='navigation-button mr-3 mr-md-0' type="button" value="loadConversation" color="primary"
                                onClick={() => { this.props.deleteConversation(this.state.selectedConversation.value) }}>
                                <span className="fa fa-trash" />
                            </Button>
                        </div>

                            <div className='col-1 ml-1 ml-md-0'>
                                <Button className='navigation-button' type="button" value="send" color="primary"
                                    onClick={() => {
                                        this.props.resetChatResponse();
                                        this.prompt.value = '';

                                    }}>
                                    <span className="fa fa-refresh" />
                                </Button>
                            </div>
                            <div className='col-1 ml-1 ml-md-0'>
                                <Button className='navigation-button mr-3 mr-md-0' type="button" value="send" color="primary"
                                    onClick={() => { downloadChat(this.props.messages.messages) }}>
                                    <span className="fa fa-save" />
                                </Button>
                            </div>
                            {this.props?.location?.state?.backUrl?.lenght > 0 &&
                                <div className='col-1 ml-1 ml-md-0'>
                                    <button type='button' className='navigation-button btn btn-primary'><Link to={this.props.location.state.backUrl} style={{ color: 'white' }}><span className="fa fa-arrow-left" /></Link></button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {this.props.isAdmin &&
                    <div className='row mt-4'>
                        <div className='col-12 col-md-6'>
                            <FormGroup>
                                <Label for="charachter">Charachter</Label>
                                <Dropdown disabled={this.props.charachters.isLoading || this.props.charachters.errMess || this.props.messages.conversationId != null} id="charachter" options={this.props.charachters.charachters}
                                    onChange={(value) => { this.charachter = value }} placeholder="Select an option"
                                />
                            </FormGroup>
                        </div>
                        <div className='col-12 col-md-6'>
                            <FormGroup>
                                <Label for="temperature">Temperature</Label>
                                <Input type="number" id="temperature" name="temperature" innerRef={(input) => this.temperature = input} />
                            </FormGroup>
                        </div>
                    </div>
                }
            </div>

        );

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatAI));