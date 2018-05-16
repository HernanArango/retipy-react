import React, { Component } from "react";
import { Line, Text } from "react-konva";

export default class PolyRoi extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      tooltip: props.tooltip,
      text: props.text,
      visible: false,
      key: props.id,
      points: props.points
    }
  }

  componentDidMount()
  {
    const roi = this;
    const rect = this.refs.iRoi;
    const stage = rect.getStage();
    rect.on("mousemove", function(){
      const pointer = stage.getPointerPosition();
      roi.setState({ visible: true, label_x: pointer.x + 10, label_y: pointer.y + 10 })
    });
    rect.on("mouseout", function()
    {
      roi.setState({ visible: false })
    });
  }

  setPoints(points)
  {
    this.setState({points: points});
  }

  render()
  {
    return(
      [
      <Line ref="iRoi"
        points={this.state.points}
        key={"r" + this.state.key}
        closed={true}
        fill="black"
        opacity={0.5}
      />,
      <Text
        key={"t" + this.state.key}
        text={this.state.text}
        visible={this.state.visible}
        position={{x: this.state.label_x, y: this.state.label_y}}
        textFill="white"
        fill="white"
        shadowColor="black"
        shadowOpacity={1}
        fontSize={16}
        ref={"tooltip"}
      />
      ]
    );
  }
}
