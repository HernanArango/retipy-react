import * as React from "react";
import { IAuthProps } from "../common/IAuthProps";
import { Endpoints, RetipyObjects } from "../configuration/Endpoints";
import OpticalEvaluationView from "./OpticalEvaluationView";
import { IOpticalEvaluation } from "./Patient";

const cornea = 'Cornea';
const iris = 'Iris';
const cristalino = 'Cristalino';
const camaraAnterior = 'Camara Anterior'

function getDefaultBiomicroscopy() {
    const biomicroscopy = new Map<string, string>();
    biomicroscopy[cornea] = "";
    biomicroscopy[iris] = "";
    biomicroscopy[cristalino] = "";
    biomicroscopy[camaraAnterior] = "";

    return biomicroscopy;
}

interface IOpticalEvaluationProps extends IAuthProps {
    disabled: boolean,
    handleChange: (property: string, value: any) => void,
    patientId: number,
    id: number,
    history: any,
}

interface IOpticalEvaluationState extends IOpticalEvaluation {
    newBiomicroscopyFieldName: string,
}

class OpticalEvaluation extends React.Component<IOpticalEvaluationProps, IOpticalEvaluationState> {
    constructor(props: IOpticalEvaluationProps) {
        super(props);

        this.state = {
            biomicroscopy: getDefaultBiomicroscopy(),
            creationDate: "",
            diagnostics: [],
            id: this.props.id,
            intraocularPressure: "",
            newBiomicroscopyFieldName: "",
            pupilLeftEyeDPA: 0,
            pupilLeftEyeRC: 0,
            pupilLeftEyeRD: 0,
            pupilRightEyeDPA: 0,
            pupilRightEyeRC: 0,
            pupilRightEyeRD: 0,
            updateDate: "",
            version: 1,
            visualLeftEye: "",
            visualLeftPh: "",
            visualRightEye: "",
            visualRightPh: "",
        }

        if (props.id !== 0 && props.patientId !== 0) {
            this.fetchOpticalEvaluation();
        }
    }

    public render() {
        return (
            <OpticalEvaluationView
                key={this.state.id}
                biomicroscopy={this.state.biomicroscopy}
                creationDate={this.state.creationDate}
                disabled={this.props.disabled}
                diagnostics={this.state.diagnostics}
                id={this.state.id}
                intraocularPressure={this.state.intraocularPressure}
                patientId={this.props.patientId}
                pupilLeftEyeDPA={this.state.pupilLeftEyeDPA}
                pupilLeftEyeRC={this.state.pupilLeftEyeRC}
                pupilLeftEyeRD={this.state.pupilLeftEyeRD}
                pupilRightEyeDPA={this.state.pupilRightEyeDPA}
                pupilRightEyeRC={this.state.pupilRightEyeRC}
                pupilRightEyeRD={this.state.pupilRightEyeRD}
                updateDate={this.state.updateDate}
                version={this.state.version}
                visualLeftEye={this.state.visualLeftEye}
                visualLeftPh={this.state.visualLeftPh}
                visualRightEye={this.state.visualRightEye}
                visualRightPh={this.state.visualRightPh}
                handleChange={this.handleChange}
                handleSave={this.saveOpticalEvaluation}
                toast={this.props.toast}
                token={this.props.token}
            />
        );
    }

    private fetchOpticalEvaluation = () => {
        if (this.props.id !== 0 && this.props.token !== "") {
            fetch(
                Endpoints.Server + Endpoints.OpticalEvaluation + `/${this.props.id}`,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': this.props.token,
                        'content-type': 'application/json',
                    },
                    method: 'GET',
                    mode: 'cors',
                    referrer: 'no-referrer',
                })
                .then(response => {
                    if (!response.ok) {
                        throw Error("Error when retrieving OpticalEvaluation");
                    }
                    return response.json();
                })
                .then(restOpticalEvaluation => this.updateOpticalEvaluation(restOpticalEvaluation))
                .catch(error => this.props.toast(error.message));
        }
    }

    private handleChange = <T extends string>(key: keyof IOpticalEvaluation, value: T) => {
        this.setState({
            ...this.state,
            [key]: value
        })
    };

    private saveOpticalEvaluation = () => {
        let message = "";
        if (this.state.id === 0)
        {
            message = "New Optical Evaluation created";
        }
        else
        {
            message = "Optical Evaluation updated";
        }
        fetch(
            Endpoints.Server + Endpoints.Patient + `/${this.props.patientId}` + RetipyObjects.OpticalEvaluation,
            {
                body: JSON.stringify(this.state),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': this.props.token,
                    'content-type': 'application/json',
                },
                method: 'POST',
                mode: 'cors',
                referrer: 'no-referrer',
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
        .then(restOpticalEvaluation => {
            this.props.toast(message);
            this.updateOpticalEvaluation(restOpticalEvaluation);
            this.props.history.push(`/patient/${this.props.patientId}/opticalevaluation/${restOpticalEvaluation.id}`);
        })
        .catch(error => this.props.toast(error.message));
    };

    private updateOpticalEvaluation = (restOpticalEvaluation: IOpticalEvaluation) => {
        this.setState({
            biomicroscopy: restOpticalEvaluation.biomicroscopy,
            creationDate: restOpticalEvaluation.creationDate,
            diagnostics: restOpticalEvaluation.diagnostics,
            id: restOpticalEvaluation.id,
            intraocularPressure: restOpticalEvaluation.intraocularPressure,
            pupilLeftEyeDPA: restOpticalEvaluation.pupilLeftEyeDPA,
            pupilLeftEyeRC: restOpticalEvaluation.pupilLeftEyeRC,
            pupilLeftEyeRD: restOpticalEvaluation.pupilLeftEyeRD,
            pupilRightEyeDPA: restOpticalEvaluation.pupilRightEyeDPA,
            pupilRightEyeRC: restOpticalEvaluation.pupilRightEyeRC,
            pupilRightEyeRD: restOpticalEvaluation.pupilRightEyeRD,
            updateDate: restOpticalEvaluation.updateDate,
            version: restOpticalEvaluation.version,
            visualLeftEye: restOpticalEvaluation.visualLeftEye,
            visualLeftPh: restOpticalEvaluation.visualLeftPh,
            visualRightEye: restOpticalEvaluation.visualRightEye,
            visualRightPh: restOpticalEvaluation.visualRightPh,
        });
    }
}

export default OpticalEvaluation;
