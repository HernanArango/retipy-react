import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { Grid, Paper, Typography, TextField, withStyles } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {Configuration as CNF} from "../Configuration.jsx"
import PleaseLogIn from "../common/PleaseLogIn";

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: '#EFEFEF',
    minHeight: window.innerHeight,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    margin: theme.spacing.unit * 2,
  },
  roiButton: {
    margin: theme.spacing.unit / 2,
  },
  button: {
    margin: theme.spacing.unit,
    PaddingLeft: theme.spacing.unit,
  },
  textField: {
    marginRight: theme.spacing.unit,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

class PatientList extends Component
{
  state =
  {
    list: [],
    inputValue: "",
    token: "",
    disabled: false,
    newPatient: false,
    redirectTarget: -1,
  };

  constructor(props)
  {
    super(props);
    this.state.disabled = props.disabled;
    this.state.token = props.token;
  }

  handleRedirect = (id) => (event) => this.setState({redirectTarget: id});

  loadPatients(){
    var n = this.state.list.length;
    var result = []
    for (var i = 0; i < n; i++) {
      if(this.state.list[i][1].toString().search(this.state.inputValue) >= 0)
       result.push(
       <div key={i}>
        <ListItem button>
          {this.state.redirectTarget === this.state.list[i][0] && <Redirect to={`/patient/${this.state.redirectTarget}`}/> }
          <ListItemText primary={this.state.list[i][1]} onClick={this.handleRedirect(this.state.list[i][0])} />
          {this.state.list[i][2]}
        </ListItem>
        <Divider light />
      </div>);
    }
    return(result);
  }

  fetchPatients(token)
  {

    if (token !== "")
    {
    fetch(
      CNF.REST_URL + CNF.PATIENT_ENDPOINT + "/list",
      {
        method: 'GET',
        mode: 'cors',
        referrer: 'no-referrer',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'content-type': 'application/json',
          'Authorization': token,
        }
      })
      .then(response => {
        if(!response.ok)
        {
          throw Error("Not logged in");
        }
        return response.json();
      })
      .then(data =>
        {
          var list = [];
          for (var i=0; i < data.patientList.length; i++)
          {
            list.push(
              [data.patientList[i].first, data.patientList[i].second, data.patientList[i].third]);
          }
          this.setState(
            {
              list: list,
              token: token,
            });
        })
      .catch(error => console.log(error));
    }
  }

  handleSearch = event =>
  {
    this.setState({inputValue: event.target.value});
  };

  componentDidMount()
  {
    this.fetchPatients(this.state.token);
  }

  componentDidUpdate(prevProps) {
    if (this.props.token !== prevProps.token)
    {
      this.fetchPatients(this.props.token);
    }
  }

  render()
  {
    const { classes } = this.props;
    if (this.props.token === "")
    {
        return(<PleaseLogIn/>);
    }
    else
    {
    return(
      <div className={classes.root}>
        <Grid container spacing={16} className={classes.container} justify={'center'}>
          <Grid item  lg={8} md={10} sm={12} xs={12}>
            <Grid container spacing={16} justify={'space-around'}>
              <Grid item lg={6} md={6} sm={6} xs={6}>
                <Typography variant="display1" className={classes.title} >Patient List</Typography>
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={6} align={'right'}>
                {this.state.newPatient && <Redirect to="/patient/0" />}
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.title}
                  onClick={() => this.setState({newPatient: true})}
                >
                  New Patient
                </Button>
              </Grid>
            </Grid>
            <Paper className={classes.paper}>
            <Grid container spacing={16} justify={'space-around'}>
              <Grid item lg={11} md={11} sm={11} xs={10}>
                <TextField
                  id="search"
                  label="Search"
                  type="search"
                  className={classes.textField}
                  margin="normal"
                  fullWidth
                  onChange={this.handleSearch}
                  value={this.state.inputValue}
                />
              </Grid>
              <Grid item  lg={12} md={12} sm={12} xs={12}>
                <List component="nav" style={{overflow: 'auto', maxHeight: 370, minHeight: 370}}>
                  {this.loadPatients()}
                </List>
              </Grid>
             </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
      );
    }
  }
}

export default withStyles(styles)(PatientList);
