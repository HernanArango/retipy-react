import { Configuration as CNF} from "../Configuration";

export function createToken(username, password)
{
    return fetch(CNF.REST_URL + CNF.LOGIN_ENDPOINT,
        {
            method: 'POST',
            mode: 'cors',
            referrer: 'no-referrer',
            body: JSON.stringify({"username": username, "password": password}),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'content-type': 'application/json'
        }})
        .then(response => {
            if (!response.ok)
            {
                throw Error(response.statusText)
            }
            return response.text();
        })
}

export function refreshToken(token)
{
    return fetch(
        CNF.REST_URL + CNF.TOKEN_ENDPOINT,
        {
            method: 'POST',
            mode: 'cors',
            referrer: 'no-referrer',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'content-type': 'application/json',
            },
            body: token,
        })
        .then(response => {
            if (!response.ok)
            {
                return new Promise((resolve, reject) => resolve(""))
            }
            else
            {
                return response.text()
            }
        });
}
