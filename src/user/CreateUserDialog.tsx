import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Theme, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { IAuthProps } from '../common/IAuthProps';
import { Endpoints } from '../configuration/Endpoints';
import { Role } from './Roles';

const styles = (theme: Theme) =>
    createStyles({
        button: {
            justify: 'center',
            margin: theme.spacing() * 2,
        },
        textField: {
            marginLeft: theme.spacing(),
            marginRight: theme.spacing(),
        },
    });

interface INewUserHandlerProps extends WithStyles<typeof styles>, IAuthProps {
    closeDialog: () => void,
    open: boolean,
}

interface INewUserHandlerState {
    confirmPassword: string,
    identity: string,
    name: string,
    password: string,
    passwordHasError: boolean,
    role: Role,
    username: string,
}

const CreateUserDialog = withStyles(styles)(
    class extends React.Component<INewUserHandlerProps, INewUserHandlerState> {
        constructor(props: INewUserHandlerProps) {
            super(props);
            this.state = {
                confirmPassword: "",
                identity: "",
                name: "",
                password: "",
                passwordHasError: false,
                role: Role.Resident,
                username: "",
            }
        }

        public render() {
            const { classes, open } = this.props;
            return (
                <Dialog
                    open={open}
                    onClose={this.props.closeDialog}>
                    <DialogTitle>Create new User</DialogTitle>
                    <DialogContent>
                        <Grid container={true} justify="center">
                            <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                            <TextField
                                    required={true}
                                    className={classes.textField}
                                    id="identity"
                                    label="Identity"
                                    fullWidth={true}
                                    value={this.state.identity}
                                    onChange={this.handleIdentityFieldChange}
                                />
                            </Grid>
                            <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                            <TextField
                                    required={true}
                                    className={classes.textField}
                                    id="name"
                                    label="Name"
                                    fullWidth={true}
                                    value={this.state.name}
                                    onChange={this.handleNameFieldChange}
                                />
                            </Grid>

                            <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                            <TextField
                                    required={true}
                                    className={classes.textField}
                                    id="roles"
                                    label="Roles"
                                    fullWidth={true}
                                    value={this.state.role}
                                    onChange={this.handleRoleFieldChange}
                                    select={true}
                            >
                                <MenuItem value={Role.Doctor}>{Role.Doctor}</MenuItem>
                                <MenuItem value={Role.Resident}>{Role.Resident}</MenuItem>
                            </TextField>
                            </Grid>
                            <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                            <TextField
                                    required={true}
                                    className={classes.textField}
                                    id="username"
                                    label="Username"
                                    fullWidth={true}
                                    value={this.state.username}
                                    onChange={this.handleUsernameFieldChange}
                                />
                            </Grid>
                            <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                                <TextField
                                    required={true}
                                    className={classes.textField}
                                    id="password"
                                    label="Password"
                                    type="password"
                                    fullWidth={true}
                                    value={this.state.password}
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
                            onClick={this.handleCreateUser}
                        >
                            Create User
                        </Button>
                    </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.props.closeDialog}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }

        private handleCreateUser = () => {
            if (this.state.passwordHasError) {
                this.props.toast("Invalid Password");
            }
            else {
                fetch(
                    Endpoints.Server + Endpoints.User + "/new",
                    {
                        body: JSON.stringify(this.state),
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': this.props.token,
                            'content-type': 'application/json',
                        },
                        method: 'POST',
                        mode: 'cors',
                        referrer: 'no-referrer',
                    })
                    .then(response => response.json())
                    .then(response => {
                    if (response.status === 400) {
                        this.props.toast(response.message);
                    }
                    else {
                        this.props.toast("User created successfully")
                        this.props.closeDialog()
                    }
                    });
            }
        }

        private handleIdentityFieldChange =
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            this.setState({
                identity: event.target.value,
            })
        }

        private handleNameFieldChange =
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            this.setState({
                name: event.target.value,
            })
        }

        private handleRoleFieldChange =
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            this.setState({
                role: Role[event.target.value],
            })
        }

        private handleUsernameFieldChange =
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            this.setState({
                username: event.target.value,
            })
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
                password: event.target.value,
            })
        }
        private handleConfirmPasswordChange =
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            if (event.target.value === this.state.password) {
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
    }
);

export default CreateUserDialog;
