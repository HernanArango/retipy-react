export enum Endpoints {
    Server = "http://localhost:8080",
    Patient = "/retipy/patient",
    Login = "/retipy/user/login",
    Token = "/retipy/user/token",
    OpticalEvaluation = "/retipy/opticalevaluation",
    Diagnostic = "/retipy/diagnostic",
    Staff = "/retipy/staff",
    Status = "/retipy/status",
}

export enum RetipyObjects {
    OpticalEvaluation = "/opticalevaluation",
    Diagnostic = "/diagnostic",
    Doctor = "/doctor",
    Resident = "/resident",
    ProcessingBackendStatus = "/backend"
}
