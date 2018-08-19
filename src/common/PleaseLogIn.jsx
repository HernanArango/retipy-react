import React from 'react';
import { Typography, withStyles, Grid } from "@material-ui/core";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: '#EFEFEF',
        minHeight: window.innerHeight,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: theme.spacing.unit,
    },
    title: {
      margin: theme.spacing.unit * 2,
    },
});

function PleaseLogIn(props) {
    const {classes} = props;
    return(
        <div className={classes.root}>
            <Grid container spacing={16} className={classes.container} justify={'center'}>
                <Typography variant="display1" className={classes.title}>You are not logged in</Typography>
            </Grid>
        </div>);
}

export default withStyles(styles)(PleaseLogIn);
