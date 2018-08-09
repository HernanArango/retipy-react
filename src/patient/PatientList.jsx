import React, { Component } from "react";
import { Grid, Paper, Typography, TextField, withStyles } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {Configuration as CNF} from "../Configuration.jsx"

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: '#EFEFEF',
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
  };

  constructor(props)
  {
    super(props);
    this.state.disabled = props.disabled;
  }

  addHandler(){
    console.log("Add new patient");
  }

  loadPatients(){
    var n = this.state.list.length;
    var result = []
    for (var i = 0; i < n; i++) {
      if(this.state.list[i][1].toString().search(this.state.inputValue) >= 0)
       result.push(
       <div key={i}>
        <ListItem button>
          <ListItemText primary={this.state.list[i][1]} />
          {this.state.list[i][2]}
        </ListItem>
        <Divider light />
      </div>);
    }
    return(result);
  }

  handleSearch = event =>
  {
    this.setState({inputValue: event.target.value});
  };

  componentDidMount()
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
          'Authorization': this.props.token,
        }
      })
      .then(response => response.json())
      .then(data =>
        {
          var list = []
          for (var i=0; i < data.length; i++)
          {
            list.push([data[i].first, data[i].second, data[i].third])
          }
          this.setState(
            {
              list: list
            });
        })
      .catch(error => console.log(error));
  }

  render()
  {
    const { classes } = this.props;
    return(
      <div className={classes.root}>
        <Grid container spacing={16} className={classes.container} justify={'center'}>
          <Grid item  lg={8} md={10} sm={12} xs={12}>
            <Grid container spacing={16} justify={'space-around'}>
              <Grid item lg={6} md={6} sm={6} xs={6}>
                <Typography variant="display1" className={classes.title} >Patient List</Typography>
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={6} align={'right'}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.title}
                  onClick={this.addHandler.bind(this)}
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
    )
  }
}

export default withStyles(styles)(PatientList);
