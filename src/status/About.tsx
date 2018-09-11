import { createStyles, Grid, Paper, Theme, Typography, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { Endpoints, RetipyObjects } from "../configuration/Endpoints";

const styles = (theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing.unit,
        },
        buttonSmall: {
            align: 'right',
            justify: 'center',
            margin: theme.spacing.unit,
        },
        chip: {
          margin: theme.spacing.unit / 4,
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
            marginRight: theme.spacing.unit,
        },
        title: {
            margin: theme.spacing.unit * 2,
            verticalAlign: 'middle',
        },
    });

interface IAboutState {
    backendStatus: boolean,
    processingBackendStatus: boolean,
}

interface IAboutProps extends WithStyles<typeof styles> {}

const About = withStyles(styles)(
    class extends React.Component<IAboutProps, IAboutState> {
        constructor(props: IAboutProps) {
            super(props);

            this.state = {
                backendStatus: false,
                processingBackendStatus: false,
            }

            this.updateStatus();
        }

        public render() {
            const { classes } = this.props;
            return (
                <div className={classes.root}>
                    <Grid container={true} spacing={16} className={classes.container} justify={'center'}>
                        <Grid item={true} lg={8} md={10} sm={12} xs={12}>
                            <Typography variant="display1" className={classes.title}>
                                Status Page
                            </Typography>
                            <Paper className={classes.paper}>
                                    <Grid container={true} spacing={16} justify={'space-around'}>
                                        <Grid item={true} lg={11} md={11} sm={12} xs={12}>
                                            <Typography>Backend Status: {`${this.state.backendStatus}`}</Typography>
                                        </Grid>
                                        <Grid item={true} lg={11} md={11} sm={12} xs={12}>
                                            <Typography>Processing Backend Status: {this.state.processingBackendStatus && "Online"}</Typography>
                                        </Grid>
                                    </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            )
        }
        private notWorking = () => {
            this.setState({
                backendStatus: false,
                processingBackendStatus: false,
            })
        }

        private updateStatus = () => {
            fetch(
                Endpoints.Server + Endpoints.Status,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                    method: 'GET',
                    mode: 'no-cors',
                    referrer: 'no-referrer',
                })
                .then(response => {
                    if (!response.ok) {
                        this.setState({backendStatus: false});
                    }
                    else {
                        this.setState({backendStatus: true});
                    }
                    return response
                })
                .catch(() => this.notWorking())
                fetch(
                    Endpoints.Server + Endpoints.Status + RetipyObjects.ProcessingBackendStatus,
                    {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                        },
                        method: 'GET',
                        mode: 'no-cors',
                        referrer: 'no-referrer',
                    })
                    .then(response2 => {
                        if(!response2.ok)
                        {
                            this.setState({processingBackendStatus: false})
                        }
                        else
                        {
                            this.setState({processingBackendStatus: true})

                        }

                    })
                    .catch(() => this.setState({processingBackendStatus: false}))
            }
    }
);

export default About;
