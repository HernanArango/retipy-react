import { createStyles, Grid, List, ListItem, ListItemText, Paper, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import * as React from 'react';
import { Redirect } from 'react-router';
import { EvaluationStatus } from "./Evaluation";
import { IEvaluationSimple } from './EvaluationList';

const styles = (theme: Theme) => createStyles({
    button: {
        margin: theme.spacing.unit,
    },
    paper: {
        color: theme.palette.text.secondary,
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
    },
});

interface IEvaluationViewState {
    isRedirect: boolean,
    redirect: string,
}

interface IEvaluationViewProps extends WithStyles<typeof styles> {
    evaluationList: IEvaluationSimple[],
    toast: (message: string) => any,
}

const EvaluationListView = withStyles(styles)(
    class extends React.Component<IEvaluationViewProps, IEvaluationViewState>{
        constructor(props: IEvaluationViewProps) {
            super(props);
            this.state = {
                isRedirect: false,
                redirect: "",
            };
        }

        public render() {
            const { classes } = this.props;
            return(
                <Grid item={true} lg={6} md={12} sm={12} xs={12}>
                    {this.state.isRedirect && <Redirect to={this.state.redirect}/>}
                    <Paper className={classes.paper}>
                        <Typography variant="display1">
                            Evaluation List
                        </Typography>
                        <List>
                            {this.renderEvaluationList()}
                        </List>
                    </Paper>
                </Grid>
            );
        }

        private handleEvaluationRedirect = (id: number, status: EvaluationStatus) =>
        (event: React.MouseEvent<HTMLElement>) => {
            if (status === EvaluationStatus.Complete) {
                this.setState({
                    isRedirect: true,
                    redirect: `/evaluation/${id}`
                });
            }
            else {
                this.props.toast(`${status}`);
                // this.props.toast("Selected Evaluation is not Completed");
            }
        }

        private renderEvaluationList = () =>  {
            const {evaluationList} = this.props;
            const renderedList: JSX.Element[] = [];
            for (const evaluation of evaluationList){
                renderedList.push(
                    <ListItem
                        button={true}
                        key={evaluation.id}
                        onClick={this.handleEvaluationRedirect(
                            evaluation.id, evaluation.status)}
                    >
                        <ListItemText
                            key={evaluation.id}
                            primary={evaluation.name}
                            secondary={evaluation.status}
                        />
                    </ListItem>
                );
            }
            return renderedList;
        }
    }
);

export default EvaluationListView;
