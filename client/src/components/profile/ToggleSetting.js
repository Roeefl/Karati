import React from 'react';

class ToggleSetting extends React.Component {
  render() {
    return (
      <div className="ui toggle checkbox">
        <input
          type="checkbox"
          name={this.props.name}
          defaultChecked={this.props.checked}
          onChange={this.props.handleChange}
        />
        <label>{this.props.label}</label>
      </div>
    );
  }
}

ToggleSetting.defaultProps = {
  name: 'toggleSetting',
  label: 'Some toggle setting'
};

export default ToggleSetting;
