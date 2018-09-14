import * as React from 'react';
import { IAuthProps } from '../../common/IAuthProps';
import { Endpoints, RetipyObjects } from '../../configuration/Endpoints';
import { EvaluationStatus } from './Evaluation';
import EvaluationListView from './EvaluationListView';

export interface IEvaluationSimple {
    id: number,
    name: string,
    status: EvaluationStatus,
}

interface IDiagnosticProps extends IAuthProps {
    id: number,
}

interface IEvaluationListState {
    evaluationList: IEvaluationSimple[],
}

class EvaluationList extends React.Component<IDiagnosticProps, IEvaluationListState> {
    constructor(props: IDiagnosticProps) {
        super(props);

        this.state = {
            evaluationList: [],
        }

        this.fetchEvaluationList();
    }

    public render() {
        return(
            <EvaluationListView
                evaluationList={this.state.evaluationList}
                toast={this.props.toast}
            />
        );
    }

    private fetchEvaluationList = () => {
        if (this.props.token !== "") {
            fetch(
                Endpoints.Server
                + Endpoints.Diagnostic
                + `/${this.props.id}`
                + RetipyObjects.RetipyEvaluation,
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
                        throw Error("Error when retrieving retipy evaluation list");
                    }
                    return response.json();
                })
                .then(data => {
                    this.setState(
                        {
                            evaluationList: data.evaluationList,
                        });
                })
                .catch(error => this.props.toast(error));
        }
    }
}

export default EvaluationList;
