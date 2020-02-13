import * as React from 'react';
import { IAuthProps } from '../../common/IAuthProps';
import EvaluationAddView from './EvaluationAddView';
import { createEvaluationForDiagnostic } from './EvaluationController';

export enum RetipyTask {
    TortuosityDensity = "TortuosityDensity",
    TortuosityFractal = "TortuosityFractal",
    LandmarksClassification = "LandmarksClassification",
    Segmentation = "Segmentation",
    VesselsClassification = "VesselsClassification",
    DrusenClassificationBySize = "DrusenClassificationBySize",
    

}

interface IEvaluationAddState {
    selection: RetipyTask,
}

interface IEvaluationAddProps extends IAuthProps {
    diagnosticId: number,
}

class EvaluationAdd extends React.Component<IEvaluationAddProps, IEvaluationAddState> {
    constructor(props: IEvaluationAddProps) {
        super(props);

        this.state = {
            selection: RetipyTask.Segmentation,
        }
    }

    public render() {
        return(
            <EvaluationAddView
                handleChange={this.handleChange}
                handleSend={this.handleSend}
                selection={this.state.selection}
            />
        );
    }

    private handleChange = (selection: RetipyTask) => {
        this.setState({
            'selection': selection,
        })
    }

    private handleSend = () => {
        if (this.props.token !== "") {
            createEvaluationForDiagnostic(
                this.props.diagnosticId,
                this.state.selection.toString(),
                this.props.token)
                .then(response => {
                    if(!response.ok) {
                        return response.json();
                    } else {
                        return response.text();
                    }
                })
                .then(response => {
                    if (response.status === 400) {
                        this.props.toast(response.message);
                    }
                    else {
                        this.props.toast(
                            "New evaluation request successfully created, come back later to check the results");
                    }
                });
        }
    }
}

export default EvaluationAdd;
