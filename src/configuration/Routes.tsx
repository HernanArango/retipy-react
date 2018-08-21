import * as React from "react";
import { Route } from "react-router-dom";
import { RetipyContextConsumer } from "../context/RetipyContext";
import Patient from "../patient/Patient";
import PatientList from "../patient/PatientList";

const renderPatientList =
    (token: string,
    toast: (message: string) => any) =>
        (props: any) =>
            <PatientList token={token} toast={toast} />;

const renderPatient =
    (token: string,
    toast:(message: string)=> any) =>
        (props: any) =>
            <Patient
                token={token}
                toast={toast}
                id={parseInt(props.match.params.id, 10)}
                disabled={false}
                {...props} />;

const Routes: React.SFC = (props) => {
    return (
        <RetipyContextConsumer>
            {retipyContext => retipyContext && (
                <div>
                    <Route
                        exact={true}
                        path="/"
                        render={renderPatientList(retipyContext.token, retipyContext.toast)}
                    />
                    <Route
                        exact={true}
                        path="/patient/:id"
                        render={renderPatient(retipyContext.token, retipyContext.toast)}
                        />
                </div>
            )}
        </RetipyContextConsumer>
    )
}

export default Routes;
