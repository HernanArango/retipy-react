import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { Configuration as CNF } from './Configuration.js';

export default class UploadImage extends Component
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
    this.setState({block: true})
  }

  handleSubmit(event)
  {
    event.preventDefault()
    console.log(this.state.file);
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
    this.getBase64(event.target.files[0]).then(
      result => this.setState({ file: result.substring(result.indexOf(",") + 1) })
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
    var algorithmOptions = [];
    const createOption= (name, id) =>
      <option key={ id } value={ name }>{ name }</option>;
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
      <div>
      <BlockUi tag="div" blocking={this.state.block}>
      <form onSubmit={this.handleSubmit}>
        <label>
          Image:
          <input type="file" onChange={this.fileOnChange}/>
        </label>
        <label>
          Service:
          <select name="service" onChange={this.serviceOnChange} value={this.state.service}>
           {serviceOptions}
          </select>
        </label>
        {this.state.service === CNF.SERVICES.evaluation &&
        <label>
          Algorithm:
          <select
            name="algorithm"
            onChange={this.algorithmOnChange}
            value={this.state.algorithm}>
            {algorithmOptions}
          </select>
        </label>
        }
        <br/>
        <button onClick={this.toggleBlock} type="submit">Upload</button>
      </form>
      </BlockUi>
      </div>);
    }
  }
}
