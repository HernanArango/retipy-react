import React, { Component } from "react";
import {Route, Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Drawer, IconButton, MenuItem, Snackbar, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CloseIcon from '@material-ui/icons/Close';
import RetinalEvaluation from "./evaluation/RetinalEvaluation"
import UploadImage from "./UploadImage";
import Diagnostic from "./diagnostics/Diagnostic";
import { GlobalContext } from "./GlobalContext";
import Record from "./record/Record";

const styles = {
  root: {
    flexGrow: 1,
  },
};

class App extends Component {
  state = {
    token: "",
    user_name: "Guest",
    drawerOpen: false,
    toastMessage: "",
    toastOpen: false,
  }

  handleDrawer = () => this.setState({drawerOpen: !this.state.drawerOpen});

  handleSnackbar = (event, reason) =>
  {
    if (reason === 'clickaway') {
      return;
    }

    this.setState(
      {
        showSnackbar: false,
        userMessage: ""
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
              onClick={this.handleSnackbar}
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
            <Drawer open={this.state.drawerOpen} >
              <div className={classes.drawerHeader}>
                <IconButton onClick={this.handleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
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
            <Typography variant="title" color="inherit" className={classes.flex}>
              Retipy
            </Typography>
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
            /> }
        />
        <Route exact path="/upload" component={UploadImage} />
        <Route
          exact
          path="/diagnostic/:id"
          render={ props => <Diagnostic id={props.match.params.id} /> }
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
