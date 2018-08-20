import { createStyles, IconButton, Snackbar } from "@material-ui/core";
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles from '@material-ui/core/styles/withStyles';
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

          <Routes />

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
}

export default withRoot(withStyles(styles)(App));
