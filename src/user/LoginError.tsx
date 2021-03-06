
import { createStyles, Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import * as React from 'react';

const styles = (theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: theme.spacing(),
        },
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            minHeight: window.innerHeight,
            overflow: 'hidden',
        },
        title: {
            margin: theme.spacing() * 2,
        },
    });

const LoginError = withStyles(styles)(({ classes }: WithStyles<typeof styles>) => (
    <div className={classes.root}>
    <Grid container={true} spacing={10} className={classes.container} justify={'center'}>
        <Typography variant="h4" className={classes.title}>You are not logged in</Typography>
    </Grid>
    </div>
));

export default LoginError;
