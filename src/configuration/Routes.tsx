import * as React from "react";
import { Route } from "react-router-dom";
import { IUserData } from "../common/IAuthProps";
import { RetipyContextConsumer } from "../context/RetipyContext";
import Diagnostic from "../image/diagnostic/Diagnostic";
import Evaluation from "../image/evaluation/Evaluation";
import OpticalEvaluation from "../patient/OpticalEvaluation";
import Patient from "../patient/Patient";
import PatientList from "../patient/PatientList";

const renderEvaluation =
    (token: string,
    toast: (message: string) => any,
    user: IUserData,
        ) =>
        (props: any) =>
            <Evaluation
                token={token}
                toast={toast}
                user={user}
                id={parseInt(props.match.params.id, 10)}
                diagnosticId={parseInt(props.match.params.diagnosticId, 10)}
                opticalEvaluationId={parseInt(props.match.params.opticalEvaluationId, 10)}
                patientId={parseInt(props.match.params.patientId, 10)}
            />;

const renderPatientList =
    (token: string,
        toast: (message: string) => any,
        user: IUserData) =>
        (props: any) =>
            <PatientList token={token} toast={toast} user={user} />;

const renderPatient =
    (token: string,
        toast: (message: string) => any) =>
        (props: any) =>
            <Patient
                token={token}
                toast={toast}
                id={parseInt(props.match.params.id, 10)}
                disabled={false}
                {...props} />;

const renderOpticalEvaluation =
    (token: string,
        toast: (message: string) => any) =>
        (props: any) =>
            <OpticalEvaluation
                token={token}
                toast={toast}
                id={parseInt(props.match.params.id, 10)}
                patientId={parseInt(props.match.params.patientId, 10)}
                disabled={false}
                {...props} />;

const renderDiagnostic =
    (token: string,
        toast: (message: string) => any,
        editable: boolean) =>
        (props: any) =>
            <Diagnostic
                token={token}
                toast={toast}
                id={parseInt(props.match.params.id, 10)}
                opticalEvaluationId={parseInt(props.match.params.opticalEvaluationId, 10)}
                patientId={parseInt(props.match.params.patientId, 10)}
                disabled={false}
                editable={editable}
                {...props} />;

const Routes: React.SFC = (props) => {
    return (
        <RetipyContextConsumer>
            {retipyContext => retipyContext && (
                <div>
                    <Route
                        exact={true}
                        path="/"
                        render={renderPatientList(retipyContext.token, retipyContext.toast, retipyContext.user)}
                    />
                    <Route
                        exact={true}
                        path="/patient/:id"
                        render={renderPatient(retipyContext.token, retipyContext.toast)}
                    />
                    <Route
                        exact={true}
                        path="/patient/:patientId/opticalevaluation/:id"
                        render={renderOpticalEvaluation(retipyContext.token, retipyContext.toast)}
                    />
                    <Route
                        exact={true}
                        path="/patient/:patientId/opticalevaluation/:opticalEvaluationId/diagnostic/:id"
                        render={renderDiagnostic(retipyContext.token, retipyContext.toast, false)}
                    />
                    <Route
                        exact={true}
                        path="/patient/:patientId/opticalevaluation/:opticalEvaluationId/diagnostic/:id/edit"
                        render={renderDiagnostic(retipyContext.token, retipyContext.toast, true)}
                    />
                    <Route
                        exact={true}
                        path="/patient/:patientId/opticalevaluation/:opticalEvaluationId/diagnostic/:diagnosticId/evaluation/:id"
                        render={renderEvaluation(retipyContext.token, retipyContext.toast, retipyContext.user)}
                    />
                </div>
            )}
        </RetipyContextConsumer>
    )
}

export default Routes;
