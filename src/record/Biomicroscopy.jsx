import React, { Component } from "react";
import { Grid, TextField, withStyles, Button} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

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
    width: 225,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

class Biomicroscopy extends Component
{
  state =
  {
    id: 0,
    editable: false,
    cornea: "",
    iris: "",
    cristalino: "",
    camaraAnterior: "",
    observaciones: "",
    nombre:"",
    componentesArbitrarios: []
  };

  constructor(props)
  {
    super(props);
    this.state.id = props.id;
    this.state.disabled = props.disabled;
  }

  handleAddField(name){
    var arbitraryComponents = this.state.componentesArbitrarios.slice();
    arbitraryComponents.push([name,""]);
    console.log(arbitraryComponents);
    this.setState({
      nombre: "",
      componentesArbitrarios: arbitraryComponents
    });
  }

  onChangeText(text, name){
    var arbitraryComponents = this.state.componentesArbitrarios.slice();
    for (var i = 0; i < arbitraryComponents.length; i++) {
      if(arbitraryComponents[i][0] === name){
        arbitraryComponents[i][1] = text;
      }
    }
    this.setState({
      componentesArbitrarios: arbitraryComponents
    });
  }

  loadFields() {
    var resultComponents = [];
    var arbitraryComponents = this.state.componentesArbitrarios.slice();
    for (var i = 0; i < arbitraryComponents.length; i++) {
      resultComponents.push(<TextField key={i}
                                id={arbitraryComponents[i][0]}
                                disabled={this.disabled(this.props.disabled)}
                                label={arbitraryComponents[i][0]}
                                value={arbitraryComponents[i][1]}
                                onChange={event => this.onChangeText(event.target.value, event.target.id)}
                                fullWidth
                              />
                            );
    }
    return(resultComponents);
  }

  disabled(n){
    if(n === 1){
      return false;
    }
    else{
      return true;
    }
  }
  
  render()
  {
    const { classes } = this.props;
    return(
        <Grid container>
          <Grid container spacing={16} justify={'space-around'} >
            <Grid item lg={10} md={10} sm={10} xs={8}>
              <TextField
                id="nombre"
                disabled={this.disabled(this.props.disabled)}
                value={this.state.nombre}
                onChange={event => this.setState({nombre: event.target.value})}
                helperText="Agregar un nuevo campo"
                label="Nombre"
                fullWidth
              />
            </Grid>
            <Grid item  lg={2} md={2} sm={2} xs={4}>
              <Button variant="fab" color="primary" aria-label="Add" disabled={this.disabled(this.props.disabled)}
              className={classes.button} onClick={this.handleAddField.bind(this, this.state.nombre)}>
                <AddIcon />
              </Button>
            </Grid>
          </Grid>
          <TextField
            id="cornea"
            disabled={this.disabled(this.props.disabled)}
            placeholder="Cornea"
            value={this.state.cornea}
            onChange={event => this.setState({cornea: event.target.value})}
            label="Cornea"
            fullWidth
          />
          <TextField
            id="iris"
            disabled={this.disabled(this.props.disabled)}
            placeholder="Iris"
            value={this.state.iris}
            onChange={event => this.setState({iris: event.target.value})}
            label="Iris"
            fullWidth
          />
          <TextField
            id="cristalino"
            disabled={this.disabled(this.props.disabled)}
            placeholder="Cristalino"
            value={this.state.cristalino}
            onChange={event => this.setState({cristalino: event.target.value})}
            label="Cristalino"
            fullWidth
          />
          <TextField
            id="camaraAnterior"
            disabled={this.disabled(this.props.disabled)}
            placeholder="Camara Anterior"
            value={this.state.camaraAnterior}
            onChange={event => this.setState({camaraAnterior: event.target.value})}
            label="Camara Anterior"
            fullWidth
          />
          {this.loadFields()}
          <TextField
            id="observaciones"
            disabled={this.disabled(this.props.disabled)}
            value={this.state.observaciones}
            onChange={event => this.setState({observaciones: event.target.value})}
            label="Observaciones"
            multiline
            fullWidth
          />
        </Grid>
    )
  }
}

export default withStyles(styles)(Biomicroscopy);
