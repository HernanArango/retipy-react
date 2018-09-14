import { Button, FormControlLabel, Grid, Paper, Switch, TextField, Typography } from "@material-ui/core";
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as Konva from "konva";
import * as React from "react";
import { RetipyContextConsumer } from "../../context/RetipyContext";
import EvaluationList from "../evaluation/EvaluationList";
import Viewer from "../Viewer";
import { IDisplayDiagnostic } from "./Diagnostic";

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

interface IDiagnosticViewProps extends WithStyles<typeof styles>, IDisplayDiagnostic {
    displayImage: HTMLImageElement,
    handleRoiAddNotes: (event: any) => void,
    handleRoiAddPoints: (x: number, y: number) => void,
    handleRoiClear: () => void,
    handleRoiEnableCreate: (event: any) => void,
    handleRoiSave: () => void,
    handleRoiUndoLastPoint: () => void,
    handleSaveDiagnostic: () => void,
    handleUpdateDiagnostic: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
    imageHeight: number,
    imageWidth: number,
    isAddingRoi: boolean,
    isEditingEnabled: boolean,
    newRoiPoints: number[],
    newRoiText: string,

}

const DiagnosticView = withStyles(styles)(
    class extends React.Component<IDiagnosticViewProps, {}>{

        private image: Konva.Image | null = null;

        public render(): JSX.Element {
            const { classes } = this.props;
            return (
                <div className={classes.root}>
                    <Grid container={true} spacing={16} className={classes.container}>
                        <Viewer
                            classes={classes}
                            displayImage={this.props.displayImage}
                            handleMouseDown={this.handleMouseDown}
                            imageHeight={this.props.imageHeight}
                            imageWidth={this.props.imageWidth}
                            isAddingRoi={this.props.isAddingRoi}
                            newRoiPoints={this.props.newRoiPoints}
                            rois={this.props.rois}
                            setImageReference={this.setImageReference}
                        />


                        {!this.props.isEditingEnabled &&
                        <RetipyContextConsumer>
                            {retipyContext => retipyContext &&
                                <EvaluationList
                                    id={this.props.id}
                                    toast={retipyContext.toast}
                                    token={retipyContext.token}
                                />}
                        </RetipyContextConsumer>
                        }

                        {this.props.isEditingEnabled &&
                        <Grid item={true} lg={6} md={12} sm={12} xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant="display1">New Region of Interest</Typography>
                                <Grid container={true}>
                                    <Grid item={true} lg={2} xs={3}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.props.isAddingRoi}
                                                    color="primary"
                                                    onChange={this.props.handleRoiEnableCreate}
                                                />}
                                            label="Add new"
                                        />
                                    </Grid>
                                    <Grid item={true} lg={4} xs={7} >
                                        <Button
                                            onClick={this.props.handleRoiUndoLastPoint}
                                            disabled={!this.props.isAddingRoi}
                                            className={classes.roiButton}
                                        >
                                            Undo Last Point
                                </Button>
                                    </Grid>
                                    <Grid item={true} lg={1} xs={2}>
                                        <TextField
                                            value={this.props.newRoiPoints.length / 2}
                                            label="Points"
                                            disabled={true}
                                            fullWidth={true}
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    required={true}
                                    id="roiNotes"
                                    disabled={!this.props.isAddingRoi}
                                    placeholder="eg. Dead Tissue"
                                    helperText="Roi Observation"
                                    value={this.props.newRoiText}
                                    onChange={this.props.handleRoiAddNotes}
                                    margin="normal"
                                    label="Notes"
                                    fullWidth={true}
                                />
                                <Button
                                    variant="raised"
                                    type="submit"
                                    onClick={this.props.handleRoiSave}
                                    disabled={!this.props.isAddingRoi}
                                    className={classes.roiButton}
                                >
                                    Save
                            </Button>
                                <Button
                                    color="primary"
                                    onClick={this.props.handleRoiClear}
                                    disabled={!this.props.isAddingRoi}
                                    className={classes.roiButton}
                                >
                                    Cancel
                            </Button>
                            </Paper>
                        </Grid>
                        }{this.props.isEditingEnabled &&
                        <Grid item={true} lg={6} md={12} sm={12} xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant="display1">Diagnostic Information</Typography>
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
                                            value={this.props.diagnostic}
                                            label="Diagnostic"
                                            helperText="Most prominent disease"
                                            onChange={this.props.handleUpdateDiagnostic}
                                            fullWidth={true}
                                        />
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                        <Button
                                            variant="raised"
                                            color="primary"
                                            className={classes.button}
                                            onClick={this.props.handleSaveDiagnostic}
                                        >
                                            Update Diagnostic
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        }
                    </Grid>
                </div>
            );
        }

        private setImageReference = (reference: Konva.Image | null) => {
            this.image = reference;
        }

        private handleMouseDown = () => {
            if (this.props.isAddingRoi) {
                if (this.image !== null) {
                    const stage = this.image.getStage();
                    const point = stage.getPointerPosition();
                    this.props.handleRoiAddPoints(point.x, point.y);
                }
            }
        }
    });

export default DiagnosticView;
