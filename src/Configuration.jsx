export const Configuration = Object.freeze(
    {
        REST_URL: "http://localhost:8080",
        EVALUATION_ENDPOINT: "/retipy/evaluation",
        DIAGNOSTIC_ENDPOINT: "/retipy/diagnostic",
        PATIENT_ENDPOINT: "/retipy/patient",
        LOGIN_ENDPOINT: "/retipy/user/login",
        TOKEN_ENDPOINT: "/retipy/user/token",
        SERVICES:
        {
            evaluation: "evaluation",
            diagnostic: "diagnostic",
        },
        EVALUATION_ALGORITHMS:
        {
            fractal: "fractal",
            density: "density"
        }
    }
)
