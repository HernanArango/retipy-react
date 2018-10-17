import { Button, createStyles, Grid, TextField, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { IAuthProps } from '../../common/IAuthProps';
import { Endpoints } from '../../configuration/Endpoints';

const styles = (theme: Theme) =>
    createStyles({
        button: {
            justify: 'center',
            margin: theme.spacing.unit * 2,
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
        },
    });

interface IPasswordHandlerProps extends WithStyles<typeof styles>, IAuthProps {
    closeDialog: () => void,
}

interface IPasswordHandlerState {
    confirmPassword: string,
    newPassword: string,
    oldPassword: string,
    passwordHasError: boolean,
}

const PasswordHandler = withStyles(styles)(
    class extends React.Component<IPasswordHandlerProps, IPasswordHandlerState> {
        constructor(props: IPasswordHandlerProps) {
            super(props);
            this.state = {
                confirmPassword: "",
                newPassword: "",
                oldPassword: "",
                passwordHasError: false,
            }
        }

        public render() {
            const { classes } = this.props;
            return(
                <Grid container={true} justify="center">
                    <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                        <Typography variant="subtitle1">
                            Change Password
                        </Typography>
                    </Grid>
                    <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                        <TextField
                            required={true}
                            className={classes.textField}
                            id="oldPassword"
                            label="Old Password"
                            type="password"
                            fullWidth={true}
                            value={this.state.oldPassword}
                            onChange={this.handleOldPasswordFieldChange}
                        />
                    </Grid>
                    <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                        <TextField
                            required={true}
                            className={classes.textField}
                            id="newPassword"
                            label="New Password"
                            type="password"
                            fullWidth={true}
                            value={this.state.newPassword}
                            onChange={this.handlePasswordFieldChange}
                            error={this.state.passwordHasError}
                        />
                    </Grid>
                    <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                        <TextField
                            required={true}
                            className={classes.textField}
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            fullWidth={true}
                            value={this.state.confirmPassword}
                            onChange={this.handleConfirmPasswordChange}
                            error={this.state.passwordHasError}
                        />
                    </Grid>
                    <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                        <Button
                            variant="contained"
                            color="default"
                            className={classes.button}
                            onClick={this.handleUpdatePassword}
                        >
                            Update Password
                        </Button>
                    </Grid>
                </Grid>
            );
        }

        private handlePasswordFieldChange =
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            if (this.state.confirmPassword !== "") {
                if (event.target.value === this.state.confirmPassword) {
                    this.setState({
                        passwordHasError: false,
                    })
                }
                else {
                    this.setState({
                        passwordHasError: true,
                    })
                }
            }
            this.setState({
                newPassword: event.target.value,
            })
        }
        private handleConfirmPasswordChange =
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            if (event.target.value === this.state.newPassword) {
                this.setState({
                    passwordHasError: false,
                });
            }
            else {
                this.setState({
                    passwordHasError: true,
                })
            }
            this.setState({
                confirmPassword: event.target.value,
            })
        }

        private handleOldPasswordFieldChange =
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                this.setState({
                    oldPassword: event.target.value,
                });
        }

        private handleUpdatePassword = () => {
            if (this.state.passwordHasError) {
                this.props.toast("Invalid Password");
            }
            else {
                fetch(
                    Endpoints.Server + Endpoints.User + "/password",
                    {
                        body: JSON.stringify({
                            "newPassword": this.state.newPassword,
                            "oldPassword": this.state.oldPassword,

                        }),
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': this.props.token,
                            'content-type': 'application/json',
                        },
                        method: 'POST',
                        mode: 'cors',
                        referrer: 'no-referrer',
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw Error("Old password does not match");
                        }
                        this.props.toast("Password Changed")
                        this.props.closeDialog()
                    })
                    .catch(error => this.props.toast(error.message));
            }
        }
    }
);

export default PasswordHandler;