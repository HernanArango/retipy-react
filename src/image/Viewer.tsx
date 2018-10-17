import { Grid, Paper, Typography } from '@material-ui/core';
import * as Konva from "konva";
import * as React from 'react';
import { Image, Layer, Line, Stage } from "react-konva";
import PolyRoi, { IDisplayRoi } from './Roi';

interface IViewerProps {
    classes: any,
    imageWidth: number,
    imageHeight: number,
    displayImage: HTMLImageElement,
    setImageReference: (reference: Konva.Image | null) => void,
    newRoiPoints: number[],
    isAddingRoi: boolean,
    rois: IDisplayRoi[],
    handleMouseDown: () => any,
}

export default class Viewer extends React.Component<IViewerProps> {
    public render() {
        return (
            <Grid item={true} lg={7} md={12} sm={12} xs={12} > {/* Konva div */}
                <Grid container={true} justify="center">
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
                </Grid>
            </Grid>
        );
    }

    private renderExistingRoi = () => {
        const renderedRoi: JSX.Element[] = [];
        for (const currentRoi of this.props.rois) {
            renderedRoi.push(<PolyRoi
                id={currentRoi.id}
                tooltip={String(currentRoi.id)}
                text={currentRoi.notes}
                key={currentRoi.id}
                points={currentRoi.displayP}
                visible={true}
                color={currentRoi.color} />);
        }
        return renderedRoi;
    }
}
