import * as React from "react";
import { IAuthProps } from "../common/IAuthProps";
import OpticalEvaluationView from "./OpticalEvaluationView";
import { IOpticalEvaluation } from "./Patient";

interface IOpticalEvaluationProps extends IAuthProps {
    disabled: boolean,
    handleChange: (property: string, value: any) => void,
    patientId: number,
}

interface IOpticalEvaluationState extends IOpticalEvaluation {
    newBiomicroscopyFieldName: string,
}

class OpticalEvaluation extends React.Component<IOpticalEvaluationProps, IOpticalEvaluationState> {
    constructor(props: IOpticalEvaluationProps) {
        super(props);

        this.state = {
            biomicroscopy: new Map(),
            creationDate: "",
            evaluationId: -1,
            id: 0,
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
    }

    public render() {
        return (
            <OpticalEvaluationView
                key={this.state.id}
                biomicroscopy={this.state.biomicroscopy}
                creationDate={this.state.creationDate}
                disabled={this.props.disabled}
                evaluationId={this.state.evaluationId}
                id={this.state.id}
                intraocularPressure={this.state.intraocularPressure}
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
            />
        );
    }

    private handleChange = <T extends string>(key: keyof IOpticalEvaluation, value: T) => {
        this.setState({
            ...this.state,
            [key]: value
        })
    };
}

export default OpticalEvaluation;
