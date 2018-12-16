import React from "react";

import { Progress } from "semantic-ui-react";

export default class ProgressBar extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <Progress
          percent={this.props.percent}
          label={this.props.label}
          indicating />
      </div>
    );
  }
}
