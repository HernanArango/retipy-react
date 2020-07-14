import { Button, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import * as React from 'react';
import { Redirect } from 'react-router';

const styles = (theme: Theme) => createStyles({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
});

interface IRedirectorState {
    isRedirect: boolean,
}

interface IRedirectorProps extends WithStyles<typeof styles> {
    redirect: string,
    text: string,
}

const Redirector = withStyles(styles)(
    class extends React.Component<IRedirectorProps, IRedirectorState>{
        constructor(props: IRedirectorProps) {
            super(props);

            this.state = {
                isRedirect: false,
            }
        }

        public render() {
            const { classes } = this.props;
            return (
                <div>
                    {this.state.isRedirect && <Redirect to={this.props.redirect} />}
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.button}
                        onClick={this.handleRedirect}
                    >
                        <ArrowBackIcon className={classes.leftIcon} />
                        {this.props.text}
                    </Button>
                </div>
            );
        }

        private handleRedirect = () => {
            this.setState({
                isRedirect: true,
            });
        }
    }
);

export default Redirector;
