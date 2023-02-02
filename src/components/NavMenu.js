import React, { Component, Fragment } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import authService from './api-authorization/AuthorizeService';
import { AuthorizationPaths } from './api-authorization/ApiAuthorizationConstants';
import { ApplicationPaths } from './Constants';

export class NavMenu extends Component
{
  static displayName = NavMenu.name;

  constructor(props)
  {
    super(props);

    this.state = {
      isAuthenticated: false,
      userName: null,
      role: null
    };
  }

  componentDidMount()
  {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount()
  {
    authService.unsubscribe(this._subscription);
  }

  async populateState()
  {
    const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
    this.setState({
      isAuthenticated,
      userName: user && user.name,
      role: user && user.role
    });
  }

  render()
  {
    return (
      <header>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/" style={styles.navBarText}>Dotnet Economy</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              {this.checkAuthAndRenderMenuItems()}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }

  checkAuthAndRenderMenuItems()
  {
    if (!this.state.isAuthenticated)
    {
      return this.anonymousView();
    } else
    {
      return this.authenticatedView();
    }
  }

  anonymousView()
  {
    const loginPath = `${AuthorizationPaths.Login}`;
    return (<Fragment>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/">Home</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link as={Link} to={loginPath}>Login</Nav.Link>
      </Nav>
    </Fragment>);
  }

  authenticatedView()
  {
    if (this.state.role === "Admin")
    {
      return (<Fragment>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/" style={styles.navBarText}>Home</Nav.Link>
          {this.storeAndInventoryItems()}
          <Nav.Link as={Link} to={ApplicationPaths.CatalogPath} style={styles.navBarText}>Catalog</Nav.Link>
          <Nav.Link as={Link} to={ApplicationPaths.UsersPath} style={styles.navBarText}>Users</Nav.Link>
        </Nav>
        <Nav>
          {this.profileAndLogoutItems()}
        </Nav>
      </Fragment>);
    }
    else if (this.state.role === "Player")
    {
      return (<Fragment>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          {this.storeAndInventoryItems()}
        </Nav>
        <Nav>
          {this.profileAndLogoutItems()}
        </Nav>
      </Fragment>);
    }
    else
    {
      return (<Fragment>
        {this.profileAndLogoutItems()}
      </Fragment>);
    }
  }

  storeAndInventoryItems()
  {
    return (<Fragment>
      <Nav.Link as={Link} to={ApplicationPaths.StorePath} style={styles.navBarText}>Store</Nav.Link>
      <Nav.Link as={Link} to={ApplicationPaths.InventoryPath} style={styles.navBarText}>My Inventory</Nav.Link>
    </Fragment>);
  }

  profileAndLogoutItems()
  {
    const profilePath = `${AuthorizationPaths.Profile}`;
    const logoutPath = { pathname: `${AuthorizationPaths.LogOut}`, state: { local: true } };
    return (<Fragment>
      <Nav.Link as={Link} to={profilePath} style={styles.navBarText}>Hello {this.state.userName}</Nav.Link>
      <Nav.Link as={Link} to={logoutPath} style={styles.navBarText}>Logout</Nav.Link>
    </Fragment>);
  }
}

const styles = {
  navBarText: { color: "black", fontWeight:'bold' }
};