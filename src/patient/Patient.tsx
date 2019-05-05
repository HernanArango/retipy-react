import * as React from "react";
import { Education } from "../common/Education";
import { IAuthProps } from "../common/IAuthProps";
import { IPerson } from "../common/IPerson";
import { Sex } from "../common/Sex";
import { Endpoints, RetipyObjects } from "../configuration/Endpoints";
import PatientView from "./PatientView";

export interface IOpticalEvaluation {
    biomicroscopy: Map<string, string>,
    creationDate: string,
    diagnostics: number[],
    id: number,
    intraocularPressure: string,
    pupilLeftEyeDPA: number,
    pupilLeftEyeRC: number,
    pupilLeftEyeRD: number,
    pupilRightEyeDPA: number,
    pupilRightEyeRC: number,
    pupilRightEyeRD: number,
    updateDate: string,
    version: number,
    visualLeftEye: string,
    visualLeftPh: string,
    visualRightEye: string,
    visualRightPh: string,
}

export interface IPatient {
    assignedDoctors: IPerson[],
    birthDate: string,
    education: Education,
    familiarPast: string[],
    id: number,
    identity: string,
    isRedirect: boolean,
    medicines: string[],
    name: string,
    opticalEvaluations: IOpticalEvaluation[],
    origin: string,
    pathologicalPast: string[],
    procedence: string,
    race: string,
    redirect: string,
    sex: Sex,
}

interface IPatientState extends IPatient {
    doctors: Map<number, IPerson>,
}

interface IPatientProps extends IAuthProps {
    id: number,
    disabled: boolean,
    history: any,
}

class Patient extends React.Component<IPatientProps, IPatientState> {
    constructor(props: IPatientProps) {
        super(props);

        this.state = {
            assignedDoctors: [],
            birthDate: new Date().toJSON().slice(0,10),
            doctors: new Map(),
            education: Education.None,
            familiarPast: [],
            id: props.id,
            identity: "",
            isRedirect: false,
            medicines: [],
            name: "",
            opticalEvaluations: [],
            origin: "",
            pathologicalPast: [],
            procedence: "",
            race: "",
            redirect: "",
            sex: Sex.Female,
        }

        fetch(
            Endpoints.Server + Endpoints.Staff + RetipyObjects.Doctor,
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
            .then(response => response.json())

            .then(response => {
                if (response.status === 400) {
                    this.props.toast(response.message);
                    this.setState({ doctors: new Map() });
                }
                else {
                    const doctorMap = new Map();
                    for (const doctor of response) {
                        doctorMap.set(doctor.id, doctor);
                    }
                    this.setState({ doctors: doctorMap });
                }
            });

        if (props.id !== 0) {
            this.fetchPatient();
        }
    }

    public render() {
        return (
            <PatientView
                assignedDoctors={this.state.assignedDoctors}
                birthDate={this.state.birthDate}
                disabled={this.props.disabled}
                doctors={this.state.doctors}
                education={this.state.education}
                familiarPast={this.state.familiarPast}
                id={this.state.id}
                identity={this.state.identity}
                medicines={this.state.medicines}
                name={this.state.name}
                opticalEvaluations={this.state.opticalEvaluations}
                origin={this.state.origin}
                pathologicalPast={this.state.pathologicalPast}
                procedence={this.state.procedence}
                race={this.state.race}
                sex={this.state.sex}
                handleChange={this.handleChange}
                handleSave={this.savePatient}
                handleOpenOpticalEvaluation={this.handleOpenOpticalEvaluation}
                isRedirect={this.state.isRedirect}
                redirect={this.state.redirect}
            />
        );
    }

    private handleChange = <T extends string>(key: keyof IPatient, value: T) => {
        this.setState({
            ...this.state,
            [key]: value
        })
    };

    private handleOpenOpticalEvaluation = (target: number) => (event: any) => {
        if (this.props.id === 0) {
            this.props.toast("Please save the Patient before creating an Optical Evaluation");
        }
        else {
            this.setState({
                isRedirect: true,
                redirect: `/patient/${this.props.id}/opticalEvaluation/${target}`,
            });
        }
    }

    private fetchPatient = () => {
        if (this.props.id !== 0 && this.props.token !== "") {
            fetch(
                Endpoints.Server + Endpoints.Patient + `/${this.props.id}`,
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
                    return response.json();
                })
                .then(response => {
                    if (response.status === 400) {
                        this.props.toast(response.message);
                    }
                    else {
                        this.updatePatient(response);
                    }
                });
        }
    }

    private savePatient = () => {
        let message = "";
        if (this.state.id === 0) {
            message = "New patient created";
        }
        else {
            message = "Patient updated";
        }
        fetch(
            Endpoints.Server + Endpoints.Patient,
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
            .then(response => {
                return response.json();
            })
            .then((response:any)  => {
                if (response.status === 400) {
                    this.props.toast(response.message);
                }
                else {
                    this.props.toast(message);
                    this.updatePatient(response);
                    this.props.history.push(`/patient/${response.id}`);
                }
            });
    };

    private updatePatient = (restPatient: any) => {
        const sex: string = restPatient.sex;
        const education: string = restPatient.education;
        this.setState({
            assignedDoctors: restPatient.assignedDoctors,
            birthDate: restPatient.birthDate.substring(0, 10),
            education: Education[education],
            familiarPast: restPatient.familiarPast,
            id: restPatient.id,
            identity: restPatient.identity,
            medicines: restPatient.medicines,
            name: restPatient.name,
            opticalEvaluations: restPatient.opticalEvaluations,
            origin: restPatient.origin,
            pathologicalPast: restPatient.pathologicalPast,
            procedence: restPatient.procedence,
            race: restPatient.race,
            sex: Sex[sex],
        });
    }

}

export default Patient;
