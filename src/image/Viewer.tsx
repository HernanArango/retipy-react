import { CircularProgress, createStyles, Grid, Paper, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';
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
}

const Viewer = withStyles(styles)(
    class extends React.Component<IViewerProps> {
        public render() {
            const { classes } = this.props;
            return (
                <Grid item={true} lg={7} md={12} sm={12} xs={12} > {/* Konva div */}
                    <Grid container={true} justify="center">
                        {!this.props.isImageLoaded &&
                            <Paper className={this.props.classes.paper}>
                                <CircularProgress className={classes.progress} />
                            </Paper>
                        }
                        {this.props.isImageLoaded &&
                            <Paper className={this.props.classes.paper}>
                                <Typography variant="h4">Diagnostic</Typography>
                                <Stage
                                    width={this.props.imageWidth}
                                    height={this.props.imageHeight}
                                    onContentClick={this.props.handleMouseDown}
                                    onContentTouchStart={this.props.handleMouseDown}
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
                            </Paper>
                        }
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
                        color={currentRoi.color} />);
                }
            }
            return renderedRoi;
        }
    });

export default Viewer;
