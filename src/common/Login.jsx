import React from 'react';
import { Grid, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, withStyles, Typography } from '@material-ui/core';
import {Configuration as CNF} from "../Configuration";
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';


const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        paddinVertical: theme.spacing.unit * 100,
        width: 200,
    },
    button: {
      margin: theme.spacing.unit,
      justify: 'center',
    },
});


class Login extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props)
    {
        super(props);

        const { cookies, handleChange } = props;
        const token = cookies.get('token');
        const username = cookies.get('username');
        if (token !== undefined)
        {
            handleChange('loginOpen', false);
            handleChange('token', token);
            handleChange('username', username);
        }
        this.state =
        {
            error: false,
            username: "",
            password: "",
            open: props.open,
        };
    }

    handleChange = name => event => {
        this.setState(
            {
                [name]: event.target.value
            })
    }

    handleEnterKey = (e) => {
        if (e.keyCode === 13)
        {
            this.handleLogin()
        }};

    handleLogin = () => {
        this.setState({error: false});
        const {username, password} = this.state;
        fetch(CNF.REST_URL + CNF.LOGIN_ENDPOINT,
            {
                method: 'POST',
                mode: 'cors',
                referrer: 'no-referrer',
                body: JSON.stringify({"username": username, "password": password}),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'content-type': 'application/json'
            }})
            .then(response => {
                if (!response.ok)
                {
                    throw Error(response.statusText)
                }
                return response.text();
            })
            .then(body => {
                const { cookies } = this.props;
                cookies.set('token', body, { path: '/' });
                cookies.set('username', username, { path: '/' });
                this.setState({password: ""});
                this.props.handleChange('loginOpen', false);
                this.props.handleChange('token', body);
                this.props.handleChange('username', username);
                this.props.handleChange('toastMessage', `Welcome, ${username}`);
                this.props.handleChange('toastOpen', true);
            })
            .catch(reason => this.setState({error: true}))
    }

    render()
    {
        const { classes, open } = this.props
        return(
            <Dialog
                open={open}
                onClose={() => false}>
                <DialogTitle>Retipy - Log In</DialogTitle>
                <DialogContent>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <form>
                            <TextField
                                id="login-username"
                                label="Username"
                                className={classes.textField}
                                value={this.state.username}
                                onChange={this.handleChange('username')}
                            />
                            <TextField
                                id="login-password"
                                label="Password"
                                className={classes.textField}
                                type="password"
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                autoComplete="current-password"
                                onKeyDown={this.handleEnterKey}
                            />
                        </form>
                    </Grid>
                    {this.state.error &&
                    <Grid item lg={12} md={12} sm={12} xs={12}>
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
}

export default withCookies(withStyles(styles)(Login));
