import { Button, createStyles, Grid, Theme, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { IAuthProps } from "../../common/IAuthProps";
import { Endpoints } from "../../configuration/Endpoints";


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
}

interface IDiagnosticUploadProps extends WithStyles<typeof styles>, IAuthProps {

}

const DiagnosticUpload = withStyles(styles)(
    class extends React.Component<IDiagnosticUploadProps, IDiagnosticUploadState> {
        constructor(props: IDiagnosticUploadProps) {
            super(props);

            this.state = {
                file: null,
            }
        }
        public render(): JSX.Element {
            const { classes } = this.props;
            return(
                <Grid item={true}>
                    <input
                        accept="image/*"
                        className={classes.inputUploadFile}
                        id="file"
                        type="file"
                        onChange={this.handleFileChange} />
                    <label htmlFor="file">
                        <Button
                            variant="raised"
                            component="span"
                            className={classes.buttonUploadFile}
                            onClick={this.handleButtonUpload}
                        >
                            Upload
                        </Button>
                    </label>
                </Grid>
            );
        }

        private handleButtonUpload(event: React.MouseEvent<HTMLElement>) {
            fetch(
                Endpoints.Server + Endpoints.Diagnostic + "/image",
                {
                    body: this.state.file,
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
                    response.json();
                })
                .then(success => {
                  this.props.toast("Upload Successful");
                  // this.setState({ redirect: true, id: success.id });
                })
                .catch(error => {
                  this.props.toast(error);
                });
        }

        private handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
            event.persist();
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
                        })
                        .catch(error => this.props.toast(error));
                }
            }

        }

        private readFile(file: File): Promise<any> {
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
