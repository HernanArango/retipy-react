import * as React from "react";
import { Route } from "react-router-dom";
import PatientList from "../patient/PatientList";

const renderPatientList = () => <PatientList token="" />;

const Routes: React.SFC = (props) => {
    return(
    <div>
        <Route
            exact={true}
            path="/"
            render={renderPatientList}
        />
    </div>);

}

export default Routes;
