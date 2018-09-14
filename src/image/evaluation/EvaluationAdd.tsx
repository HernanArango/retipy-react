import * as React from 'react';
import { IAuthProps } from '../../common/IAuthProps';
import { Endpoints, RetipyObjects } from '../../configuration/Endpoints';
import EvaluationAddView from './EvaluationAddView';

export enum RetipyTask {
    TortuosityDensity = "TortuosityDensity",
    TortuosityFractal = "TortuosityFractal",
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
            selection: RetipyTask.TortuosityDensity,
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
            fetch(
                Endpoints.Server
                + Endpoints.Diagnostic
                + `/${this.props.diagnosticId}`
                + RetipyObjects.RetipyEvaluation,
                {
                    body: this.state.selection.toString(),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': this.props.token,
                        'content-type': 'text/plain',
                    },
                    method: 'POST',
                    mode: 'cors',
                    referrer: 'no-referrer',
                })
                .then(response => {
                    if (!response.ok) {
                        throw Error("Error when sending new evaluation request");
                    }
                    else {
                        this.props.toast(
                            "New evaluation request successfully created, come back later to check the results");
                    }
                })
                .catch(error => this.props.toast(error));
        }
    }
}

export default EvaluationAdd;
