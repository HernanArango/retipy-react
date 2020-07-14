import { Button, Checkbox, createStyles, Grid, List, ListItem, ListItemText, Paper, Theme, Typography, withStyles, WithStyles } from "@material-ui/core";
import * as React from 'react';
import { IAuthProps } from "../../common/IAuthProps";
import { IPerson } from "../../common/IPerson";
import { Endpoints } from "../../configuration/Endpoints";

const styles = (theme: Theme) =>
    createStyles({
        button: {
            justify: 'center',
            margin: theme.spacing(),
        },
        paper: {
            color: theme.palette.text.secondary,
            padding: theme.spacing() * 2,
            textAlign: 'left',
        },
        textField: {
            marginLeft: theme.spacing(),
            marginRight: theme.spacing(),
            width: 200,
        },
    });

interface IResidentHandlerProps extends WithStyles<typeof styles>, IAuthProps {
}

interface IResidentHandlerState {
    residentList: IPerson[],
    selectedResidents: number[],
}

const ResidentHandler = withStyles(styles)(
    class extends React.Component<IResidentHandlerProps, IResidentHandlerState> {
        public constructor(props: IResidentHandlerProps) {
            super(props);
            this.state = {
                residentList: [],
                selectedResidents: []
            }
            if (this.props.token !== "") {
                this.fetchSelectedResidents();
                this.fetchExistingResidents();
            }
        }

        public render() {
            return (
                <Paper className={this.props.classes.paper}>
                <Grid container={true} justify="center" >
                    <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                        <Typography variant="subtitle1">
                            Assigned Residents
                        </Typography>
                    </Grid>

                    <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                        <List>
                            {this.renderResidents(this.state.selectedResidents)}
                        </List>
                    </Grid>
                    <Grid item={true} lg={11} md={11} sm={11} xs={11} >
                        <Button
                            variant="contained"
                            color="default"
                            className={this.props.classes.button}
                            onClick={this.handleUpdateResidents}
                        >
                            Update Assigned Residents
                        </Button>
                    </Grid>
                </Grid>
                </Paper>
            );
        }

        private fetchSelectedResidents = () => {
            fetch(
                Endpoints.Server + Endpoints.Staff + "/doctor/residents",
                {
                    headers:
                    {
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': this.props.token,
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                    mode: 'cors',
                    referrer: 'no-referrer',
                }
            ).then(response => {
                if(!response.ok) {
                    throw new Error("Error when retrieving existing residents");
                }
                else {
                    return response.json();
                }
            }).then(json => {
                this.setState({
                    selectedResidents: json.residents,
                })
            }).catch(error => this.props.toast(error.message));
        }

        private fetchExistingResidents = () => {
            fetch(
                Endpoints.Server + Endpoints.Staff + "/resident",
                {
                    headers:
                    {
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': this.props.token,
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                    mode: 'cors',
                    referrer: 'no-referrer',
                }
            ).then(response => {
                if(!response.ok) {
                    throw new Error("Error when retrieving existing residents");
                }
                else {
                    return response.json();
                }
            }).then(json => {
                this.setState({
                    residentList: json,
                })
            }).catch(error => this.props.toast(error.message));
        }

        private handleResidentSelection = (residentId: number) => (event: React.MouseEvent<HTMLElement>) => {
            if (this.state.selectedResidents.indexOf(residentId) > -1) {
                this.setState({
                    selectedResidents: this.state.selectedResidents.filter(it => it !== residentId),
                })
            }
            else {
                this.setState({
                    selectedResidents: this.state.selectedResidents.concat(residentId),
                });
            }
        }

        private handleUpdateResidents = (event: React.MouseEvent<HTMLElement>) => {
            fetch(
                Endpoints.Server + Endpoints.Staff + "/doctor/residents",
                {
                    body: JSON.stringify({
                        residents: this.state.selectedResidents,
                    }),
                    headers:
                    {
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': this.props.token,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    mode: 'cors',
                    referrer: 'no-referrer',
                }
            ).then(response => {
                if(!response.ok) {
                    throw new Error("Error when saving selected residents");
                }
                else {
                    this.props.toast("Selected residents saved successfully")
                }
            }).catch(error => this.props.toast(error.message));
        }

        private renderResidents = (residents: number[]) => {
            const { residentList } = this.state;
            const result:JSX.Element[] = []
            for (let i = 0; i < residentList.length; i++) {
                result.push(
                        <ListItem key={i} >
                            <Checkbox
                                checked={residents.indexOf(residentList[i].id) > -1}
                                onClick={this.handleResidentSelection(residentList[i].id)}
                            />
                            <ListItemText key={i} primary={residentList[i].name} secondary={residentList[i].identity}/>
                        </ListItem>
                )
            }
            return result;
        }
    }
);

export default ResidentHandler;