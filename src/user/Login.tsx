import { Button, createStyles, Grid, TextField, Typography } from "@material-ui/core";
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
    setLoginData: (token: string) => void,
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
            const { classes } = this.props
            return (
                <Grid container={true}>
                    <Grid item={true} lg={11} md={11} sm={11} xs={11}>
                        <Typography variant="subtitle1">
                            Log In
                        </Typography>
                    </Grid>
                    <Grid item={true} lg={11} md={11} sm={11} xs={11}>
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
                            <Grid item={true} lg={11} md={11} sm={11} xs={11}>
                                <Typography>Error when logging in</Typography>
                            </Grid>
                        }
                        <Grid item={true}>
                            <Button
                                className={classes.button}
                                onClick={this.handleLogin}
                                variant="contained"
                            >
                                Log In
                            </Button>
                        </Grid>
                </Grid>
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
                Endpoints.Server + Endpoints.User + "/login",
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
                    this.setState({ password: "" });
                    this.props.setLoginData(token)
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
