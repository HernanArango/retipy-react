import React, { Component } from "react";
import { Configuration as CNF } from "../Configuration";
import BlockUi from 'react-block-ui';
import Demography from "./Demography";

const fetchPatient = (id) =>
    {
        var patient
        if (id === 0)
        {
            patient = {id: 0};
        }
        else
        {
            patient = fetch(CNF.REST_URL + `${CNF.PATIENT_ENDPOINT}/${id}`, {
                method: 'GET',
                mode: 'cors',
                referrer: 'no-referrer',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'content-type': 'application/json'
                }})
                .then(response => response.json())
                .catch()
        }
        return patient;
    }


class Patient extends Component
{
    componentDidMount()
    {
        fetchPatient(this.props.id).then(patient => this.setState({ patient }))
    }

    render()
    {
        const { patient } = this.state;
        return(
            <Demography patient={patient} />
        );
    }
}

export default Patient
