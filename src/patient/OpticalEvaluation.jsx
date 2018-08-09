import React, { Component } from "react";
import { withStyles, Grid, Typography, TextField } from "@material-ui/core";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Biomicroscopy from './Biomicroscopy.jsx';

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
    padding: theme.spacing.unit * 2,
    textAlign: 'left',
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
    justify: 'center',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    paddinVertical: theme.spacing.unit * 100,
    width: 200,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});


class OpticalEvaluation extends Component
{
  state =
  {
    id: 0,
    visualLeftEye: "",
    visualRightEye: "",
    visualLeftPh: "",
    visualRightPh: "",
    pupilLeftEyeRD: 0,
    pupilLeftEyeRC: 0,
    pupilLeftEyeDPA: 0,
    pupilRightEyeRD: 0,
    pupilRightEyeRC: 0,
    pupilRightEyeDPA: 0,
    evaluationId: 0,
    exams: [1, 2, 3],
    addDisabled: false,
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  constructor(props)
  {
    super(props);
    this.state.id = props.id;
    this.state.disabled = props.disabled;
  }

  addHandler(){
    console.log("Add optical evaluation");
    //Aqui se deberia añadir un nuevo objeto examen dentro de la variable exams
    this.state.exams.push(1)
    this.setState({addDisabled: true});
  }

  addButton(n){
    if(n === 1){
      return(<Button variant="contained" color="primary" className={this.props.button}  onClick={this.saveHandler.bind(this)}>
        Guardar
      </Button>);
    }
    else{
      return null;
    }
  }

  disabled(n){
    if(n === 1){
      return false;
    }
    else{
      return true;
    }
  }

  saveHandler(){
    this.setState({addDisabled: false});
    console.log("Save optical evaluation");
  }

  loadEvaluations(){
    const { classes } = this.props;
    var n = this.state.exams.length;
    var result = []
    for (var i = 0; i < n; i++) {
       result.push(<ExpansionPanel key={i}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Exam {i+1} - Date here</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
         <Grid container spacing={16} justify={'space-around'}>
            <Grid item  lg={12} md={12} sm={12} xs={12}>
              <Typography variant="display1">Visual Acuity</Typography>
            </Grid>
            <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                id="OD"
                disabled={this.disabled(n-i)}
                placeholder="20/20"
                helperText="Visual acuity of the right eye"
                value={this.state.visualRightEye}
                onChange={event => this.setState({identity: event.target.value})}
                label="RE"
                fullWidth
              />
            </Grid>
            <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                id="ODPH"
                disabled={this.disabled(n-i)}
                placeholder="20/20"
                helperText="PH del ojo derecho"
                value={this.state.visualRightPh}
                onChange={event => this.setState({identity: event.target.value})}
                label="OD - PH"
                fullWidth
              />
            </Grid>
            <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                id="OI"
                disabled={this.disabled(n-i)}
                placeholder="20/20"
                helperText="Agudeza visual del ojo izquierdo"
                value={this.state.visualLeftEye}
                onChange={event => this.setState({identity: event.target.value})}
                label="OI"
                fullWidth
              />
            </Grid>
            <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                id="OIPH"
                disabled={this.disabled(n-i)}
                placeholder="20/20"
                helperText="PH del ojo izquierdo"
                value={this.state.visualLeftPh}
                onChange={event => this.setState({identity: event.target.value})}
                label="OI - PH"
                fullWidth
              />
            </Grid>
            <Grid item  lg={12} md={12} sm={12} xs={12}>
              <Typography variant="display1">Valoración de Pupilas</Typography>
             </Grid>
            <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                id="PDRD"
                disabled={this.disabled(n-i)}
                placeholder="1+"
                helperText="Pupila derecha - RD"
                value={this.state.pupilRightEyeRD}
                onChange={event => this.setState({identity: event.target.value})}
                label="PD - RD"
                fullWidth
              />
            </Grid>
            <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                id="PDRC"
                disabled={this.disabled(n-i)}
                placeholder="1+"
                helperText="Pupila derecha - RC"
                value={this.state.pupilRightEyeRC}
                onChange={event => this.setState({identity: event.target.value})}
                label="PD - RC"
                fullWidth
              />
            </Grid>
            <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                id="PDDPA"
                disabled={this.disabled(n-i)}
                placeholder="1+"
                helperText="Pupila derecha - DPA"
                value={this.state.pupilRightEyeDPA}
                onChange={event => this.setState({identity: event.target.value})}
                label="PD - DPA"
                fullWidth
              />
            </Grid>
            <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                id="PIRD"
                disabled={this.disabled(n-i)}
                placeholder="1+"
                helperText="Pupila izquierda - RD"
                value={this.state.pupilLeftEyeRD}
                onChange={event => this.setState({identity: event.target.value})}
                label="PI - RD"
                fullWidth
              />
            </Grid>
            <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                id="PIRC"
                disabled={this.disabled(n-i)}
                placeholder="1+"
                helperText="Pupila izquierda - RC"
                value={this.state.pupilLeftEyeRC}
                onChange={event => this.setState({identity: event.target.value})}
                label="PI - RC"
                fullWidth
              />
            </Grid>
            <Grid item  lg={5} md={5} sm={12} xs={12}>
              <TextField
                required
                id="PIDPA"
                disabled={this.disabled(n-i)}
                placeholder="1+"
                helperText="Pupila izquierda - DPA"
                value={this.state.pupilLeftEyeDPA}
                onChange={event => this.setState({identity: event.target.value})}
                label="PI - DPA"
                fullWidth
              />
            </Grid>
            <Grid item  lg={12} md={12} sm={12} xs={12}>
              <Typography variant="display1">Biomicroscopia</Typography>
            </Grid>
            <Grid item lg={11} md={11} sm={12} xs={12}>
              <Biomicroscopy disabled={n-i}/>
            </Grid>
            <Grid item  lg={12} md={12} sm={12} xs={12} align={'right'}>
              {this.addButton(n-i)}
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>);
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
            <Typography variant="display1" className={classes.title}>Optical Evaluation Data</Typography>
            {this.loadEvaluations()}
          </Grid>
          <Grid item  lg={8} md={10} sm={12} xs={12} align={'right'}>
            <Button variant="fab" color="primary" aria-label="Add" className={classes.button} onClick={this.addHandler.bind(this)} disabled={this.state.addDisabled}>
            <AddIcon />
          </Button>
        </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(OpticalEvaluation);
