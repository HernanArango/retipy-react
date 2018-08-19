import React, { Component } from "react";
import { Configuration as CNF } from "../Configuration";
import PatientView from "./PatientView";
import PleaseLogIn from "../common/PleaseLogIn";

class Patient extends Component
{
    state =
    {
        id: 0,
        identity: 0,
        name: "",
        birthDate: "",
        sex: "Female",
        origin: "",
        procedence: "",
        education: "Primary",
        race: "",
        pathologicalPast: [],
        familiarPast: [],
        medicines: [],
        opticalEvaluations: [],
    }

    handleChange = (key, value) => this.setState({[key]: value});

    updatePatientFromRest = (restPatient) =>
    {
        this.setState(
        {
            id: restPatient.id,
            identity: restPatient.identity,
            name: restPatient.name,
            birthDate: restPatient.birthDate.substring(0, 10),
            sex: restPatient.sex,
            origin: restPatient.origin,
            procedence: restPatient.procedence,
            education: restPatient.education,
            race: restPatient.race,
            pathologicalPast: restPatient.pathologicalPast,
            familiarPast: restPatient.familiarPast,
            medicines: restPatient.medicines,
            opticalEvaluations: restPatient.opticalEvaluations,
        });
    }

    savePatient = () =>
    {
        var message = ""
        if (this.state.id === 0)
        {
            message = "New patient created"
        }
        else
        {
            message = "Patient updated"
        }
        fetch(
            CNF.REST_URL + CNF.PATIENT_ENDPOINT,
            {
                method: 'POST',
                mode: 'cors',
                referrer: 'no-referrer',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'content-type': 'application/json',
                    'Authorization': this.props.token,
                },
                body: JSON.stringify(this.state)
            }
        )
        .then(response =>
            {
                if(!response.ok)
                {
                    throw Error("There was an error saving the current patient");
                }
                return response.json();
            })
        .then(restPatient => {
            this.updatePatientFromRest(restPatient);
            this.props.toast(message);
        })
        .catch(error => this.props.toast(error.message));
    }

    fetchPatient = () =>
    {
        if (this.props.id !== 0 && this.props.token !== "")
        {
            const endpoint = (id) => `${CNF.PATIENT_ENDPOINT}/${id}`;
            fetch(
                CNF.REST_URL + endpoint(this.props.id),
                {
                    method: 'GET',
                    mode: 'cors',
                    referrer: 'no-referrer',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'content-type': 'application/json',
                        'Authorization': this.props.token,
                    }
                })
                .then(response =>
                    {
                        if (!response.ok)
                        {
                            throw Error("Error when retrieving patient");
                        }
                        return response.json();
                    })
                .then(restPatient => this.updatePatientFromRest(restPatient))
                .catch(error => this.props.toast(error.message));
        }
    }
    componentDidMount()
    {
        this.fetchPatient();
    }

    componentDidUpdate(prevProps) {
        if (this.props.token !== prevProps.token)
        {
            this.fetchPatient();
        }
    }

    render()
    {
        if (this.props.token === "")
        {
            return(<PleaseLogIn/>);
        }
        else
        {
        return(
                <PatientView
                    disabled={this.props.disabled}
                    id={this.state.id}
                    identity={this.state.identity}
                    name={this.state.name}
                    birthDate={this.state.birthDate}
                    sex={this.state.sex}
                    origin={this.state.origin}
                    procedence={this.state.procedence}
                    education={this.state.education}
                    race={this.state.race}
                    pathologicalPast={this.state.pathologicalPast}
                    familiarPast={this.state.familiarPast}
                    medicines={this.state.medicines}
                    opticalEvaluations={this.state.opticalEvaluations}
                    handleChange={this.handleChange}
                    save={this.savePatient}
                />
            );
        }
    }
}

export default Patient
