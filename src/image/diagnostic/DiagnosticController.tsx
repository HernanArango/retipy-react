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
        .then(response => response.json());
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
        .then(response => response.json())
        .then(response => {
            if (response.status === 400) {
                toast(response.message);
            }
            else {
                toast("Diagnostic Updated Successfully");
            }
        });
}
