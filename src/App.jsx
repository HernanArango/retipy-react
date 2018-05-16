import React, { Component } from "react";
import {Route, Link} from 'react-router-dom';
import RetinalEvaluation from "./evaluation/RetinalEvaluation"
import UploadImage from "./UploadImage";
import Diagnostic from "./diagnostics/Diagnostic";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
  root: {
    flexGrow: 1,
  },
};

class App extends Component {
  state = {
    drawerOpen: false
  }

  handleDrawer = () => this.setState({drawerOpen: !this.state.drawerOpen});

  render() {
    const { classes } = this.props;

    return (
    <div className={classes.root}>
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
          </Drawer>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Retipy
          </Typography>
        </Toolbar>
      </AppBar>
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
      </div>
    </div>
    );
  }
}

export default withStyles(styles)(App);
