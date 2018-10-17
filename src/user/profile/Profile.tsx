import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Theme, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { IAuthProps } from '../../common/IAuthProps';
import Login from '../Login';
import { Role } from '../Roles';
import PasswordHandler from './PasswordHandler';
import ResidentHandler from './ResidentHandler';

const styles = (theme: Theme) =>
    createStyles({

    });

interface IProfileProps extends WithStyles<typeof styles>, IAuthProps {
    closeDialog: () => void,
    open: boolean,
    setLoginData: (token: string) => void,
}

const Profile = withStyles(styles)(
    class extends React.Component<IProfileProps, {}> {
        public render() {
            const { open } = this.props;
            return (
                <Dialog
                    open={open}
                    onClose={this.props.closeDialog}>
                    <DialogTitle>Retipy - Profile Dialog</DialogTitle>
                    <DialogContent>
                        <Grid container={true} justify="center">
                            {this.props.token === "" && // if the user is not logged in

                                <Login setLoginData={this.props.setLoginData} />
                            }
                            {this.props.token !== "" && // when login data is available
                                <PasswordHandler
                                    closeDialog={this.props.closeDialog}
                                    toast={this.props.toast}
                                    token={this.props.token}
                                    user={this.props.user}
                                />
                            }
                            {this.props.user.scope.indexOf(Role.Doctor) !== -1 &&
                                <ResidentHandler
                                    toast={this.props.toast}
                                    token={this.props.token}
                                    user={this.props.user}
                                />
                            }
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
    }
);

export default Profile;