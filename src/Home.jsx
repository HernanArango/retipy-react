import React, { Component } from "react";
import { Grid, Paper, Typography, TextField, withStyles } from "@material-ui/core";
import Button from '@material-ui/core/Button';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';




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

class Demography extends Component
{
  state =
  {
    id: 0,
    editable: false,
    identity: "",
    name: "",
    age: "",
    sex: "",
    origin: "",
    procedencia: "",
    education: "",
    race: "",
    patologicalPast: [],
    familiarPast: [],
    medicines: [],
    inputValue: "",
    list: [[112314345, "Pecos Bill"], [212214132, "Antonio Cruz"], [312341324, "Armando Casas"], [4123412, "Arnulfo Renato"], [51234, "Argemiro Todo"], [612341, "Elba Lazo"], [712341, "Debora Dora"], [81324, "Alan Brito"], [912341234, "Ana Tomia"] ]
  };

  constructor(props)
  {
    super(props);
    this.state.id = props.id;
    this.state.disabled = props.disabled;
  }

  addHandler(){
    console.log("Add new patient");  
  }

  loadPacients(){
    var n = this.state.list.length;
    var result = []
    for (var i = 0; i < n; i++) {
      if(this.state.list[i][0].toString().search(this.state.inputValue) >= 0)
       result.push(<div key={i}><ListItem button> <ListItemText primary={this.state.list[i][0]} /> {this.state.list[i][1]} </ListItem> <Divider light /></div>);
    }
    return(result);
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
                <Button variant="contained" color="primary" className={classes.title} onClick={this.addHandler.bind(this)}>
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
                  onChange={event => this.setState({inputValue: event.target.value})}
                  value={this.state.inputValue}
                />
              </Grid>
              <Grid item  lg={12} md={12} sm={12} xs={12}>
                <List component="nav" style={{overflow: 'auto', maxHeight: 370, minHeight: 370}}>
                  {this.loadPacients()}
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

export default withStyles(styles)(Demography);
