import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

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
                algorithms: ["fractal", "density"],
                algorithm: "density",
                block: false

            };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileOnChange = this.fileOnChange.bind(this);
        this.algorithmOnChange = this.algorithmOnChange.bind(this);
        this.toggleBlock = this.toggleBlock.bind(this);
    }

    toggleBlock()
    {
        this.setState({block: true})
    }

    handleSubmit(event)
    {
        event.preventDefault()
        console.log(this.state.file);
        fetch(
            "http://localhost:8080/retipy/evaluation/" + this.state.algorithm,
            {
                method: 'PUT',
                body: this.state.file,
                mode: 'cors',
                headers:
                {
                    'Access-Control-Allow-Origin': '*'
                }
            }).then(response => response.json())
            .then(success => {
                console.log(success)
                this.setState({redirect: true, id: success.id})}) // TODO: we should have a redirect after a successful upload with the created id!
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
            result => this.setState({file:result.substring(result.indexOf(",") + 1)})
        );
    }

    algorithmOnChange(event)
    {
        this.setState({algorithm:event.target.value});
    }

    render()
    {
        var options = [];
        const option= (name, id) =>
            <option key={id} value={name}>{name}</option>;
        for (var i=0; i<this.state.algorithms.length; i++)
        {
            options.push(option(this.state.algorithms[i], this.state.algorithms[i]));
        }
        if (this.state.redirect)
        {
            return(<Redirect to={"/evaluation/" + this.state.id + "/1"}/>)
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
                    Algorithm:
                    <select name="algorithm" onChange={this.algorithmOnChange} value={this.state.algorithm}>
                        {options}
                    </select>
                </label>
                <br/>
                <button onClick={this.toggleBlock} type="submit">Upload</button>
            </form>
            </BlockUi>
            </div>);
        }
    }
}
