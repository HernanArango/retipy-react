import * as React from "react";
import { Line, Text } from "react-konva";
export interface IRoi {
    color: string,
    notes: string,
    x: number[],
    y: number[],
}

export interface IDisplayRoi extends IRoi {
    displayP: number[],
    id: number,
    disabled: boolean,
}

interface IPolyRoiState {
    key: number,
    points: number[],
    text: string,
    tooltip: string,
    tooltipX: number,
    tooltipY: number,
}

interface IPolyRoiProps {
    color: string,
    id: number,
    fillVisible: boolean,
    points: number[],
    text: string,
    tooltip: string,
    tooltipVisible: boolean,
    visible: boolean,
}

export default class PolyRoi extends React.Component<IPolyRoiProps, IPolyRoiState>
{
    constructor(props: IPolyRoiProps) {
        super(props);

        const pointLength = props.points.length;
        let xmin = Number.MAX_SAFE_INTEGER;
        let ymin = Number.MAX_SAFE_INTEGER;
        let xmax = 0;
        let ymax = 0;
        for (let i=0; i < pointLength; i=i+2) {
            if (xmin > props.points[i]) {
                xmin = props.points[i];
            }
            if (ymin > props.points[i+1]) {
                ymin = props.points[i + 1];
            }
            if (xmax < props.points[i]) {
                xmax = props.points[i];
            }
            if (ymax < props.points[i+1]) {
                ymax = props.points[i + 1];
            }
        }
        if (pointLength > 2) {
            xmin += (xmax - xmin)/2
            ymin += (ymax - ymin)/2
        }

        this.state = {
            key: props.id,
            points: props.points,
            text: props.text,
            tooltip: props.tooltip,
            tooltipX: xmin - 10,
            tooltipY: ymin - 10,
        }
    }

    public render(): JSX.Element[] {
        return(
            [
            <Line
                points={this.state.points}
                key={"r" + this.state.key}
                closed={true}
                fill={this.props.color}
                fillEnabled={this.props.fillVisible}
                opacity={0.5}
                stroke="black"
                strokeWidth={1}
            />,
            <Text
                key={"t" + this.state.key}
                x={this.state.tooltipX}
                y={this.state.tooltipY}
                text={this.state.text}
                visible={this.props.tooltipVisible}
                fill="white"
                shadowColor="black"
                shadowOpacity={1}
                fontSize={16}
            />
            ]
        );
    }
}
