import { Button, createStyles, Divider, Grid, List, ListItem, ListItemText, Paper, TextField, Typography } from "@material-ui/core";
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as React from "react";
import { Redirect } from "react-router";
import { IAuthProps } from "../common/IAuthProps";
import { Endpoints } from "../configuration/Endpoints";

const styles = (theme: Theme) =>
    createStyles({
        button: {
            alignContent: 'right',
            float: 'right',
            margin: theme.spacing.unit,
            paddingLeft: theme.spacing.unit,
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: theme.spacing.unit,
        },
        paper: {
            color: theme.palette.text.secondary,
            padding: theme.spacing.unit,
            textAlign: 'center',
        },
        root: {
            backgroundColor: '#EFEFEF',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            minHeight: window.innerHeight,
            overflow: 'hidden',
        },
        textField: {
            marginRight: theme.spacing.unit,
        },
        title: {
            flexGrow: 1,
            margin: theme.spacing.unit * 2,
        },
    });

interface IPatientListState {
    disabled: boolean,
    inputValue: string,
    isRedirectEnabled: boolean,
    list: any[],
    redirectTarget: number,
}

interface IPatientListProps extends WithStyles<typeof styles>, IAuthProps {

}

const PatientList = withStyles(styles)(
    class extends React.Component<IPatientListProps, IPatientListState> {
        constructor(props: IPatientListProps) {
            super(props);
            this.state = {
                disabled: false,
                inputValue: "",
                isRedirectEnabled: false,
                list: [],
                redirectTarget: -1,
            }
        }
        public componentDidMount() {
            this.fetchPatients(this.props.token);
        }

        public componentDidUpdate(prevProps: IPatientListProps) {
            if (this.props.token !== prevProps.token) {
                this.fetchPatients(this.props.token);
            }
        }

        public render() {
            const { classes } = this.props;
            return (
                <div className={classes.root}>
                    <Grid container={true} spacing={16} className={classes.container} justify={'center'}>
                        <Grid item={true} lg={8} md={10} sm={12} xs={12}>
                            <Grid container={true} spacing={16} justify={'space-around'}>
                                <Grid item={true} lg={9} md={9} sm={8} xs={8}>
                                    <Typography variant="display1" className={classes.title} >Patient List</Typography>
                                </Grid>
                                <Grid item={true} lg={3} md={3} sm={4} xs={4}>
                                    {this.state.isRedirectEnabled && <Redirect to="/patient/0" />}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={this.createPatient}
                                    >
                                        New Patient
                                    </Button>
                                </Grid>
                            </Grid>
                            <Paper className={classes.paper}>
                                <Grid container={true} spacing={16} justify={'space-around'}>
                                    <Grid item={true} lg={11} md={11} sm={11} xs={10}>
                                        <TextField
                                            id="search"
                                            label="Search"
                                            type="search"
                                            className={classes.textField}
                                            margin="normal"
                                            fullWidth={true}
                                            onChange={this.handleSearch}
                                            value={this.state.inputValue.valueOf()}
                                        />
                                    </Grid>
                                    <Grid item={true} lg={12} md={12} sm={12} xs={12}>
                                        <List component="nav" style={{ overflow: 'auto', maxHeight: 370, minHeight: 370 }} >
                                            {this.loadPatients()}
                                        </List>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            );
        }

        private loadPatients = () => {
            const n = this.state.list.length;
            const result = []
            for (let i = 0; i < n; i++) {
                if (this.state.list[i][1].toString().search(this.state.inputValue) >= 0) {
                    result.push(
                        <div key={i}>
                            <ListItem button={true} >
                                {this.state.redirectTarget === this.state.list[i][0] && <Redirect to={`/patient/${this.state.redirectTarget}`} />}
                                <ListItemText primary={this.state.list[i][1]} onClick={this.handleRedirect(this.state.list[i][0])} />
                                {this.state.list[i][2]}
                            </ListItem>
                            <Divider light={true} />
                        </div>);
                }
            }
            return (result);
        }

        private fetchPatients(token: string) {

            if (token !== "") {
                fetch(
                    process.env.REACT_APP_RETIPY_BACKEND_URL + Endpoints.Patient + "/list",
                    {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': token,
                            'content-type': 'application/json',
                        },
                        method: 'GET',
                        mode: 'cors',
                        referrer: 'no-referrer',
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw Error("Not logged in");
                        }
                        return response.json();
                    })
                    .then(data => {
                        const list = [];
                        for (const patient of data.patientList) {
                            list.push(
                                [patient.first, patient.second, patient.third]);
                        }
                        this.setState(
                            {
                                'list': list,
                            });
                    })
                    .catch(error => this.props.toast(error));
            }
        }


        private createPatient = () => this.setState({ isRedirectEnabled: true });

        private handleSearch = () => { this.setState({ inputValue: "" }) };

        private handleRedirect = (id: number) => (event: any) => this.setState({ redirectTarget: id });
    }
);

export default PatientList;
