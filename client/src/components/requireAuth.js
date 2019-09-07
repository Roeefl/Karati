import React, { Component } from 'react';
import { connect } from 'react-redux';

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() {
      this.shouldGoBack();
    }

    componentDidUpdate() {
      this.shouldGoBack();
    }

    shouldGoBack() {
      console.log(this.props.user);

      if (!this.props.user) this.props.history.push('/');
    }

    render() {
      return <ChildComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { user: state.userData };
  }

  return connect(mapStateToProps)(ComposedComponent);
};
