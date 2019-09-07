import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './Image.css';

class Image extends Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    isCentered: PropTypes.bool
  };

  static defaultProps = {
    alt: 'Karati Image',
    isCentered: true
  };

  render() {
    const { 
      src,
      alt,
      isCentered
    } = this.props;

    return (
      <div className={cx('ui image', { ['centered']: isCentered })}>
        <img src={src} alt={alt} />
      </div>
    );
  }
}

export default Image;
