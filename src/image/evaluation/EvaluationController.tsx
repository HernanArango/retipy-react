import { Endpoints, RetipyObjects } from "../../configuration/Endpoints";

export function deleteEvaluation(id: number, token: string): Promise<Response> {
    return fetch(
        Endpoints.Server + "/retipy" + RetipyObjects.RetipyEvaluation + `/${id}`,
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': token,
                'content-type': 'application/json',
            },
            method: 'DELETE',
            mode: 'cors',
            referrer: 'no-referrer',
        });
}

export function getEvaluation(id: number, token: string): Promise<any> {
    return fetch(
        Endpoints.Server + "/retipy" + RetipyObjects.RetipyEvaluation + `/${id}`,
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

export function getEvaluationList(id: number, token: string): Promise<any> {
    return fetch(
        Endpoints.Server
        + Endpoints.Diagnostic
        + `/${id}`
        + RetipyObjects.RetipyEvaluation,
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

export function createEvaluationForDiagnostic(diagnosticId: number, evaluationTask: string, token: string): Promise<any> {
    return fetch(
        Endpoints.Server
        + Endpoints.Diagnostic
        + `/${diagnosticId}`
        + RetipyObjects.RetipyEvaluation,
        {
            body: evaluationTask,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': token,
                'content-type': 'text/plain',
            },
            method: 'POST',
            mode: 'cors',
            referrer: 'no-referrer',
        });
}
