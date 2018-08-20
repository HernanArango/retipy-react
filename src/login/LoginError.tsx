
import { createStyles, Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import * as React from 'react';

const styles = (theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: theme.spacing.unit,
        },
        title: {
            margin: theme.spacing.unit * 2,
        },
    });

const LoginError = withStyles(styles)(({ classes }: WithStyles<typeof styles>) => (
    <Grid container={true} spacing={16} className={classes.container} justify={'center'}>
        <Typography variant="display1" className={classes.title}>You are not logged in</Typography>
    </Grid>
));

export default LoginError;
