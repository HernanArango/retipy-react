import * as React from 'react';
import { IAuthProps } from '../../common/IAuthProps';
import { EvaluationStatus } from './Evaluation';
import { deleteEvaluation, getEvaluationList } from './EvaluationController';
import EvaluationListView from './EvaluationListView';

export interface IEvaluationSimple {
    id: number,
    name: string,
    status: EvaluationStatus,
}

interface IDiagnosticProps extends IAuthProps {
    diagnosticId: number,
    id: number,
    opticalEvaluationId: number,
    patientId: number,
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
                diagnosticId={this.props.diagnosticId}
                handleDeleteEvaluation={this.deleteEvaluation}
                opticalEvaluationId={this.props.opticalEvaluationId}
                patientId={this.props.patientId}
            />
        );
    }

    private deleteEvaluation = (id: number) => (event: React.MouseEvent<HTMLElement>) => {
        deleteEvaluation(id, this.props.token)
            .then(response => {
                if (response.ok) {
                    this.props.toast(`Removed evaluation ${id}`);
                    this.fetchEvaluationList();
                }
                else {
                    this.props.toast(`There was an error removing evaluation ${id}`);
                }
            });
    }

    private fetchEvaluationList = () => {
        if (this.props.token !== "") {
            getEvaluationList(this.props.id, this.props.token)
                .then(data => {
                    this.setState(
                        {
                            evaluationList: data.evaluationList,
                        });
                })
                .catch(error => this.props.toast(error.message));
        }
    }
}

export default EvaluationList;
