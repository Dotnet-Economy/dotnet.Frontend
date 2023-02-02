import React, { Component } from 'react';
import { Container} from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import bgImage from '../images/bg.png';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', height: '100vh' }}>
        <NavMenu />
        <Container style={{ paddingTop: '50px', paddingBottom: '50px', color: 'white', fontSize: '1.3em', fontWeight: 'bold' }}>
          {this.props.children}
        </Container>
        <Footer />
      </div>
    );
  }
}
