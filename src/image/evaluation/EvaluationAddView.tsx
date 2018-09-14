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
                        <Typography variant="display1">
                            Run Automated Algorithm
                        </Typography>
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
                            <MenuItem key={RetipyTask.TortuosityDensity} value={RetipyTask.TortuosityDensity}>
                                Tortuosity by Density Algorithm
                            </MenuItem>
                            <MenuItem key={RetipyTask.TortuosityFractal} value={RetipyTask.TortuosityFractal}>
                                Tortuosity by Fractal Algorithm
                            </MenuItem>
                        </TextField>
                        <Button
                            className={classes.button}
                            variant="raised"
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
