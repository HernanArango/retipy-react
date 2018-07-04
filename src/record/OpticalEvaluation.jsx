import React, { Component } from "react";
import { withStyles, Grid, Paper, Typography, TextField } from "@material-ui/core";

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
   margin: theme.spacing.unit,
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
    biomicroscopy: "",
    PIO: "",
    evaluationId: 0,
  }

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
            <Typography variant="display1">Optical Evaluation Data</Typography>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="display2">Agudeza Visual</Typography>
                  <TextField
                    className={classes.textField}
                    required
                    id="OD"
                    disabled={this.state.disabled}
                    placeholder="20/20"
                    helperText="Agudeza visual del ojo derecho"
                    value={this.state.visualRightEye}
                    onChange={event => this.setState({identity: event.target.value})}
                    label="OD"
                  />
                  <TextField
                    className={classes.textField}
                    required
                    id="ODPH"
                    disabled={this.state.disabled}
                    placeholder="20/20"
                    helperText="PH del ojo derecho"
                    value={this.state.visualRightPh}
                    onChange={event => this.setState({identity: event.target.value})}
                    label="OD - PH"
                  />
                  <TextField
                    className={classes.textField}
                    required
                    id="OI"
                    disabled={this.state.disabled}
                    placeholder="20/20"
                    helperText="Agudeza visual del ojo izquierdo"
                    value={this.state.visualLeftEye}
                    onChange={event => this.setState({identity: event.target.value})}
                    label="OI"
                  />
                  <TextField
                    className={classes.textField}
                    required
                    id="OIPH"
                    disabled={this.state.disabled}
                    placeholder="20/20"
                    helperText="PH del ojo izquierdo"
                    value={this.state.visualLeftPh}
                    onChange={event => this.setState({identity: event.target.value})}
                    label="OI - PH"
                  />
                </Grid>
                <Grid item xs={8}>
                <Typography variant="display2">Valoración de Pupilas</Typography>
                  <TextField
                    className={classes.textField}
                    required
                    id="PDRD"
                    disabled={this.state.disabled}
                    placeholder="1+"
                    helperText="Pupila derecha - RD"
                    value={this.state.pupilRightEyeRD}
                    onChange={event => this.setState({identity: event.target.value})}
                    label="PD - RD"
                  />
                  <TextField
                    className={classes.textField}
                    required
                    id="PDRC"
                    disabled={this.state.disabled}
                    placeholder="1+"
                    helperText="Pupila derecha - RC"
                    value={this.state.pupilRightEyeRC}
                    onChange={event => this.setState({identity: event.target.value})}
                    label="PD - RC"
                  />
                  <TextField
                    className={classes.textField}
                    required
                    id="PDDPA"
                    disabled={this.state.disabled}
                    placeholder="1+"
                    helperText="Pupila derecha - DPA"
                    value={this.state.pupilRightEyeDPA}
                    onChange={event => this.setState({identity: event.target.value})}
                    label="PD - DPA"
                  />
                  <TextField
                    className={classes.textField}
                    required
                    id="PIRD"
                    disabled={this.state.disabled}
                    placeholder="1+"
                    helperText="Pupila izquierda - RD"
                    value={this.state.pupilLeftEyeRD}
                    onChange={event => this.setState({identity: event.target.value})}
                    label="PI - RD"
                  />
                  <TextField
                    className={classes.textField}
                    required
                    id="PIRC"
                    disabled={this.state.disabled}
                    placeholder="1+"
                    helperText="Pupila izquierda - RC"
                    value={this.state.pupilLeftEyeRC}
                    onChange={event => this.setState({identity: event.target.value})}
                    label="PI - RC"
                  />
                  <TextField
                    className={classes.textField}
                    required
                    id="PIDPA"
                    disabled={this.state.disabled}
                    placeholder="1+"
                    helperText="Pupila izquierda - DPA"
                    value={this.state.pupilLeftEyeDPA}
                    onChange={event => this.setState({identity: event.target.value})}
                    label="PI - DPA"
                  />
                </Grid>
              </Grid>
              <TextField
                required
                id="biomicroscopy"
                disabled={this.state.disabled}
                placeholder="some text here"
                helperText="Biomicroscopia"
                value={this.state.biomicroscopy}
                onChange={event => this.setState({identity: event.target.value})}
                label="Biomicroscopia"
                fullWidth
              />
              <TextField
                required
                id="PIO"
                disabled={this.state.disabled}
                placeholder="some text here"
                helperText="PIO"
                value={this.state.PIO}
                onChange={event => this.setState({identity: event.target.value})}
                label="PIO"
                fullWidth
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(OpticalEvaluation);
