import React, { Component } from "react";
import {Route, Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Drawer, IconButton, MenuItem, Snackbar, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {AccountCircleSharp} from '@material-ui/icons';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CloseIcon from '@material-ui/icons/Close';
import RetinalEvaluation from "./evaluation/RetinalEvaluation"
import UploadImage from "./UploadImage";
import Diagnostic from "./diagnostics/Diagnostic";
import { GlobalContext } from "./GlobalContext";
import Record from "./patient/Record";
import Login from "./common/Login";
import PatientList from "./patient/PatientList";
import { CookiesProvider } from "react-cookie";

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
};

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
    <div className={classes.root}>
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.toastOpen}
          autoHideDuration={3000}
          onClose={this.closeSnackbar}
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
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.handleDrawer} >
              <MenuIcon />
            </IconButton>
            {this.state.token !== "" && // don't render menu if the user is not logged in
            <Drawer open={this.state.drawerOpen} >
              <div className={classes.drawerHeader}>
                <IconButton onClick={this.handleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <MenuItem onClick={this.handleDrawer}>
                <Link to="/" >
                  Home
                </Link>
              </MenuItem>
              <MenuItem onClick={this.handleDrawer}>
                <Link to="/upload" >
                  Upload Image
                </Link>
              </MenuItem>
              <MenuItem onClick={this.handleDrawer}>
                <Link to="/evaluation/1/1">
                  Evaluation
                </Link>
              </MenuItem>
              <MenuItem onClick={this.handleDrawer}>
                <Link to="/record">
                  Record
                </Link>
              </MenuItem>
            </Drawer>
            }
            <Typography variant="title" color="inherit" className={classes.flex}>
              Retipy
            </Typography>
            <div>
              <IconButton onClick={
                () => {
                  if (this.state.token === "")
                  {
                    this.setState({loginOpen: true});
                  }
                }}>
                <AccountCircleSharp color="inherit"/>
              </IconButton>
              <CookiesProvider>
              <Login
                handleChange={this.handleChange}
                open={this.state.loginOpen}
              />
              </CookiesProvider>
            </div>
              {this.state.username && <Typography color="inherit">{this.state.username}</Typography>}
          </Toolbar>
        </AppBar>
      </GlobalContext.Provider>
      <div>
        <Route
          exact
          path="/evaluation/:id/:selection"
          render={ props =>
            <RetinalEvaluation
              id={props.match.params.id}
              selection={props.match.params.selection}
            />}
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
      </div>
    </div>

    );
  }
}

export default withStyles(styles)(App);
