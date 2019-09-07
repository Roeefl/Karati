import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import './HeaderMenu.css';

class HeaderMenu extends React.Component {
  render() {
    const { icon, title, links } = this.props;
    
    const items = links.map(link => {
      return (
        <Dropdown.Item
          icon={link.icon}
          as={Link}
          text={link.text}
          to={link.to}
          key={link.to}
        />
      );
    });

    return (
      <Dropdown
        className='item icon'
        labeled
        button
        icon={icon}
        text={title}
      >
        <Dropdown.Menu>
          {items}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default HeaderMenu;
