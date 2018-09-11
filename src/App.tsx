import { AppBar, createStyles, IconButton, Menu, MenuItem, Snackbar, SvgIcon, Toolbar, Typography } from "@material-ui/core";
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles from '@material-ui/core/styles/withStyles';
import { AccountCircleSharp, Home } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import * as Cookies from 'es-cookie';
import * as React from 'react';
import { Redirect, Route } from "react-router";
import './App.css';
import { Endpoints } from "./configuration/Endpoints";
import Routes from './configuration/Routes';
import withRoot from './configuration/withRoot';
import { RetipyContextProvider } from './context/RetipyContext';
import About from "./status/About";
import Login from "./user/Login";
import LoginError from "./user/LoginError";

const styles = (theme: Theme) =>
  createStyles({
    flex: {
      flexGrow: 1,
    },
    footer: {
      color: 'rgb(127, 127, 127)',
      flexGrow: 1,
      fontFamily: 'Roboto Mono, monospace',
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: -20,
      marginTop: -20,
      textAlign: 'center',
    },
    retipyIcon: {
      marginRight: 20,
      marginTop: 0,
    },
    root: {
      backgroundColor: '#EFEFEF',
      flexGrow: 1,
      minHeight: window.innerHeight,
    },
  });

interface IAppState {
  anchorLogin: HTMLElement | null,
  isLoginDialogOpen: boolean,
  isRedirecting: boolean,
  isToastOpen: boolean,
  redirect: string,
  toast: string,
  token: string,
  username: string,
}

interface IAppProps {
  classes: any,
}

const renderAbout =
    ()  =>
        (props: any) =>
            <About />;
class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      anchorLogin: null,
      isLoginDialogOpen: false,
      isRedirecting: false,
      isToastOpen: false,
      redirect: "",
      toast: "",
      'token': "",
      'username': "",

    }
    this.refreshToken();
  }

  public componentDidUpdate() {
    if (this.state.isRedirecting) {
      this.setState({redirect: "", isRedirecting: false});
    }
  }

  public render() {
    const { classes } = this.props;
    const userMenuOpen = Boolean(this.state.anchorLogin);

    let app = <Routes />;
    if (this.state.token === "") {
      app = <LoginError />
    }

    return (
      <RetipyContextProvider
        value={
          {
            toast: this.toast,
            token: this.state.token,
            username: this.state.username,
          }
        }
      >
        <div className={classes.root}>
          {this.state.isRedirecting && <Redirect to={this.state.redirect} />}
          <Login open={this.state.isLoginDialogOpen} closeDialog={this.closeDialog} setLoginData={this.setLoginData} />
          <Snackbar
            anchorOrigin={{
              horizontal: 'left',
              vertical: 'bottom',
            }}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            open={this.state.isToastOpen.valueOf()}
            autoHideDuration={3000}
            onClose={this.closeSnackbar}
            message={<span id="message-id">{this.state.toast}</span>}
            action={
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.closeSnackbarManually}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <AppBar position="static">
            <Toolbar>
              <SvgIcon className={classes.retipyIcon} >
                <path d="M11.744099 1.93198q.381 0 .85725.0635.508.0317.98425.127.47625.0635.85725.15875.41275.0635.60325.127l-.508 2.57175q-.34925-.127-1.17475-.28575-.79375-.1905-2.06375-.1905-.8255 0-1.6509998.1905-.79375.15875-1.04775.22225v13.87475h-2.95275V2.97973q1.04775-.381 2.6035-.6985 1.55575-.34925 3.4924998-.34925z" fill="#2196f3" />
                <path d="M11.397 1.5703746q.381 0 .85725.0635.508.03175.98425.127.47625.0635.85725.15875.41275.0635.60325.127l-.508 2.57175q-.34925-.127-1.17475-.28575-.79375-.1905-2.06375-.1905-.8255 0-1.6510001.1905-.79375.15875-1.04775.22225V18.429625h-2.95275V2.6181246q1.04775-.381 2.6035-.6985 1.55575-.34925 3.4925001-.34925z" />
              </SvgIcon>
              <Typography variant="title" color="inherit" className={classes.flex}>
                retipy
              </Typography>
              <IconButton
                color="inherit"
                onClick={this.handleHomeButton}
              >
                <Home/>
              </IconButton>
              <div>
                <IconButton
                  aria-haspopup="true"
                  aria-owns={userMenuOpen ? 'menu-appbar' : undefined}
                  color="inherit"
                  onClick={this.openLoginDialog}
                  >
                  <AccountCircleSharp color="inherit" />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.anchorLogin}
                  anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                  }}
                  transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                  }}
                  open={userMenuOpen}
                  onClose={this.handleCloseUserMenu}
                >
                  <MenuItem onClick={this.handleCloseUserMenu}>Profile</MenuItem>
                  <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
                </Menu>
              </div>
              {this.state.username && <Typography color="inherit">{this.state.username}</Typography>}
            </Toolbar>
          </AppBar>

          <Route
            exact={true}
            path="/about"
            render={renderAbout()}
          />
          {app}

          <footer className={classes.footer}>
          <br/>
            <p>retipy <a href="https://github.com/alevalv/retipy-react">v0.0.1</a>
              <br />Copyright © 2018 Alejandro Valdes - Alejandra Aguiar - Felipe Castaño
          <br />Licensed under <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPLv3</a></p>
            <br />
          </footer>
        </div>
      </RetipyContextProvider>
    );
  }

  private async refreshToken() {
    let username = Cookies.get('username');
    let token = Cookies.get('token');
    if (username === undefined || token === undefined) {
      username = "";
      token = "";
    }
    else {
      fetch(
        Endpoints.Server + Endpoints.Token,
        {
          body: token,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json',
          },
          method: 'POST',
          mode: 'cors',
          referrer: 'no-referrer',
        })
        .then(response => {
          if (!response.ok) {
            return new Promise((resolve, reject) => resolve(""))
          }
          else {
            return response.text()
          }
        })
        .then((newToken: string) => {
          if (newToken !== "") {
            Cookies.set('token', newToken);
            Cookies.set('username', username!);
            this.setState(
              {
                'token': newToken,
                username: username!,
              });
          }
          else {
            this.logout()
          }
        });
    }
  }

  private logout = () => {
    Cookies.remove('token');
    Cookies.remove('username');
    this.setState({
      token: "",
      username: "",
    })
  }

  private setLoginData = (username: string, token: string) => {
    this.setState({
      isLoginDialogOpen: false,
      'token': token,
      'username': username,
    })
  }

  private handleHomeButton = (event: React.MouseEvent<HTMLElement>) => {
    this.redirect("/");
  }

  private redirect = (location: string) => {
    this.setState({
      isRedirecting: true,
      redirect: location,
    })
  }

  private toast = (message: string) => {
    this.setState({
      isToastOpen: true,
      toast: message,
    })
  }

  private closeDialog = () => { this.setState({ isLoginDialogOpen: false }) };

  private closeSnackbar = (event: React.SyntheticEvent<any>, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState(
      {
        isToastOpen: false,
        toast: "",
      });
  }

  private closeSnackbarManually = (event: React.MouseEvent<HTMLElement>) => {
    this.setState(
      {
        isToastOpen: false,
        toast: "",
      });
  }

  private openLoginDialog = (event: React.MouseEvent<HTMLElement>) => {
    if (this.state.token === "") {
      this.setState({ isLoginDialogOpen: true });
    }
    else {
      this.setState({anchorLogin: event.currentTarget})
    }
  }

  private handleLogout = () => {
    this.logout();
    this.handleCloseUserMenu();
  }

  private handleCloseUserMenu = () => {
    this.setState({anchorLogin: null});
  }
}

export default withRoot(withStyles(styles)(App));
