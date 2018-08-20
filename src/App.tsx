import { AppBar, createStyles, IconButton, Snackbar, Toolbar, Typography } from "@material-ui/core";
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles from '@material-ui/core/styles/withStyles';
import { AccountCircleSharp } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import * as Cookies from 'es-cookie';
import * as React from 'react';
import './App.css';
import { Endpoints } from "./configuration/Endpoints";
import Routes from './configuration/Routes';
import withRoot from './configuration/withRoot';
import { RetipyContextProvider } from './context/RetipyContext';
import Login from "./login/Login";
import LoginError from "./login/LoginError";

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
    root: {
      backgroundColor: '#EFEFEF',
      flexGrow: 1,
      minHeight: window.innerHeight,
    },
  });

interface IAppState {
  isLoginDialogOpen: boolean,
  isToastOpen: boolean,
  toast: string,
  token: string,
  username: string,
}

interface IAppProps {
  classes: any,
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      isLoginDialogOpen: false,
      isToastOpen: false,
      toast: "",
      'token': "",
      'username': "",
    }
    this.refreshToken();
  }

  public render() {
    const { classes } = this.props;

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
              <Typography variant="title" color="inherit" className={classes.flex}>
                Retipy
              </Typography>
              <div>
                <IconButton
                  onClick={this.openLoginDialog}>
                  <AccountCircleSharp color="inherit" />
                </IconButton>
              </div>
              {this.state.username && <Typography color="inherit">{this.state.username}</Typography>}
            </Toolbar>
          </AppBar>

          {app}

          <footer className={classes.footer}>
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
        process.env.REACT_APP_RETIPY_BACKEND_URL + Endpoints.Token,
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
            Cookies.remove('token');
            Cookies.remove('username');
          }
        });
    }
  }

  private setLoginData = (username: string, token: string) => {
    this.setState({
      isLoginDialogOpen: false,
      'token': token,
      'username': username,
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

  private openLoginDialog = () => {
    if (this.state.token === "") {
      this.setState({ isLoginDialogOpen: true });
    }
  }
}

export default withRoot(withStyles(styles)(App));
