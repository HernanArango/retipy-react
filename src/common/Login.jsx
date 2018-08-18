import React from 'react';
import { Grid, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, withStyles, Typography } from '@material-ui/core';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';
import { createToken } from '../token/TokenService';


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
        createToken(username, password)
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
            .catch(() => this.setState({error: true}))
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
