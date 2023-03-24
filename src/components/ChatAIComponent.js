import React, { Component } from 'react';
import { fetchChatResponse, resetChatResponse } from '../redux/ActionCreators'
import { connect } from 'react-redux';
import { Button, FormGroup, Input } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        messages: state.chatResponses,
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchChatResponse: (conversationId, lastMessage) => { dispatch(fetchChatResponse(conversationId, lastMessage)) },
    resetChatResponse: () => { dispatch(resetChatResponse()) }
});

const downloadChat = (messages) => {
    const now = new Date();
    const year = now.getFullYear();
    var month = now.getMonth() + 1;
    if(month<10){
        month = '0' + month;
    }
    var day = now.getDate();
    if(day < 10){
        day = '0' + day;
    }
    var hours = now.getHours();
    if(hours < 10){
        hours = '0' + hours;
    }
    var minutes = now.getMinutes();
    if(minutes < 10){
        minutes = '0' + minutes;
    }
    var seconds = now.getSeconds();
    if(seconds < 10){
        seconds = '0' + seconds;
    }
    const fileName = "chat-log-" + year + month + day + hours + minutes + seconds;
    const content = messages.map(el => {return {"role": el.role, "message": el.content, "timestamp": el.timestamp}})
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

    componentDidMount() {
        if(this.props.auth.isAuthenticated && this.props.location && this.props.location.state){
            let question = '';
            if(this.props.location.state.requestType === 'info'){
                question = 'Mi dai delle informazioni sul film '
            } else if(this.props.location.state.requestType === 'similar'){
                question = 'Mi suggeriresti dei film simili a '
            }
            question += this.props.location.state.title;
            if(this.props.location.state.year && this.props.location.state.year.length > 0){
                question += ' ti do qualche dettaglio in più: ' + this.props.location.state.year
            }
            question +='?';
            this.props.resetChatResponse();
            this.props.fetchChatResponse(this.props.messages.conversationId, question);
        }
    }


    render() {
        return (
            <div className='container white-back'>
                <div className='row row-content d-flex justify-content-center'>
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
                                        innerRef={(input) => this.prompt = input} onKeyPress={(e => { if (e.charCode === 13) { this.props.fetchChatResponse(this.props.messages.conversationId, this.prompt.value); this.prompt.value = ''; } })} />
                                </FormGroup>
                            </div>
                            <div className='col-2 col-md-1'>
                                <Button className='navigation-button mr-3 mr-md-0' type="button" value="send" color="primary"
                                    onClick={() => {
                                        this.props.fetchChatResponse(this.props.messages.conversationId, this.prompt.value);
                                        this.prompt.value = '';

                                    }}>
                                    <span className="fa fa-paper-plane" />
                                </Button>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-1 ml-4'>
                                <Button className='navigation-button' type="button" value="send" color="primary"
                                    onClick={() => {
                                        this.props.resetChatResponse();
                                        this.prompt.value = '';

                                    }}>
                                    <span className="fa fa-refresh" />
                                </Button>
                            </div>
                            <div className='col-1 ml-1 ml-4 ml-md-0'>
                                <Button className='navigation-button mr-3 mr-md-0' type="button" value="send" color="primary"
                                    onClick={() => { downloadChat(this.props.messages.messages) }}>
                                    <span className="fa fa-download" />
                                </Button>
                            </div>
                            {this.props?.location?.state?.backUrl?.lenght > 0 &&
                            <div className='col-1 ml-1 ml-4 ml-md-0'>
                            <button type='button' className='navigation-button btn btn-primary'><Link to={this.props.location.state.backUrl} style={{color: 'white'}}><span className="fa fa-arrow-left" /></Link></button>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        );

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatAI));