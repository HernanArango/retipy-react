import React, { Component } from "react";
import { Grid, Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem, withStyles } from "@material-ui/core";
import Button from '@material-ui/core/Button';

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
  },
  textField: {
    marginRight: theme.spacing.unit,
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

class ControlledExpansionPanels extends React.Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };
}

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
  };

  constructor(props)
  {
    super(props);
    this.state.id = props.id;
    this.state.disabled = props.disabled;
    const { expanded } = this.state;
  }

  saveHandler(){
    console.log("Guarde");
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
            <Grid container spacing={16} justify={'space-around'}>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="identity"
                disabled={this.state.disabled}
                value={this.state.identity}
                onChange={event => this.setState({identity: event.target.value})}
                label="Documento de identidad"
                fullWidth
                margin="normal"
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                id="date"
                label="Birthday"
                type="date"
                className={classes.textField}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>

              <FormControl fullWidth 
                className={classes.textField} margin="normal">
                <InputLabel htmlFor="sex-simple">Sexo</InputLabel>
                <Select
                  style={{ textAlign: 'left' }}
                  value={this.state.sex}
                  onChange={event => this.setState({ sex: event.target.value })}
                  inputProps={{name: 'sex', id: 'sex-simple'}}

                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
              </FormControl>
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="origin"
                disabled={this.state.disabled}
                value={this.state.origin}
                onChange={event => this.setState({origin: event.target.value})}
                label="Origen"
                margin="normal"
                fullWidth
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="procedence"
                disabled={this.state.disabled}
                value={this.state.procedencia}
                onChange={event => this.setState({procedencia: event.target.value})}
                label="Procedencia"
                fullWidth
                margin="normal"
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="education"
                disabled={this.state.disabled}
                value={this.state.education}
                onChange={event => this.setState({education: event.target.value})}
                label="Educación"
                fullWidth
                margin="normal"
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="race"
                disabled={this.state.disabled}
                value={this.state.race}
                onChange={event => this.setState({race: event.target.value})}
                label="Raza"
                fullWidth
                margin="normal"
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="pathologicalPast"
                disabled={this.state.disabled}
                value={this.state.patologicalPast}
                onChange={event => this.setState({patologicalPast: event.target.value})}
                label="Antecedentes Patologicos"
                fullWidth
                margin="normal"
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="familiarPast"
                disabled={this.state.disabled}
                value={this.state.familiarPast}
                onChange={event => this.setState({familiarPast: event.target.value})}
                label="Antecedentes Familiares"
                fullWidth
                margin="normal"
              />
              </Grid>
              <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                className={classes.textField}
                id="medicines"
                disabled={this.state.disabled}
                value={this.state.medicines}
                onChange={event => this.setState({medicines: event.target.value})}
                label="Medicamentos"
                margin="normal"
                fullWidth
              />
              </Grid>
              <Grid item  lg={12} md={12} sm={12} xs={12} align={'right'}>
                <Button variant="contained" color="primary" className={this.props.button}  onClick={this.saveHandler.bind(this)}>
                  Guardar
                </Button>
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
