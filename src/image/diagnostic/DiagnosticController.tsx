import { Endpoints, RetipyObjects } from "../../configuration/Endpoints";
import { IDiagnostic } from "./Diagnostic";

export function getDiagnostic(diagnosticId: number, token: string): Promise<any> {
    return fetch(
        Endpoints.Server + Endpoints.Diagnostic + `/${diagnosticId}`,
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': token,
                'content-type': 'application/json',
            },
            method: 'GET',
            mode: 'cors',
            referrer: 'no-referrer',
        })
        .then(response => {
            if (!response.ok) {
                throw Error("There was an error retrieving the diagnostic data");
            }
            return response.json();
        });
}

export function saveDiagnostic(
    diagnosticData: IDiagnostic,
    patientId: number,
    opticalEvaluationId: number,
    token: string,
    toast: (message: string) => void): void {
    fetch(
        Endpoints.Server + Endpoints.Patient + `/${patientId}`
            + RetipyObjects.OpticalEvaluation + `/${opticalEvaluationId}`
            + RetipyObjects.Diagnostic,
        {
            body: JSON.stringify(diagnosticData),
            headers:
            {
                'Access-Control-Allow-Origin': '*',
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            mode: 'cors',
            referrer: 'no-referrer',
        })
        .then(response => {
            if (!response.ok) {
                throw Error("There was an error saving the diagnostic");
            }
            return response.json();
        })
        .then(restDiagnostic => {
            toast("Diagnostic Updated Successfully");
        })
        .catch(error => toast(error.message));
}
