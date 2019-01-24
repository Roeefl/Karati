import React from 'react';

class ChatNewMessage extends React.Component {
    state = {
        msg: ''
    };

    updateMsg = (event) => {
        this.setState( {
            msg: event.target.value
        } );
    }

    sendMsg = () => {
        this.props.sendMsg(this.state.msg);
        this.setState({ msg: '' });
    }

    render() {
        return (
            <div className="chat-new-message">
                <form className="ui reply form">
                    <div className="field">

                        <div className="ui action input">
                            <input
                                type="text"
                                placeholder="Hey! Lets meet up and swap the books!"
                                value={this.state.msg}
                                onChange={this.updateMsg} />

                            <div
                                className="ui blue labeled submit icon button"
                                onClick={this.sendMsg}
                            >
                                <i className="paper plane outline icon" /> Send
                            </div>
                        </div>  

                    </div>


                </form>
            </div>
        );
    }
}

export default ChatNewMessage;
