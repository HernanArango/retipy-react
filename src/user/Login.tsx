import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@material-ui/core";
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as Cookies from 'es-cookie';
import * as React from "react";

import { Endpoints } from "../configuration/Endpoints";

const styles = (theme: Theme) =>
    createStyles({
        button: {
            justify: 'center',
            margin: theme.spacing.unit,
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            width: 200,
        },
    });

interface ILoginState {
    hasError: boolean,
    password: string,
    username: string,
}

interface ILoginProps extends WithStyles<typeof styles> {
    open: boolean,
    closeDialog: () => void,
    setLoginData: (username: string, token: string) => void,
}

const Login = withStyles(styles)(
    class extends React.Component<ILoginProps, ILoginState> {
        constructor(props: ILoginProps) {
            super(props);
            this.state = {
                hasError: false,
                password: "",
                username: "",
            }
        }

        public render() {
            const { classes, open } = this.props
            return (
                <Dialog
                    open={open}
                    onClose={this.props.closeDialog}>
                    <DialogTitle>Retipy - Log In</DialogTitle>
                    <DialogContent>
                        <Grid item={true} lg={12} md={12} sm={12} xs={12}>
                            <form>
                                <TextField
                                    id="login-username"
                                    label="Username"
                                    autoComplete="username"
                                    className={classes.textField}
                                    value={this.state.username}
                                    onChange={this.setUsername}
                                />
                                <TextField
                                    id="login-password"
                                    label="Password"
                                    className={classes.textField}
                                    type="password"
                                    autoComplete="current-password"
                                    value={this.state.password}
                                    onChange={this.setPassword}
                                    onKeyDown={this.handleEnterKey}
                                />
                            </form>
                        </Grid>
                        {this.state.hasError &&
                            <Grid item={true} lg={12} md={12} sm={12} xs={12}>
                                <Typography>Error when logging in</Typography>
                            </Grid>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button className={classes.button} onClick={this.handleLogin}>
                            Log In
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }

        private handleEnterKey = (e: React.KeyboardEvent<Element>) => {
            if (e.keyCode === 13) {
                this.handleLogin()
            }
        };

        private handleLogin = () => {
            this.setState({ hasError: false });
            const body: any ={username: this.state.username, password: this.state.password}
            fetch(
                Endpoints.Server + Endpoints.Login,
                {
                    body: JSON.stringify(body),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    mode: 'cors',
                    referrer: 'no-referrer',
                    })
                .then(response => {
                    if (!response.ok)
                    {
                        throw Error(response.statusText)
                    }
                    return response.text();
                })
                .then(token => {
                    Cookies.set('token', token);
                    Cookies.set('username', this.state.username);
                    this.setState({ password: "" });
                    this.props.setLoginData(this.state.username, token)
                })
                .catch(() => this.setState({ hasError: true }))
        }

        private setUsername = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            this.setState(
                {
                    username: event.target.value
                })
        }

        private setPassword = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            this.setState(
                {
                    password: event.target.value
                })
        }
    }
);

export default Login;
