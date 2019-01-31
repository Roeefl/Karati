import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateMyShelf, getUserDataById } from '../../actions';
import MiniSwipeItemList from '../shared/MiniSwipeItemList';
import UserCard from '../shared/UserCard';

class OfferedBy extends Component {
    componentDidMount() {
        if (!this.props.currBook)
            return;

        const { ownerID } = this.props.currBook;

        this.props.getUserDataById(ownerID);
        this.props.updateMyShelf();
    }

    renderHeader() {
        if (!this.props.ownerInfo)
            return;
        
        return (
            <h1 className="ui centered raised header">
                Offered for exchange by: {this.props.ownerInfo.username}
            </h1>
        );
    }

    renderUserCard() {
        if (!this.props.ownerInfo)
            return;

        return (
            <UserCard
                user={this.props.ownerInfo}
            />
        );
    }

    renderUserSwipes() {
        if (!this.props.ownerInfo)
            return;
        
        if (!this.props.myShelf)
            return;

        return (
            <MiniSwipeItemList
                myUserId={this.props.currentUser._id}
                myShelf={this.props.myShelf}
                swipes={this.props.ownerInfo.swipes}
            />
        )
    }    

    render() {
        return (
            <div className="ui raised segment middle aligned grid offered-by">
                <div className="ui centered row">
                    {this.renderHeader()}
                </div>

                <div className="ui center aligned row">
                    <div className="ui center aligned six wide column">
                        {this.renderUserCard()}
                    </div>
                    <div className="ui center aligned ten wide column">
                        {this.renderUserSwipes()}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.userData,
        currBook: state.selectedBookFromBrowse,
        ownerInfo: state.ownerInfo,
        myShelf: state.myBooks
    }
};

export default connect(
    mapStateToProps,
    { updateMyShelf, getUserDataById }
)(OfferedBy);