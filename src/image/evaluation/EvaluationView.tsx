import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import * as React from "react";
import { Image, Layer, Stage } from "react-konva";
import { Redirect } from "react-router";
import PolyRoi from "../Roi";
import { IDisplayEvaluation } from "./Evaluation";

const styles = (theme: Theme) => createStyles({
    button: {
        margin: theme.spacing.unit,
    },
    close: {
        height: theme.spacing.unit * 4,
        width: theme.spacing.unit * 4,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    paper: {
        color: theme.palette.text.secondary,
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
    },
    roiButton: {
        margin: theme.spacing.unit / 2,
    },
    root: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

interface IEvaluationViewState {
    isRedirect: boolean,
    redirect: string,
}
interface IEvaluationViewProps extends WithStyles<typeof styles>, IDisplayEvaluation {
    diagnosticId: number,
    imageHeight: number,
    imageWidth: number,
    opticalEvaluationId: number,
    patientId: number,
}

const EvaluationView = withStyles(styles)(
    class extends React.Component<IEvaluationViewProps, IEvaluationViewState>{
        constructor(props: IEvaluationViewProps) {
            super(props);

            this.state = {
                isRedirect: false,
                redirect: "",
            }
        }

        public render(): JSX.Element {
            const { classes } = this.props;
            return (
                <div className={classes.root}>
                    <Grid
                        container={true}
                        spacing={16}
                        className={classes.container}
                        justify="center"
                    >
                        <Grid item={true} xs={12} sm={12} > {/* Konva div */}
                            <Grid container={true} justify="center">
                                <Paper className={this.props.classes.paper}>
                                    <Typography variant="display1">Evaluation</Typography>
                                    <Stage
                                        width={this.props.imageWidth}
                                        height={this.props.imageHeight}
                                    >
                                        <Layer>
                                            <Image
                                                image={this.props.displayImage}
                                                width={this.props.imageWidth}
                                                height={this.props.imageHeight}
                                            />
                                        </Layer>
                                        <Layer>
                                            {this.renderExistingRoi()}
                                        </Layer>
                                    </Stage>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid item={true} lg={6} md={12} sm={12} xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant="display1">Evaluation Information</Typography>
                                <Grid container={true}>
                                    <Grid item={true} xs={6}>
                                        <TextField
                                            value={this.props.rois.length}
                                            label="RoI Count"
                                            className={classes.textField}
                                            disabled={true}
                                        />
                                    </Grid>
                                    <Grid item={true} xs={6}>
                                        <TextField
                                            value={new Date(this.props.creationDate).toDateString()}
                                            label="Date Added"
                                            className={classes.textField}
                                            InputLabelProps={{ shrink: true, }}
                                            disabled={true}
                                        />
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                        <TextField
                                            value={this.props.name}
                                            label="Retipy Evaluation Name"
                                            fullWidth={true}
                                            disabled={true}
                                        />
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                    {this.state.isRedirect && <Redirect to={this.state.redirect} />}
                                    <Button
                                        variant="contained"
                                        color="default"
                                        className={classes.button}
                                        onClick={this.handleDiagnosticButton}
                                    >
                                        <ArrowBackIcon className={classes.leftIcon} />
                                        Return to Diagnostic
                                    </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            );
        }

        private handleDiagnosticButton = () => {
            this.setState({
                isRedirect: true,
                redirect: `/patient/${this.props.patientId}/opticalevaluation/${this.props.opticalEvaluationId}/diagnostic/${this.props.diagnosticId}`
            })
        }

        private renderExistingRoi = () => {
            const renderedRoi: JSX.Element[] = [];
            for (const currentRoi of this.props.displayRois) {
                renderedRoi.push(<PolyRoi
                    id={currentRoi.id}
                    tooltip={String(currentRoi.id)}
                    text={currentRoi.notes}
                    key={currentRoi.id}
                    points={currentRoi.displayP}
                    visible={true}
                    color={currentRoi.color} />);
            }
            return renderedRoi;
        }
    });

export default EvaluationView;
