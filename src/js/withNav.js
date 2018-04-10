import React, { Component } from 'react';
import Nav from './components/Nav';
import { Container } from 'semantic-ui-react';

export default (Component, key) => {
  return class extends Component {
    render() {
      return [
        <Nav key="nav" activeItem={key} {...this.props} />,
        <Container key="body" className="app-container">
          <Component {...this.props} />
        </Container>
      ];
    }
  };
};