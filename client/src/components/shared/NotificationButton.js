import React from 'react';
import { Button, Popup } from 'semantic-ui-react';
import NotificationMenu from './NotificationMenu';

const NotificationButton = props => (
  <Popup
    trigger={
      <Button color="black">
        <i className="red bell outline icon" />
        <div
          className={`ui floating green circular mini label ${
            props.unread === 0 ? 'hidden' : ''
          }`}
        >
          {props.unread}
        </div>
      </Button>
    }
    content={<NotificationMenu />}
    on="click"
    position="top right"
  />
);

export default NotificationButton;
