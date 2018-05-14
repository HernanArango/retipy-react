import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { Configuration as CNF } from './Configuration.js';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { Typography, Divider } from "@material-ui/core";

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class UploadImage extends Component
{
  constructor(props)
  {
    super(props);
    this.state =
      {
        redirect: false,
        id: 0,
        file: null,
        service: CNF.SERVICES.evaluation,
        algorithm: CNF.EVALUATION_ALGORITHMS.density,
        block: false
      };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileOnChange = this.fileOnChange.bind(this);
    this.algorithmOnChange = this.algorithmOnChange.bind(this);
    this.toggleBlock = this.toggleBlock.bind(this);
    this.serviceOnChange = this.serviceOnChange.bind(this);
  }

  toggleBlock()
  {
    this.setState({block: !this.state.block})
  }

  handleSubmit(event)
  {
    event.preventDefault();
    this.toggleBlock();
    var url;
    if (this.state.service === CNF.SERVICES.evaluation)
    {
      url = CNF.REST_URL + CNF.EVALUATION_ENDPOINT + "/" + this.state.algorithm;
    }
    else
    {
      url = CNF.REST_URL + CNF.DIAGNOSTIC_ENDPOINT + "/image";
    }
    fetch(
      url,
      {
        method: 'POST',
        body: this.state.file,
        mode: 'cors',
        headers:
        {
          'Access-Control-Allow-Origin': '*'
        }
      }).then(response => response.json())
      .then(success => {
        console.log(success)
        this.setState({ redirect: true, id: success.id })}) // TODO: we should have a redirect after a successful upload with the created id!
      .catch(error => console.log(error)); // TODO: add better error handling
  }

  getBase64(file, onLoadCallback) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  fileOnChange(event)
  {
    this.setState({filename: event.target.files[0].name});
    this.getBase64(event.target.files[0]).then(
      result => this.setState(
        {
          file: result.substring(result.indexOf(",") + 1)
        })
    );
  }

  algorithmOnChange(event)
  {
    this.setState({ algorithm: event.target.value });
  }

  serviceOnChange(event)
  {
    this.setState({ service: event.target.value });
  }

  render()
  {
    const { classes } = this.props;
    var algorithmOptions = [];
    const createOption= (name, id) =>
      <FormControlLabel key={id} value={name} control={<Radio />} label={name}/> ;
    for (var key in CNF.EVALUATION_ALGORITHMS)
    {
      algorithmOptions.push(
        createOption(CNF.EVALUATION_ALGORITHMS[key], CNF.EVALUATION_ALGORITHMS[key]));
    }
    var serviceOptions = []
    for (key in CNF.SERVICES)
    {
      serviceOptions.push(
        createOption(CNF.SERVICES[key], CNF.SERVICES[key]));
    }
    if (this.state.redirect)
    {
      if (this.state.service === CNF.SERVICES.evaluation)
        return(<Redirect to={`/${CNF.SERVICES.evaluation}/` + this.state.id + "/1"}/>);
      else
        return(<Redirect to={`/${CNF.SERVICES.diagnostic}/` + this.state.id}/>);
    }
    else
    {
    return(
      <div className={classes.root}>
      <BlockUi tag="div" blocking={this.state.block}>
      <form onSubmit={this.handleSubmit}>
      <FormControl
        component="fieldset"
        required
        className={classes.formControl}
        onSubmit={this.handleSubmit}
      >
        <Paper className={classes.paper}>
          <FormLabel component="legend">Choose an image</FormLabel>
            <Input
              id="file"
              type="file"
              onChange={this.fileOnChange}
              style={{
                width: 0,
                height: 0,
                opacity: 0,
                overflow: 'hidden',
                position: 'absolute',
                zIndex: 1,
              }}
            />
            <Button component="label" htmlFor="file">
              Open
            </Button>
            {this.state.filename != null &&
            <Typography>{this.state.filename}</Typography>
            }
          <Divider light />
          <FormLabel component="legend">Service</FormLabel>
          <RadioGroup
            aria-label="service"
            name="service1"
            className={classes.group}
            value={this.state.service}
            onChange={this.serviceOnChange}
          >
            {serviceOptions}
          </RadioGroup>
        {this.state.service === CNF.SERVICES.evaluation &&
        <Paper className={classes.paper}>
          <FormLabel component="legend">Algorithm</FormLabel>
          <RadioGroup
            aria-label="evaluation algorithms"
            name="evalalgorithms1"
            className={classes.group}
            value={this.state.algorithm}
            onChange={this.algorithmOnChange}
          >
            {algorithmOptions}
          </RadioGroup>
        </Paper>}
        <br/>
        <Button
          type="submit"
          variant="raised"
          color="primary"
        >
          Upload
        </Button>
        </Paper>
      </FormControl>
      </form>
      </BlockUi>
      </div>);
    }
  }
}

export default withStyles(styles)(UploadImage);
