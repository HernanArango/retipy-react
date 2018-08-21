import * as React from "react";
import { Education } from "../common/Education";
import { IAuthProps } from "../common/IAuthProps";
import { Sex } from "../common/Sex";
import PatientView from "./PatientView";


export interface IOpticalEvaluation {
    biomicroscopy: Map<string, string>,
    creationDate: string,
    evaluationId: number,
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
    birthDate: string,
    education: Education,
    familiarPast: string[],
    id: number,
    identity: number,
    medicines: string[],
    name: string,
    opticalEvaluations: IOpticalEvaluation[],
    origin: string,
    pathologicalPast: string[],
    procedence: string,
    race: string,
    sex: Sex,
}

interface IPatientProps extends IAuthProps {
    id: number,
    disabled: boolean,
}

class Patient extends React.Component<IPatientProps, IPatient> {
    constructor(props: IPatientProps) {
        super(props);

        this.state = {
            birthDate: "",
            education: Education.None,
            familiarPast: [],
            id: 0,
            identity: 0,
            medicines: [],
            name: "",
            opticalEvaluations: [],
            origin: "",
            pathologicalPast: [],
            procedence: "",
            race: "",
            sex: Sex.Female,
        }
    }

    public render() {
        return(
            <PatientView
                birthDate={this.state.birthDate}
                disabled={this.props.disabled}
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
            />
        );
    }

    private handleChange = <T extends string>(key: keyof IPatient, value: T) => {
       this.setState({
        ...this.state,
        [key]: value
      })};
}

export default Patient;
