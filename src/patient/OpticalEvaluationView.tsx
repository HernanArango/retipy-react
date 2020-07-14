import { Button, createStyles, Grid, MenuItem, Paper, TextField, Theme, Typography, withStyles, WithStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from '@material-ui/icons/Save';
import * as React from "react";
import { Redirect } from "react-router";
import { IAuthProps } from "../common/IAuthProps";
import DiagnosticList from "../image/diagnostic/DiagnosticList";
import DiagnosticUpload from "../image/diagnostic/DiagnosticUpload";
import { IOpticalEvaluation } from "./Patient";

const styles = (theme: Theme) => createStyles({
    button: {
        justify: 'center',
        margin: theme.spacing(),
    },
    buttonSmall: {
        align: 'right',
        justify: 'center',
        margin: theme.spacing(),
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: theme.spacing(),
    },
    heading: {
        align: "left",
        flexGrow: 1,
        justify: "center",
    },
    leftIcon: {
        marginRight: theme.spacing(),
    },
    paper: {
        color: theme.palette.text.secondary,
        padding: theme.spacing(),
        textAlign: 'center',
    },
    rightIcon: {
        marginLeft: theme.spacing(),
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    textField: {
        flexGrow: 1,
        marginRight: theme.spacing(),
    },
    title: {
        margin: theme.spacing() * 2,
        verticalAlign: 'middle',
    },
});

const visualAcuityMenuItems = [
    { label: 'NPL' },
    { label: 'PL' },
    { label: 'MM' },
    { label: 'CD' },
    { label: '20/400' },
    { label: '20/300' },
    { label: '20/200' },
    { label: '20/150' },
    { label: '20/100' },
    { label: '20/80' },
    { label: '20/70' },
    { label: '20/60' },
    { label: '20/50' },
    { label: '20/40' },
    { label: '20/30' },
    { label: '20/25' },
    { label: '20/20' },
    { label: '20/15' },
].map(suggestion => (<MenuItem key={Math.random()} value={suggestion.label}>{suggestion.label}</MenuItem>));

const pupilAssessmentMenuItem = [
    { label: 1 },
    { label: 2 },
    { label: 3 },
    { label: 4 },
].map(suggestion => (<MenuItem key={suggestion.label} value={suggestion.label}>{`${suggestion.label}+`}</MenuItem>));

const intraocularPressureMenuItem = [
    { label: 10 },
    { label: 11 },
    { label: 12 },
    { label: 13 },
    { label: 14 },
    { label: 15 },
    { label: 16 },
    { label: 17 },
    { label: 18 },
    { label: 19 },
    { label: 20 },
    { label: 21 },
    { label: 22 },
    { label: 23 },
    { label: 24 },
    { label: 25 },
    { label: 26 },
    { label: 27 },
    { label: 28 },
    { label: 29 },
    { label: 30 },
    { label: 31 },
].map(suggestion => {
    if (suggestion.label === 31) {
        return <MenuItem key={suggestion.label} value={31}>{`>30`}</MenuItem>
    }
    else {
        return <MenuItem key={suggestion.label} value={suggestion.label}>{`${suggestion.label}`}</MenuItem>
    }
});

interface IOpticalEvaluationViewState {
    isRedirect: boolean,
    newComponentName: string,
    redirect: string,
}

interface IOpticalEvaluationViewProps extends WithStyles<typeof styles>, IOpticalEvaluation, IAuthProps {
    disabled: boolean,
    handleChange: (target: string, value: any) => void,
    handleSave: () => void,
    patientId: number,
}

const OpticalEvaluationView = withStyles(styles)(
    class extends React.Component<IOpticalEvaluationViewProps, IOpticalEvaluationViewState> {
        constructor(props: IOpticalEvaluationViewProps) {
            super(props);
            this.state = {
                isRedirect: false,
                newComponentName: "",
                redirect: "",
            }
        }

        public render() {
            const { classes } = this.props;
            return (
                <div className={classes.root}>
                    <Grid container={true} spacing={10} justify={'center'} className={classes.container} >
                        <Grid item={true} lg={8} md={10} sm={12} xs={12}>
                            <Typography
                                className={classes.heading}
                                variant="h4"
                                gutterBottom={true}
                            >
                                Examination - {this.props.creationDate.substring(0, 10)}
                                <br />
                                Version {this.props.version}
                            </Typography>
                            <Paper className={classes.paper} >
                                <Grid container={true} spacing={10} justify={'space-around'} >
                                    <Grid item={true} lg={12} md={12} sm={12} xs={12}>

                                        &nbsp;&nbsp;&nbsp;
                        </Grid>
                                    <Grid item={true} lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h4">Visual Acuity</Typography>
                                    </Grid>
                                    <Grid item={true} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            className={classes.textField}
                                            id="OD"
                                            disabled={this.props.disabled}
                                            placeholder="Right Eye"
                                            label="Right Eye"
                                            value={this.props.visualRightEye}
                                            onChange={this.handleEventChange('visualRightEye')}
                                            fullWidth={true}
                                            select={true}
                                        >
                                            {visualAcuityMenuItems}
                                        </TextField>
                                    </Grid>
                                    <Grid item={true} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            className={classes.textField}
                                            id="opticalDiscPH"
                                            disabled={this.props.disabled}
                                            placeholder="PH - Right Eye"
                                            label="PH - Right Eye"
                                            value={this.props.visualRightPh}
                                            onChange={this.handleEventChange('visualRightPh')}
                                            fullWidth={true}
                                            select={true}
                                        >
                                            {visualAcuityMenuItems}
                                        </TextField>
                                    </Grid>
                                    <Grid item={true} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            className={classes.textField}
                                            id="OI"
                                            disabled={this.props.disabled}
                                            placeholder="Left Eye"
                                            label="Left Eye"
                                            value={this.props.visualLeftEye}
                                            onChange={this.handleEventChange('visualLeftEye')}
                                            fullWidth={true}
                                            select={true}
                                        >
                                            {visualAcuityMenuItems}
                                        </TextField>
                                    </Grid>
                                    <Grid item={true} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            className={classes.textField}
                                            id="leftEyePH"
                                            disabled={this.props.disabled}
                                            placeholder="PH - Left Eye"
                                            label="PH - Left Eye"
                                            value={this.props.visualLeftPh}
                                            onChange={this.handleEventChange('visualLeftPh')}
                                            fullWidth={true}
                                            select={true}
                                        >
                                            {visualAcuityMenuItems}
                                        </TextField>
                                    </Grid>
                                    <Grid item={true} lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h4">Pupils</Typography>
                                    </Grid>
                                    <Grid item={true} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            id="rightPupilRD"
                                            disabled={this.props.disabled}
                                            placeholder="RD - Right Eye"
                                            label="RD - Right Eye"
                                            value={this.props.pupilRightEyeRD}
                                            onChange={this.handleEventChange('pupilRightEyeRD')}
                                            fullWidth={true}
                                            select={true}
                                        >
                                            {pupilAssessmentMenuItem}
                                        </TextField>
                                    </Grid>
                                    <Grid item={true} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            id="rightPupilRC"
                                            disabled={this.props.disabled}
                                            placeholder="RC - Right Eye"
                                            label="RC - Right Eye"
                                            value={this.props.pupilRightEyeRC}
                                            onChange={this.handleEventChange('pupilRightEyeRC')}
                                            fullWidth={true}
                                            select={true}
                                        >
                                            {pupilAssessmentMenuItem}
                                        </TextField>
                                    </Grid>
                                    <Grid item={true} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            id="rightPupilDPA"
                                            disabled={this.props.disabled}
                                            placeholder="DPA - Right Eye"
                                            label="DPA - Right Eye"
                                            value={this.props.pupilRightEyeDPA}
                                            onChange={this.handleEventChange('pupilRightEyeDPA')}
                                            fullWidth={true}
                                            select={true}
                                        >
                                            {pupilAssessmentMenuItem}
                                        </TextField>
                                    </Grid>
                                    <Grid item={true} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            id="leftEyeRD"
                                            disabled={this.props.disabled}
                                            placeholder="RD - Left Eye"
                                            label="RD - Left Eye"
                                            value={this.props.pupilLeftEyeRD}
                                            onChange={this.handleEventChange('pupilLeftEyeRD')}
                                            fullWidth={true}
                                            select={true}
                                        >
                                            {pupilAssessmentMenuItem}
                                        </TextField>
                                    </Grid>
                                    <Grid item={true} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            required={true}
                                            id="leftEyeRC"
                                            disabled={this.props.disabled}
                                            placeholder="1+"
                                            helperText="RC - Left Eye"
                                            value={this.props.pupilLeftEyeRC}
                                            onChange={this.handleEventChange('pupilLeftEyeRC')}
                                            label="RC - Left Eye"
                                            fullWidth={true}
                                            select={true}
                                        >
                                            {pupilAssessmentMenuItem}
                                        </TextField>
                                    </Grid>
                                    <Grid item={true} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            required={true}
                                            id="leftEyeDPA"
                                            disabled={this.props.disabled}
                                            placeholder="1+"
                                            helperText="DPA - Left Eye"
                                            value={this.props.pupilLeftEyeDPA}
                                            onChange={this.handleEventChange('pupilLeftEyeDPA')}
                                            label="DPA - Left Eye"
                                            fullWidth={true}
                                            select={true}
                                        >
                                            {pupilAssessmentMenuItem}
                                        </TextField>
                                    </Grid>
                                    <Grid item={true} lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h4">Biomicroscopy</Typography>
                                        <Grid container={true} spacing={10} justify={'space-around'}>
                                            <Grid item={true} lg={9} md={9} sm={9} xs={8}>
                                                <TextField
                                                    id="new-component-name"
                                                    disabled={this.props.disabled}
                                                    value={this.state.newComponentName}
                                                    onChange={this.handleChangeNewBiomicroscopyField}
                                                    helperText="Add new Biomicroscopy field"
                                                    label="Field Name"
                                                    fullWidth={true}
                                                />
                                            </Grid>
                                            <Grid item={true} lg={2} md={2} sm={2} xs={4}>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    disabled={this.props.disabled}
                                                    className={classes.button}
                                                    onClick={this.handleAddField}
                                                >
                                                    <AddIcon />
                                                    Add
                                                </Button>
                                            </Grid>
                                            {this.loadFields()}
                                        </Grid>
                                    </Grid>
                                    <Grid item={true} lg={5} md={5} sm={12} xs={12}>
                                        <TextField
                                            required={true}
                                            id="PIO"
                                            disabled={this.props.disabled}
                                            helperText="Intraocular Pressure"
                                            value={this.props.intraocularPressure}
                                            onChange={this.handleEventChange('intraocularPressure')}
                                            label="Intraocular Pressure"
                                            fullWidth={true}
                                            select={true}
                                        >
                                            {intraocularPressureMenuItem}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <br /><br /><br />
                                <Grid item={true} lg={11} md={11} sm={12} xs={12}>
                                    {this.state.isRedirect && <Redirect to={this.state.redirect} />}
                                    <Button
                                        variant="contained"
                                        color="default"
                                        className={classes.button}
                                        onClick={this.handlePatientButton}
                                    >
                                        <ArrowBackIcon className={classes.leftIcon} />
                                        Return to Patient
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={this.props.handleSave}
                                    >
                                        <SaveIcon className={classes.leftIcon} />
                                        Save
                                        </Button>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item={true} lg={8} md={10} sm={12} xs={12}>
                            <Typography variant="h4" className={classes.title}>
                                Diagnostic Images
                            </Typography>
                        </Grid>
                        <Grid item={true} lg={8} md={10} sm={12} xs={12}>
                            <Grid container={true} >
                                {this.props.id !== 0 &&
                                    <Grid item={true} lg={12} md={12} sm={12} xs={12}>
                                        <Paper className={classes.paper}>
                                            <Grid container={true} >
                                                <Grid item={true} lg={6} md={6} sm={6} xs={12}>
                                                    <Typography
                                                        variant="h6" gutterBottom={true} className={classes.title}
                                                    >
                                                        Upload new Diagnostic Image
                                            </Typography>
                                                </Grid>
                                                <Grid item={true} lg={6} md={6} sm={6} xs={12}>
                                                    <DiagnosticUpload
                                                        toast={this.props.toast}
                                                        token={this.props.token}
                                                        user={this.props.user}
                                                        opticalEvaluationId={this.props.id}
                                                        patientId={this.props.patientId}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>}
                                <DiagnosticList
                                    toast={this.props.toast}
                                    token={this.props.token}
                                    user={this.props.user}
                                    opticalEvaluationId={this.props.id}
                                    patientId={this.props.patientId}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            );
        }

        private handleChangeNewBiomicroscopyField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            this.setState({ newComponentName: event.target.value })
        }

        private handleAddField = () => {
            const arbitraryComponents = {};
            for (const key of Object.keys(this.props.biomicroscopy)) {
                arbitraryComponents[key] = this.props.biomicroscopy[key];
            }
            arbitraryComponents[this.state.newComponentName] = "";
            this.props.handleChange('biomicroscopy', arbitraryComponents);
            this.setState({ newComponentName: "" });
        };

        private handleBiomicroscopyField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const text = event.target.value;
            const name = event.target.id;
            const arbitraryComponents = {};
            for (const key of Object.keys(this.props.biomicroscopy)) {
                if (key === name) {
                    arbitraryComponents[key] = text;
                }
                else {
                    arbitraryComponents[key] = this.props.biomicroscopy[key];
                }
            }
            this.props.handleChange('biomicroscopy', arbitraryComponents);
        };

        private handleEventChange = (target: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            this.props.handleChange(target, event.target.value);
        }

        private handlePatientButton = (event: any) => {
            this.setState({
                isRedirect: true,
                redirect: `/patient/${this.props.patientId}`,
            })
        }

        private loadFields = () => {
            const resultComponents = [];
            const arbitraryComponents = this.props.biomicroscopy;
            let id: number = 0;
            for (const key of Object.keys(arbitraryComponents)) {
                resultComponents.push(
                    <Grid
                        key={id} item={true} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                            key={id}
                            id={key}
                            disabled={this.props.disabled}
                            label={key}
                            value={arbitraryComponents[key]}
                            onChange={this.handleBiomicroscopyField}
                            fullWidth={true}
                        />
                    </Grid>
                );
                id = id + 1;
            }
            return (resultComponents);
        };
    }
);

export default OpticalEvaluationView;
