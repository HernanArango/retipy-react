import { Endpoints } from "../../configuration/Endpoints";

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
            if (!response.ok)
            {
                throw Error("There was an error retrieving the diagnostic data");
            }
            return response.json();
        });
}
