import * as React from "react";
import { Route } from "react-router-dom";
import { RetipyContextConsumer } from "../context/RetipyContext";
import PatientList from "../patient/PatientList";

const renderPatientList = (token: string, toast:(message: string)=> any) => (props: any) => <PatientList token={token} toast={toast} />;

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
                </div>
            )}
        </RetipyContextConsumer>
    )
}

export default Routes;
