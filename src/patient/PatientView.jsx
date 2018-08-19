import React, { Component } from "react";
import { Grid, Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem, withStyles } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Autocomplete from "../common/Autocomplete";

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
  },
  textField: {
    marginRight: theme.spacing.unit,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

const pathologicalAutocomplete = [
  { label: 'Hipertension Arterial'},
  { label: 'Diabetes Mellitus'},
  { label: 'Arterioesclerosis'},
  { label: 'Enfermedad Autoinmune'},
  { label: 'Dislipidemia'},
  { label: 'Nefropatía'},
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label,
}));

const toAutocompleteData = (values) => {
  return values.map(value => ({value: value, label: value}));
}

const fromAutocompleteData = (values) => {
  return values.map(value => value.value);
}

const familiarAutocomplete = [
  { label: 'Demencia'},
  { label: 'Enfermedad Mental'},
  { label: 'Hipertensión Arterial'},
  { label: 'Diabetes Mellitus'},
  { label: 'Arterioescleroris'},
  { label: 'Enfermedad Autoinmune'},
  { label: 'Dislipidemia'},
  { label: 'Nefropatía'},
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label,
}));

class PatientView extends Component
{
  state =
  {
    loaded: false,
  }

  componentDidMount()
  {
    this.setState({loaded: true})
  }
  render()
  {
    const { classes } = this.props;
    return(
      <div className={classes.root}>
        <Grid container spacing={16} className={classes.container} justify={'center'}>
          <Grid item  lg={8} md={10} sm={12} xs={12}>
            <Typography variant="display1" className={classes.title} >Demographic Data</Typography>
            <Paper className={classes.paper}>
            <form>
            <Grid container spacing={16} justify={'space-around'}>
              <Grid item lg={11} md={11} sm={12} xs={12}>
                <TextField
                  required
                  className={classes.textField}
                  id="name"
                  disabled={this.props.disabled}
                  value={this.props.name}
                  onChange={event => this.props.handleChange('name', event.target.value)}
                  label="Name"
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="identity"
                disabled={this.props.disabled}
                value={this.props.identity}
                onChange={event => this.props.handleChange('identity', event.target.value)}
                label="Identity"
                fullWidth
                margin="normal"
                type="number"
                helperText="National ID"
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                id="date"
                label="Birthdate"
                type="date"
                className={classes.textField}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.props.birthDate}
                onChange={event => this.props.handleChange('birthDate', event.target.value)}
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>

              <FormControl fullWidth
                className={classes.textField} margin="normal">
                <InputLabel htmlFor="sex-simple">Sex</InputLabel>
                <Select
                  style={{ textAlign: 'left' }}
                  value={this.props.sex}
                  onChange={event => this.props.handleChange('sex', event.target.value)}
                  inputProps={{name: 'sex', id: 'sex-simple'}}
                >
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                </Select>
              </FormControl>
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="origin"
                disabled={this.props.disabled}
                value={this.props.origin}
                onChange={event => this.props.handleChange('origin', event.target.value)}
                label="Origin"
                margin="normal"
                fullWidth
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="procedence"
                disabled={this.props.disabled}
                value={this.props.procedence}
                onChange={event => this.props.handleChange('procedence', event.target.value)}
                label="Procedence"
                fullWidth
                margin="normal"
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <FormControl fullWidth
                className={classes.textField} margin="normal">
                <InputLabel htmlFor="sex-simple">Education</InputLabel>
                <Select
                  style={{ textAlign: 'left' }}
                  value={this.props.education}
                  onChange={event => this.props.handleChange('education', event.target.value)}
                  inputProps={{name: 'education', id: 'education-simple'}}
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Primary">Primary</MenuItem>
                  <MenuItem value="HighSchool">High School</MenuItem>
                  <MenuItem value="Bachelor">Bachelor Degree</MenuItem>
                  <MenuItem value="Master">Master Degree</MenuItem>
                  <MenuItem value="Doctorate">Doctorate</MenuItem>
                  <MenuItem value="PostDoctorate">Post Doctorate</MenuItem>
                </Select>
              </FormControl>
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="race"
                disabled={this.props.disabled}
                value={this.props.race}
                onChange={event => this.props.handleChange('race', event.target.value)}
                label="Race"
                fullWidth
                margin="normal"
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
                <Autocomplete
                  suggestions={[]}
                  selection={toAutocompleteData(this.props.medicines)}
                  placeholder="Medicines"
                  handleSelect={value => this.props.handleChange('medicines', fromAutocompleteData(value))}
                />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
                <Autocomplete
                  suggestions={pathologicalAutocomplete}
                  selection={toAutocompleteData(this.props.pathologicalPast)}
                  placeholder="Pathological Past"
                  handleSelect={value => this.props.handleChange('pathologicalPast', fromAutocompleteData(value))}
                />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
                <Autocomplete
                  suggestions={familiarAutocomplete}
                  selection={toAutocompleteData(this.props.familiarPast)}
                  placeholder="Familiar Past"
                  handleSelect={value => this.props.handleChange('familiarPast', fromAutocompleteData(value))}
                />
              </Grid>
             </Grid>
             </form>
              <Grid item  lg={12} md={12} sm={12} xs={12} align={'right'}>
                <Button variant="contained" color="primary" className={this.props.button} onClick={this.props.save} >
                  Save
                </Button>
              </Grid>
            </Paper>
          </Grid>
        </Grid>


      </div>
    )
  }
}

export default withStyles(styles)(PatientView);
