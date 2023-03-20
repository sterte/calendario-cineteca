import React, { Component } from 'react';
import { fetchChatResponse, resetChatResponse } from '../redux/ActionCreators'
import { connect } from 'react-redux';
import { Button, FormGroup, Input } from 'reactstrap';

const mapStateToProps = (state) => {
    return {
        messages: state.chatResponses
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchChatResponse: (conversationId, lastMessage) => { dispatch(fetchChatResponse(conversationId, lastMessage)) },
    resetChatResponse: () => { dispatch(resetChatResponse()) }
});


class ChatAI extends Component {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }


    render() {
        return (
            <div className='container white-back'>
                <div className='row row-content d-flex justify-content-center'>
                    <div className='col-12 hide-scrollbar' style={{ display: 'flex', flexDirection: 'column-reverse', height: '400px', overflowY: 'scroll' }}>
                        <div className='row'>
                            {this.props.messages.messages.map(el => <div style={'user' === el.role ? { backgroundColor: 'gray', borderRadius: '10px', marginLeft: 'auto', marginRight: '0px', maxWidth: '60%' } : { backgroundColor: 'orange', borderRadius: '10px', marginLeft: '0px', marginRight: 'auto', maxWidth: '60%' }} className={el.role === 'user' ? 'col-12 mt-3 p-3 mr-3' : 'col-12 mt-3 p-3 ml-3'}>{el.content}</div>)}
                            {this.props.messages.isLoading &&
                                <div className='col-12 mt-3 p-3'>
                                    <i class="fa fa-spinner fa-spin fa-fw"></i>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='col-12 mt-4'>
                        <div className='row ml-2'>
                            <div className='col-9 col-md-10'>
                                <FormGroup>
                                    <Input type="text" id="prompt" name="prompt"
                                        innerRef={(input) => this.prompt = input} onKeyPress={(e => { if (e.charCode === 13) { this.props.fetchChatResponse(this.props.messages.conversationId, this.prompt.value); this.prompt.value = ''; } })} />
                                </FormGroup>
                            </div>
                            <div className='col-1'>
                                <Button className='navigation-button mr-3 mr-md-0' type="button" value="send" color="primary"
                                    onClick={() => {
                                        this.props.fetchChatResponse(this.props.messages.conversationId, this.prompt.value);
                                        this.prompt.value = '';

                                    }}>
                                    <span className="fa fa-paper-plane" />
                                </Button>
                            </div>
                            <div className='col-1'>
                                <Button className='navigation-button' type="button" value="send" color="primary"
                                    onClick={() => {
                                        this.props.resetChatResponse();
                                        this.prompt.value = '';

                                    }}>
                                    <span className="fa fa-refresh" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatAI);