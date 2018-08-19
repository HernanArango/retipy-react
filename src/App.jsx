import React, { Component } from "react";
import {Route} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, Snackbar, Toolbar, Typography } from '@material-ui/core';
import {AccountCircleSharp} from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import RetinalEvaluation from "./evaluation/RetinalEvaluation"
import UploadImage from "./UploadImage";
import Diagnostic from "./diagnostics/Diagnostic";
import { GlobalContext } from "./GlobalContext";
import Record from "./patient/Record";
import Login from "./common/Login";
import PatientList from "./patient/PatientList";
import { withCookies } from "react-cookie";
import { refreshToken } from "./token/TokenService";
import Patient from "./patient/Patient";

const styles = theme => ({
  root: {
    flexGrow: 1,
    minHeight: window.innerHeight,
  },
  footer: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 11,
    marginTop: -20,
    marginBottom: -20,
    color: 'rgb(127, 127, 127)',
    backgroundColor: '#EFEFEF',
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
});

class App extends Component {

  handleChange = (key, value) => this.setState({[key]: value});

  state = {
    token: "",
    loginOpen: false,
    handleChange: this.handleChange,
    username: "",
    drawerOpen: false,
    toastMessage: "",
    toastOpen: false,
  }

  constructor(props)
  {
    super(props);

    const { cookies } = props;
    const token = cookies.get('token');
    const username = cookies.get('username');
    if (token !== undefined)
    {
      refreshToken(token)
        .then(newToken =>
        {
          if (newToken !== "")
          {
            cookies.set('token', newToken, { path: '/' });
            cookies.set('username', username, { path: '/' });
            this.setState(
              {
                token: newToken,
                username: username,
              });
          }
        })
        .catch(error => {
          console.log(error);
          cookies.remove('token', { path: '/' });
          cookies.remove('username', { path: '/' });
        })
    }
  }

  toast = (message) => {
    this.setState(
      {
        toastOpen: true,
        toastMessage: message,
      }
    );
  }

  handleDrawer = () => this.setState({drawerOpen: !this.state.drawerOpen});

  closeSnackbar = (event, reason) =>
  {
    if (reason === 'clickaway') {
      return;
    }

    this.setState(
      {
        toastOpen: false,
        toastMessage: ""
      });
  }

  render() {
    const { classes } = this.props;

    return (
    <div>
      <div className={classes.root}>
        <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.toastOpen}
            autoHideDuration={3000}
            onClose={this.handleSnackbar}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.toastMessage}</span>}
            action={
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.closeSnackbar}
              >
                <CloseIcon />
              </IconButton>
            }
          />
        <GlobalContext.Provider value={this.state}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Retipy
              </Typography>
              <div>
                <IconButton
                  onClick={() => {
                    if (this.state.token === "")
                    {
                      this.setState({loginOpen: true});
                    }
                  }}
                >
                  <AccountCircleSharp color="inherit"/>
                </IconButton>
                <Login
                  handleChange={this.handleChange}
                  open={this.state.loginOpen}
                />
              </div>
              {this.state.username && <Typography color="inherit">{this.state.username}</Typography>}
            </Toolbar>
          </AppBar>
        </GlobalContext.Provider>
          <Route
            exact
            path="/evaluation/:id/:selection"
            render={ props =>
              <RetinalEvaluation
                id={props.match.params.id}
                selection={props.match.params.selection}
              /> }
          />
          <Route
            exact
            path="/upload"
            render={() =>
              <UploadImage token={this.state.token} toast={this.toast}/>}
          />
          <Route
            exact
            path="/"
            render={() => <PatientList token={this.state.token} toast={this.toast}/>}
          />
          <Route
            exact
            path="/diagnostic/:id"
            render={ props =>
              <Diagnostic
                id={props.match.params.id}
                token={this.state.token}
                handleChange={this.handleChange}
              />
            }
          />
          <Route
            exact
            path="/record"
            render={props => <Record />}
          />
          <Route
            exact
            path="/patient/:id"
            render={ props =>
              <Patient id={parseInt(props.match.params.id, 10)} token={this.state.token} toast={this.toast} />}
          />
      </div>
      <footer className={classes.footer}>
          <p>retipy <a href="https://github.com/alevalv/retipy-react">v0.0.1</a>
          <br/>Copyright © 2018 Alejandro Valdes - Alejandra Aguiar - Felipe Castaño
          <br/>Licensed under <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPLv3</a></p>
      </footer>
    </div>

    );
  }
}

export default withCookies(withStyles(styles)(App));
