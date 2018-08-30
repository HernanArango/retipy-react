import { Button, createStyles, LinearProgress, Theme, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { Redirect } from "react-router";
import { IAuthProps } from "../../common/IAuthProps";
import { Endpoints, RetipyObjects } from "../../configuration/Endpoints";


const styles = (theme: Theme) => createStyles({
    buttonUploadFile: {
        margin: 8,
    },
    inputUploadFile: {
        display: 'none',
    },
});

interface IDiagnosticUploadState {
    file: string | ArrayBuffer | null,
    isRedirect: boolean,
    isUploading: boolean,
    redirect: string,
    uploadButtonText: string,

}

interface IDiagnosticUploadProps extends WithStyles<typeof styles>, IAuthProps {
    patientId: number,
    opticalEvaluationId: number,
}

const DiagnosticUpload = withStyles(styles)(
    class extends React.Component<IDiagnosticUploadProps, IDiagnosticUploadState> {
        private UPLOAD_BUTTON_TEXT = "Upload";

        constructor(props: IDiagnosticUploadProps) {
            super(props);

            this.state = {
                file: null,
                isRedirect: false,
                isUploading: false,
                redirect: "",
                uploadButtonText: this.UPLOAD_BUTTON_TEXT,
            }
        }
        public render(): JSX.Element {
            const { classes } = this.props;
            return(
                <form >
                    <input
                        accept="image/*"
                        className={classes.inputUploadFile}
                        id="file"
                        type="file"
                        onChange={this.handleFileChange}
                    />
                    <label htmlFor="file">
                        <Button
                            variant="outlined"
                            component="span"
                            className={classes.buttonUploadFile}
                        >
                            Select Image
                        </Button>
                    </label>
                    <Button
                        variant="raised"
                        component="span"
                        className={classes.buttonUploadFile}
                        onClick={this.handleButtonUpload}
                    >
                        {this.state.uploadButtonText}
                    </Button>
                    <br/>
                    {this.state.isUploading && <LinearProgress />}
                    {this.state.isRedirect && <Redirect to={this.state.redirect} />}
                </form>
            );
        }

        private handleButtonUpload = (event: React.MouseEvent<HTMLElement>) => {
            if (this.state.file !== undefined && this.state.file !== null) {
                this.setState({
                    isUploading: true,
                    uploadButtonText: "Uploading file"
                });
            fetch(
                Endpoints.Server + Endpoints.Patient + `/${this.props.patientId}`
                    + RetipyObjects.OpticalEvaluation + `/${this.props.opticalEvaluationId}`
                    + RetipyObjects.Diagnostic + "/image",
                {
                    'body': this.state.file,
                    headers:
                    {
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': this.props.token,
                        'content-type': 'text/plain',
                    },
                    method: 'POST',
                    mode: 'cors',
                }).then(response => {
                    if (!response.ok)
                    {
                        throw Error("Error when uploading diagnostic");
                    }
                    return response.json();
                })
                .then(diagnostic => {
                  this.props.toast("Upload Successful");
                  this.setState({
                      isRedirect: true,
                      isUploading: false,
                      redirect: `/patient/${this.props.patientId}/opticalEvaluation/${this.props.opticalEvaluationId}/diagnostic/${diagnostic.id}`,
                      uploadButtonText: this.UPLOAD_BUTTON_TEXT,
                    });
                })
                .catch(error => {
                  this.props.toast("Error when uploading diagnostic");
                  this.setState({
                    isUploading: false,
                    uploadButtonText: this.UPLOAD_BUTTON_TEXT,
                 });
                });
            }
            else {
                this.props.toast("Please select a file before upload");
            }
        }

        private handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            if (event.target.files !== null) {
                const files: FileList = event.target.files;
                const tempFile: File | null = files.item(0);
                if (tempFile !== null) {
                    const file: File = tempFile;
                    this.readFile(file)
                        .then(base64 => {
                            this.setState({
                                file: base64.substring(base64.indexOf(",") + 1),
                            });
                            this.props.toast("Image Selected");
                        })
                        .catch(error => this.props.toast(error));
                }
            }

        }

        private readFile = (file: File): Promise<any> => {
            return new Promise(this.readFilePromise(file));
        }

        private readFilePromise = (file: File) => (
            resolve: (value?: any) => void,
            reject: (reason?: any) => void) => {
                const reader = new FileReader();
                reader.onerror = reject;
                reader.onload = this.readFileOnLoad(reader, resolve);
                reader.readAsDataURL(file);
        }

        private readFileOnLoad = (
            reader: FileReader,
            resolve: (value?: any) => void) => () => {
                resolve(reader.result);
        }
});

export default DiagnosticUpload;
