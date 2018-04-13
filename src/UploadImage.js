import React, { Component } from "react";

export default class UploadImage extends Component
{
    constructor(props)
    {
        super(props);
        this.state =
            {
                redirect: false,
                id: 0,
                file: null
            };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    handleSubmit(event)
    {
        event.preventDefault()
        console.log(this.state.file);
        fetch(
            "http://localhost:8080/retipy/evaluation",
            {
                method: 'PUT',
                body: this.state.file,
                mode: 'cors',
                headers:
                {
                    'Access-Control-Allow-Origin': '*'
                }
            }).then(response => response.json())
            .then(success => console.log(success)) // TODO: we should have a redirect after a successful upload with the created id!
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

    onChange(event)
    {
        this.getBase64(event.target.files[0]).then(
            result => this.setState({file:result.substring(result.indexOf(",") + 1)})
        );
    }

    render()
    {
            return(
                <form onSubmit={this.handleSubmit} >
                    <label>
                        Image:
                        <input type="file" onChange={this.onChange} />
                    </label>
                    <button type="submit">Upload</button>
                </form>);
    }
}
