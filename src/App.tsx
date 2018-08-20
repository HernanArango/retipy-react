import { AppBar, createStyles, IconButton, Snackbar, Toolbar, Typography } from "@material-ui/core";
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles from '@material-ui/core/styles/withStyles';
import { AccountCircleSharp } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';
import './App.css';
import Routes from './configuration/Routes';
import withRoot from './configuration/withRoot';
import { RetipyContextProvider } from './context/RetipyContext';

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
      token: "",
      username: "",
    }
  }

  public render() {
    const { classes } = this.props;
    return (
      <RetipyContextProvider
        value={{ token: this.state.token, username: this.state.username, toast: this.toast }}
      >
        <div className={classes.root}>
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
            </Toolbar>
          </AppBar>

          <Routes />


          <footer className={classes.footer}>
            <p>retipy <a href="https://github.com/alevalv/retipy-react">v0.0.1</a>
              <br />Copyright © 2018 Alejandro Valdes - Alejandra Aguiar - Felipe Castaño
          <br />Licensed under <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPLv3</a></p>
          <br/>
          </footer>
        </div>
      </RetipyContextProvider>
    );
  }

  private toast = (message: string) => {
    this.setState({
      isToastOpen: true,
      toast: message,
    })
  }

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
