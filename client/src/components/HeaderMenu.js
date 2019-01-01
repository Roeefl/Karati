import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

class HeaderMenu extends React.Component {  
    render() {
        const items = this.props.links.map( link => {
            return (
                    <Dropdown.Item icon={link.icon} as={Link} text={link.text} to={link.to} key={link.to} />
            );
        });

        return (
            <Dropdown text={this.props.title} className="item header-menu">
                <Dropdown.Menu>
                    {items}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
};

export default HeaderMenu;