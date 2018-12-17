import { Button, createStyles, Grid, Paper, Theme, Typography, withStyles, WithStyles } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import LaunchIcon from '@material-ui/icons/Launch';
import * as React from "react";
import { Redirect } from "react-router";
import { IAuthProps } from "../../common/IAuthProps";
import { Endpoints, RetipyObjects } from "../../configuration/Endpoints";

const styles = (theme: Theme) => createStyles({
    button: {
        justify: 'center',
        margin: theme.spacing.unit,
    },
    buttonSmall: {
        align: 'right',
        justify: 'center',
        margin: theme.spacing.unit,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: theme.spacing.unit,
    },
    heading: {
        align: "left",
        flexGrow: 1,
        justify: "center",
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    paper: {
        color: theme.palette.text.secondary,
        padding: theme.spacing.unit,
        textAlign: 'center',
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    textField: {
        flexGrow: 1,
        marginRight: theme.spacing.unit,
    },
    title: {
        margin: theme.spacing.unit * 2,
        verticalAlign: 'middle',
    },
});

interface ISimpleDiagnostic {
    date: string,
    id: number,
    name: string,
}

interface IDiagnosticListState {
    diagnostics: ISimpleDiagnostic[],
    isRedirect: boolean,
    redirect: string,
}

interface IDiagnosticListProps extends WithStyles<typeof styles>, IAuthProps {
    opticalEvaluationId: number,
    patientId: number,
}

const DiagnosticList = withStyles(styles)(
    class extends React.Component<IDiagnosticListProps, IDiagnosticListState> {
        constructor(props: IDiagnosticListProps) {
            super(props);
            this.state = {
                diagnostics: [],
                isRedirect: false,
                redirect: "",
            }
            this.fetchDiagnosticList();
        }

        public render() {
            const { classes } = this.props;
            return (
                <Grid container={true} spacing={16} justify={'center'} className={classes.container} >
                    <Grid item={true} lg={12} md={12} sm={12} xs={12}>
                        <Grid container={true} >
                            {this.renderDiagnostics()}
                        </Grid>
                    </Grid>
                </Grid>

            );
        }

        private fetchDiagnosticList = () => {
            if (this.props.opticalEvaluationId !== 0 && this.props.token !== "") {
                fetch(
                    Endpoints.Server + Endpoints.OpticalEvaluation + `/${this.props.opticalEvaluationId}` + RetipyObjects.Diagnostic + "s",
                    {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': this.props.token,
                            'content-type': 'application/json',
                        },
                        method: 'GET',
                        mode: 'cors',
                        referrer: 'no-referrer',
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw Error("Error when retrieving OpticalEvaluation");
                        }
                        return response.json();
                    })
                    .then(diagnosticList => this.setState({
                        diagnostics: diagnosticList.diagnosticList,
                    }))
                    .catch(error => this.props.toast(error.message));
            }
        }
        private handleDeleteDiagnostic = (diagnosticId: number) => (_: React.MouseEvent<HTMLElement>) => {
            fetch(
                Endpoints.Server + Endpoints.Diagnostic + `/${diagnosticId}`,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': this.props.token,
                        'content-type': 'application/json',
                    },
                    method: 'DELETE',
                    mode: 'cors',
                    referrer: 'no-referrer',
                }
            )
                .then(__ => {
                    this.props.toast("Diagnostic deleted successfully")
                    this.fetchDiagnosticList()
                })
                .catch(error => this.props.toast(error.message));
        }

        private handleOpenDiagnostic = (id: number, edit: boolean) => (event: React.MouseEvent<HTMLElement>) => {
            let redirectString: string = `/patient/${this.props.patientId}/opticalevaluation/${this.props.opticalEvaluationId}/diagnostic/${id}`;
            if (edit) {
                redirectString = redirectString + "/edit"
            }
            this.setState({
                isRedirect: true,
                redirect: redirectString,
            })
        }

        private renderDiagnostics = () => {
            const diagnostics: JSX.Element[] = []
            for (const diagnostic of this.state.diagnostics) {
                diagnostics.push(this.renderDiagnostic(diagnostic, Math.random()))
            }
            return diagnostics;
        }

        private renderDiagnostic = (diagnostic: ISimpleDiagnostic, key: number) => {
            const { classes } = this.props;
            let diagnosticName = "<no diagnostic>";
            if (diagnostic.name && diagnostic.name.length > 0) {
                diagnosticName = diagnostic.name;
            }
            return (
                <Grid key={key} item={true} lg={6} md={6} sm={12} xs={12} justify="center">
                    {this.state.isRedirect && <Redirect to={this.state.redirect} />}
                    <Paper className={classes.paper}>
                        <Grid container={true} >
                            <Grid item={true} lg={6} md={6} sm={6} xs={12} justify="center">
                                <Typography
                                    variant="h6" gutterBottom={true} className={classes.title}
                                >
                                    Diagnostic: { diagnosticName } <br />
                                    Date: { diagnostic.date.substr(0, 10) }
                                </Typography>
                            </Grid>
                            <Grid item={true} lg={6} md={6} sm={6} xs={12} justify="center">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    className={classes.button}
                                    onClick={this.handleOpenDiagnostic(diagnostic.id, false)}
                                >
                                    View
                                    <LaunchIcon className={classes.rightIcon} />
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    className={classes.button}
                                    onClick={this.handleOpenDiagnostic(diagnostic.id, true)}
                                >
                                    Edit
                                    <LaunchIcon className={classes.rightIcon} />
                                </Button>
                                <Button
                                    className={classes.buttonSmall}
                                    variant="flat"
                                    color="secondary"
                                    size="small"
                                    onClick={this.handleDeleteDiagnostic(diagnostic.id)}
                                >
                                    Delete
                                    <DeleteIcon className={classes.rightIcon} />
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            );
        }
    }
);

export default DiagnosticList;
