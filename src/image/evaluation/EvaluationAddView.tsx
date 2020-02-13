import { Button, createStyles, Grid, MenuItem, Paper, TextField, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import * as React from 'react';
import { RetipyTask } from "./EvaluationAdd";

const styles = (theme: Theme) => createStyles({
    button: {
        margin: theme.spacing.unit,
    },
    paper: {
        color: theme.palette.text.secondary,
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
    },
});

interface IEvaluationAddProps extends WithStyles<typeof styles> {
    handleChange: (retipyTask: RetipyTask) => void,
    handleSend: () => void,
    selection: RetipyTask,
}

const EvaluationAddView = withStyles(styles)(
    class extends React.Component<IEvaluationAddProps, {}>{
        constructor(props: IEvaluationAddProps) {
            super(props);
        }

        public render() {
            const { classes } = this.props;
            return (
                <Grid item={true} lg={8} md={10} sm={12} xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h4">
                            Run Automated Algorithm
                        </Typography>
                        <br />
                        <Typography variant="body2">Most algorithms require a successful segmentation before calling them</Typography>
                        <TextField
                            required={true}
                            id="algorithm-selection"
                            helperText="Select an algorithm to run for this diagnostic"
                            value={this.props.selection}
                            onChange={this.handleAlgorithmChange}
                            label="Task Selection"
                            fullWidth={true}
                            select={true}
                        >
                            <MenuItem key={RetipyTask.Segmentation} value={RetipyTask.Segmentation}>
                                Segmentation
                            </MenuItem>
                            <MenuItem key={RetipyTask.TortuosityDensity} value={RetipyTask.TortuosityDensity}>
                                Tortuosity by Density Algorithm
                            </MenuItem>
                            <MenuItem key={RetipyTask.TortuosityFractal} value={RetipyTask.TortuosityFractal}>
                                Tortuosity by Fractal Algorithm
                            </MenuItem>
                            <MenuItem key={RetipyTask.LandmarksClassification} value={RetipyTask.LandmarksClassification}>
                                Landmarks and Bifurcations
                            </MenuItem>
                            <MenuItem key={RetipyTask.VesselsClassification} value={RetipyTask.VesselsClassification}>
                                Vessel Classification
                            </MenuItem>
			   <MenuItem key={RetipyTask.DrusenClassificationBySize} value={RetipyTask.DrusenClassificationBySize}>
				Drusen Segmentation and Size Classification
                            </MenuItem>
                        </TextField>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={this.props.handleSend}>
                            Send
                        </Button>
                    </Paper>
                </Grid>
            );
        }

        private handleAlgorithmChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            this.props.handleChange(RetipyTask[event.target.value]);
        }


    }
);

export default EvaluationAddView;
