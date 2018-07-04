import React, { Component } from "react";
import { Grid, Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem, withStyles } from "@material-ui/core";

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  roiButton: {
    margin: theme.spacing.unit / 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

const patologicalAutocomplete = [
  { label: 'Hipertension Arterial'},
  { label: 'Diabetes Mellitus'},
  { label: 'Arterioesclerosis'},
  { label: 'Enfermedad Autoinmune'},
  { label: 'Dislipidemia'},
  { label: 'Nefropatía'},
];

const familiarAutocomplete = [
  { label: 'Demencia'},
  { label: 'Enfermedad Mental'},
  { label: 'Hipertensión Arterial'},
  { label: 'Diabetes Mellitus'},
  { label: 'Arterioescleroris'},
  { label: 'Enfermedad Autoinmune'},
  { label: 'Dislipidemia'},
  { label: 'Nefropatía'},
];

class Demography extends Component
{
  state =
  {
    id: 0,
    editable: false,
    identity: "",
    name: "",
    age: 0,
    sex: "",
    origin: "",
    procedencia: "",
    education: "",
    race: "",
    patologicalPast: [],
    familiarPast: [],
    medicines: [],
  };

  constructor(props)
  {
    super(props);
    this.state.id = props.id;
    this.state.disabled = props.disabled;
  }

  render()
  {
    const { classes } = this.props;
    return(
      <div className={classes.root}>
        <Grid container spacing={16} className={classes.container}>
          <Grid item xs={12}>
            <Typography variant="display1">Demographic Data</Typography>
            <Paper className={classes.paper}>
              <TextField
                required
                id="identity"
                disabled={this.state.disabled}
                placeholder="123456789"
                helperText="eg. # de Cédula"
                value={this.state.identity}
                onChange={event => this.setState({identity: event.target.value})}
                label="Identity"
                fullWidth
              />
              <TextField
                required
                id="age"
                disabled={this.state.disabled}
                placeholder="18"
                helperText="Edad"
                value={this.state.age}
                onChange={event => this.setState({age: event.target.value})}
                label="Age"
                fullWidth
              />
              <FormControl>
                <InputLabel htmlFor="sex-simple">Sex</InputLabel>
                <Select
                  value={this.state.sex}
                  onChange={event => this.setState({ sex: event.target.value })}
                  inputProps={{name: 'sex', id: 'sex-simple'}}
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                id="origin"
                disabled={this.state.disabled}
                placeholder="Origin"
                helperText="Origen"
                value={this.state.origin}
                onChange={event => this.setState({origin: event.target.value})}
                label="Origin"
                fullWidth
              />
              <TextField
                required
                id="procedence"
                disabled={this.state.disabled}
                placeholder="Procedencia"
                helperText="Procedencia"
                value={this.state.procedencia}
                onChange={event => this.setState({procedencia: event.target.value})}
                label="Procedencia"
                fullWidth
              />
              <TextField
                required
                id="education"
                disabled={this.state.disabled}
                placeholder="Education"
                helperText="Escolaridad"
                value={this.state.education}
                onChange={event => this.setState({education: event.target.value})}
                label="Education"
                fullWidth
              />
              <TextField
                required
                id="race"
                disabled={this.state.disabled}
                placeholder="Race"
                helperText="Patient Race"
                value={this.state.race}
                onChange={event => this.setState({race: event.target.value})}
                label="Raza"
                fullWidth
              />
              <TextField
                required
                id="pathologicalPast"
                disabled={this.state.disabled}
                placeholder="Antecedentes Patologicos"
                helperText="Antecedentes Patologicos"
                value={this.state.patologicalPast}
                onChange={event => this.setState({patologicalPast: event.target.value})}
                label="Antecedentes Patologicos"
                fullWidth
              />
              <TextField
                required
                id="familiarPast"
                disabled={this.state.disabled}
                placeholder="Antecedentes Familiares"
                helperText="Antecedentes Familiares"
                value={this.state.familiarPast}
                onChange={event => this.setState({familiarPast: event.target.value})}
                label="Antecedentes Familiares"
                fullWidth
              />
              <TextField
                required
                id="medicines"
                disabled={this.state.disabled}
                placeholder="Medicamentos"
                helperText="Medicamentos"
                value={this.state.medicines}
                onChange={event => this.setState({medicines: event.target.value})}
                label="Medicamentos"
                fullWidth
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Demography);
