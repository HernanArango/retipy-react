import * as React from "react";
import { Line, Text } from "react-konva";

interface IPolyRoiState {
  isTooltipVisible: boolean,
  key: number,
  points: number[],
  text: string,
  tooltip: string,
  tooltipX: number,
  tooltipY: number,
}

interface IPolyRoiProps {
  id: number,
  points: number[],
  text: string,
  tooltip: string,
  visible: boolean,
}

export default class PolyRoi extends React.Component<IPolyRoiProps, IPolyRoiState>
{
  private roiReference:any = null;

  constructor(props: IPolyRoiProps) {
    super(props);

    this.state = {
      isTooltipVisible: false,
      key: props.id,
      points: props.points,
      text: props.text,
      tooltip: props.tooltip,
      tooltipX: 0,
      tooltipY: 0
    }
  }

  public componentDidMount(): void {
    const stage = this.roiReference.getStage();
    this.roiReference.on("mousemove", this.updateTooltipPosition(stage));
    this.roiReference.on("mouseout", this.hideTooltip());
  }

  public render(): JSX.Element[] {
    return(
      [
      <Line ref={this.setRoiReference}
        points={this.state.points}
        key={"r" + this.state.key}
        closed={true}
        fill="black"
        opacity={0.5}
      />,
      <Text
        key={"t" + this.state.key}
        x={this.state.tooltipX}
        y={this.state.tooltipY}
        text={this.state.text}
        visible={this.state.isTooltipVisible}
        fill="white"
        shadowColor="black"
        shadowOpacity={1}
        fontSize={16}
      />
      ]
    );
  }

  private hideTooltip = () => {
    this.setState({
      isTooltipVisible: false
    });
  }

  private updateTooltipPosition = (stage: any) => {
    const pointer = stage.getPointerPosition();
    this.setState({
      isTooltipVisible: true,
      tooltipX: pointer.x + 10,
      tooltipY: pointer.y + 10,
    });
  }

  private setRoiReference = (element:any) => {
    this.roiReference = element
  }
}
