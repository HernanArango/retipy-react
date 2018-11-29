import { CircularProgress, createStyles, FormControlLabel, Grid, Paper, Switch, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';
import * as Konva from "konva";
import * as React from 'react';
import { Image, Layer, Line, Stage } from "react-konva";
import PolyRoi, { IDisplayRoi } from './Roi';

const styles = (theme: Theme) => createStyles({
    progress: {
        margin: theme.spacing.unit * 2,
    },
});
interface IViewerProps extends WithStyles<typeof styles> {
    classes: any,
    imageWidth: number,
    imageHeight: number,
    displayImage: HTMLImageElement,
    isImageLoaded: boolean,
    setImageReference: (reference: Konva.Image | null) => void,
    newRoiPoints: number[],
    isAddingRoi: boolean,
    rois: IDisplayRoi[],
    handleMouseDown: () => any,
    handleMouseMove: () => any,
    handleMouseUp: () => any,
}

interface IViewerState {
    isFillVisible: boolean,
    isTooltipVisible: boolean,
}

const Viewer = withStyles(styles)(
    class extends React.Component<IViewerProps, IViewerState> {
        constructor(props: IViewerProps) {
            super(props);
            this.state = {
                isFillVisible: true,
                isTooltipVisible: true,
            }
        }

        public render() {
            const { classes } = this.props;
            return (
                <Grid item={true} lg={7} md={12} sm={12} xs={12} > {/* Konva div */}
                    <Grid container={true} justify="center">
                        <Paper className={this.props.classes.paper}>
                            <Grid item={true} lg={12} md={12} sm={12} xs={12}>
                                <Typography variant="h4">Diagnostic</Typography>
                            </Grid>
                            <Grid item={true} lg={12} md={12} sm={12} xs={12}>
                                {!this.props.isImageLoaded &&
                                    <CircularProgress className={classes.progress} />
                                }
                                {this.props.isImageLoaded &&
                                    <Stage
                                        width={this.props.imageWidth}
                                        height={this.props.imageHeight}
                                        onContentMouseDown={this.props.handleMouseDown}
                                        onContentTouchStart={this.props.handleMouseDown}
                                        onContentTouchMove={this.props.handleMouseMove}
                                        onContentMouseMove={this.props.handleMouseMove}
                                        onContentMouseUp={this.props.handleMouseUp}
                                        onContentTouchEnd={this.props.handleMouseUp}
                                    >
                                        <Layer>
                                            <Image
                                                image={this.props.displayImage}
                                                ref={this.props.setImageReference}
                                                width={this.props.imageWidth}
                                                height={this.props.imageHeight}
                                            />
                                        </Layer>
                                        <Layer>
                                            <Line
                                                points={this.props.newRoiPoints}
                                                closed={false}
                                                stroke="white"
                                                opacity={0.5}
                                                visible={this.props.isAddingRoi}
                                            />
                                        </Layer>
                                        <Layer>
                                            {this.renderExistingRoi()}
                                        </Layer>
                                    </Stage>
                                }
                            </Grid>
                            <Grid item={true} lg={12} md={12} sm={12} xs={12} >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.isFillVisible}
                                            color="primary"
                                            onChange={this.toggleRoiFill}
                                        />}
                                    label="Roi Fill"
                                />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.isTooltipVisible}
                                            color="primary"
                                            onChange={this.toggleRoiTooltips}
                                        />}
                                    label="Roi Tooltips"
                                />
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            );
        }

        private renderExistingRoi = () => {
            const renderedRoi: JSX.Element[] = [];
            for (const currentRoi of this.props.rois) {
                if (!currentRoi.disabled) {
                    renderedRoi.push(<PolyRoi
                        id={currentRoi.id}
                        tooltip={String(currentRoi.id)}
                        text={currentRoi.notes}
                        key={currentRoi.id}
                        points={currentRoi.displayP}
                        visible={true}
                        color={currentRoi.color}
                        fillVisible={this.state.isFillVisible}
                        tooltipVisible={this.state.isTooltipVisible}
                    />);
                }
            }
            return renderedRoi;
        }

        private toggleRoiFill = () => {
            this.setState({
                isFillVisible: !this.state.isFillVisible,
            })
        }

        private toggleRoiTooltips = () => {
            this.setState({
                isTooltipVisible: !this.state.isTooltipVisible,
            })
        }
    });

export default Viewer;
