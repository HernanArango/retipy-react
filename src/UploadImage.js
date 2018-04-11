import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

export default class UploadImage extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {redirect: false, id: 0};

        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event)
    {
        console.log(this.state.image)
        alert(`An image was submitted: this.uploadImage.files[0].name`);
        var reader = new FileReader();
        reader.readAsDataURL(this.uploadImage.files[0])
        var image = reader.result
        fetch(
            "http://localhost:8080/retipy/evaluation",
            {
                method: 'PUT',
                body: image,
                mode: 'cors',
                referrer: 'no-referrer',
                headers:
                {
                    'Access-Control-Allow-Origin': '*',
                    'content-type': 'text/plain'
                }
            }).then(response => response.json())
            .then(data => {

            })
    }

    render()
    {
        const { redirect, id } = this.state;
        if (redirect)
        {
            return <Redirect to={`evaluation/${id}`} />
        }
        else
        {
            return(
                <form>
                    <label>
                        Image:
                        <input type="file" ref={input => {this.uploadImage = input}} />
                    </label>
                    <button type="submit">Upload</button>
                </form>);
        }
    }
}
