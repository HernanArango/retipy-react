import { Avatar, Button, FormControlLabel, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Switch, TextField, Typography } from "@material-ui/core";
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import BookmarkIcon from "@material-ui/icons/Bookmark";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Konva from "konva";
import * as React from "react";
import Redirector from "../../common/Redirector";
import { RetipyContextConsumer } from "../../context/RetipyContext";
import EvaluationAdd from "../evaluation/EvaluationAdd";
import EvaluationList from "../evaluation/EvaluationList";
import { IDisplayRoi } from "../Roi";
import Viewer from "../Viewer";
import { IDisplayDiagnostic } from "./Diagnostic";

const styles = (theme: Theme) => createStyles({
    button: {
        margin: theme.spacing(),
    },
    close: {
        height: theme.spacing() * 4,
        width: theme.spacing() * 4,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: theme.spacing(),
    },
    leftIcon: {
        marginRight: theme.spacing(),
    },
    paper: {
        color: theme.palette.text.secondary,
        padding: theme.spacing() * 2,
        textAlign: 'center',
    },
    progress: {
        margin: theme.spacing() * 2,
    },
    roiButton: {
        margin: theme.spacing() / 2,
    },
    root: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    textField: {
        marginLeft: theme.spacing(),
        marginRight: theme.spacing(),
        width: 200,
    },
});

interface IDiagnosticViewProps extends WithStyles<typeof styles>, IDisplayDiagnostic {
    displayImage: HTMLImageElement,
    handleRoiAddColor: (event: any) => void,
    handleRoiAddNotes: (event: any) => void,
    handleRoiAddPoints: (x: number, y: number) => void,
    handleRoiCancel: () => void,
    handleRoiClear: () => void,
    handleRoiDelete: (id: number) => (event: React.MouseEvent<HTMLElement>) => void,
    handleRoiEnableCreate: (event: any) => void,
    handleRoiSave: () => void,
    handleRoiToggleVisibility: (id: number) => (event: React.MouseEvent<HTMLElement>) => void,
    handleRoiUndoLastPoint: () => void,
    handleSaveDiagnostic: () => void,
    handleUpdateDiagnostic: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
    imageHeight: number,
    imageWidth: number,
    isAddingRoi: boolean,
    isEditingEnabled: boolean,
    isImageLoaded: boolean,
    newRoiColor: string,
    newRoiPoints: number[],
    newRoiText: string,
    diagnosticId: number,
    opticalEvaluationId: number,
    patientId: number,
}

interface IDiagnosticViewState {
    isDrawing: boolean,
}

const DiagnosticView = withStyles(styles)(
    class extends React.Component<IDiagnosticViewProps, IDiagnosticViewState>{

        private image: Konva.Image | null = null;

        constructor(props: IDiagnosticViewProps) {
            super(props);

            this.state = {
                isDrawing: false,
            }
        }

        public render(): JSX.Element {
            const { classes } = this.props;
            return (
                <div className={classes.root}>
                    <Grid
                        container={true}
                        spacing={10}
                        className={classes.container}
                        justify="center"
                    >
                        <Viewer
                            classes={classes}
                            displayImage={this.props.displayImage}
                            handleMouseDown={this.handleMouseDown}
                            handleMouseMove={this.handleMouseMove}
                            handleMouseUp={this.handleMouseUp}
                            imageHeight={this.props.imageHeight}
                            imageWidth={this.props.imageWidth}
                            isAddingRoi={this.props.isAddingRoi}
                            isImageLoaded={this.props.isImageLoaded}
                            newRoiPoints={this.props.newRoiPoints}
                            rois={this.props.rois}
                            setImageReference={this.setImageReference}
                        />
                        {!this.props.isEditingEnabled &&
                            <RetipyContextConsumer>
                                {retipyContext => retipyContext &&
                                    <EvaluationAdd
                                        diagnosticId={this.props.id}
                                        toast={retipyContext.toast}
                                        token={retipyContext.token}
                                        user={retipyContext.user}
                                    />}
                            </RetipyContextConsumer>
                        }

                        {!this.props.isEditingEnabled &&
                            <RetipyContextConsumer>
                                {retipyContext => retipyContext &&
                                    <EvaluationList
                                        id={this.props.id}
                                        toast={retipyContext.toast}
                                        token={retipyContext.token}
                                        user={retipyContext.user}
                                        patientId={this.props.patientId}
                                        diagnosticId={this.props.diagnosticId}
                                        opticalEvaluationId={this.props.opticalEvaluationId}
                                    />}
                            </RetipyContextConsumer>
                        }

                        {this.props.isEditingEnabled &&
                            <Grid item={true} lg={5} md={12} sm={12} xs={12}>
                                <Paper className={classes.paper}>
                                    <Typography variant="h4">
                                        Roi List
                                    </Typography>
                                    <List
                                        style={{ maxHeight: this.props.imageHeight, overflow: 'auto' }}
                                    >
                                        {this.renderRoiList(this.props.rois)}
                                    </List>
                                </Paper>
                            </Grid>
                        }

                        {this.props.isEditingEnabled &&
                            <Grid item={true} lg={6} md={12} sm={12} xs={12}>
                                <Paper className={classes.paper}>
                                    <Typography variant="h4">New Region of Interest</Typography>
                                    <Grid container={true}>
                                        <Grid item={true} lg={2} md={2} sm={2} xs={3}>
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
                                        <Grid item={true} lg={3} md={3} sm={3} xs={5} >
                                            <Button
                                                onClick={this.props.handleRoiUndoLastPoint}
                                                disabled={!this.props.isAddingRoi}
                                                className={classes.roiButton}
                                                variant="outlined"
                                            >
                                                Undo Last Point
                                            </Button>
                                        </Grid>
                                        <Grid item={true} lg={3} md={3} sm={3} xs={5} >
                                            <Button
                                                onClick={this.props.handleRoiClear}
                                                disabled={!this.props.isAddingRoi}
                                                className={classes.roiButton}
                                                variant="outlined"
                                            >
                                                Clear
                                            </Button>
                                        </Grid>
                                        <Grid item={true} lg={1} md={2} xs={2}>
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
                                    <TextField
                                        required={true}
                                        id="roiColor"
                                        disabled={!this.props.isAddingRoi}
                                        placeholder="white"
                                        helperText="Roi Color"
                                        value={this.props.newRoiColor}
                                        onChange={this.props.handleRoiAddColor}
                                        margin="normal"
                                        label="Roi Color"
                                        fullWidth={true}
                                    />
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        onClick={this.props.handleRoiSave}
                                        disabled={!this.props.isAddingRoi}
                                        className={classes.roiButton}
                                    >
                                        Save
                            </Button>
                                    <Button
                                        color="primary"
                                        onClick={this.props.handleRoiCancel}
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
                                    <Typography variant="h4">Diagnostic Information</Typography>
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
                                                variant="contained"
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
                        <Grid item={true} lg={6} md={12} sm={12} xs={12}>
                            <Redirector
                                redirect={`/patient/${this.props.patientId}/opticalevaluation/${this.props.opticalEvaluationId}`}
                                text="Back to Optical Evaluation"
                            />
                        </Grid>
                    </Grid>
                </div>
            );
        }

        private renderRoiList = (rois: IDisplayRoi[]) => {
            const renderedList: JSX.Element[] = [];
            for (const roi of rois) {
                renderedList.push(
                    <ListItem key={roi.id}>
                        <ListItemAvatar>
                            <Avatar>
                                <BookmarkIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={"Name: " + roi.notes === "" ? "No note defined" : roi.notes}
                            secondary={`color: ${roi.color}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                aria-label="Delete"
                                onClick={this.props.handleRoiDelete(roi.id)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton
                                aria-label="Toggle Visibility"
                                onClick={this.props.handleRoiToggleVisibility(roi.id)}>
                                {!roi.disabled && <VisibilityIcon />}
                                {roi.disabled && <VisibilityOffIcon />}
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            }
            return renderedList;
        }

        private setImageReference = (reference: Konva.Image | null) => {
            this.image = reference;
        }

        private handleMouseDown = () => {
            if (this.props.isAddingRoi) {
                this.setState({
                    isDrawing: true,
                })
                if (this.image !== null) {
                    
                    const stage = this.image.getStage();

                    if (stage !== null) {
                        const point = stage.getPointerPosition();
                        if (point !== null) {
                            this.props.handleRoiAddPoints(point.x, point.y);
                        }
                    }
                    
                }
            }
        }

        private handleMouseMove = () => {
            if (this.state.isDrawing && this.image !== null) {
                const stage = this.image.getStage();
                if (stage !== null) {
                    const point = stage.getPointerPosition();
                    if (point !== null) {
                        this.props.handleRoiAddPoints(point.x, point.y);
                    }
                }
                
            }
        }

        private handleMouseUp = () => {
            this.setState({
                isDrawing: false,
            })
        }
    });

export default DiagnosticView;
