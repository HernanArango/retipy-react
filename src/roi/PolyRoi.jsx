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
      points: props.points,
      label_x: 0,
      label_y: 0
    }
  }

  roiReference = null;

  setRoiReference = element => { this.roiReference = element }

  componentDidMount()
  {
    const roi = this;
    const stage = this.roiReference.getStage();
    this.roiReference.on("mousemove", function(){
      const pointer = stage.getPointerPosition();
      roi.setState({ visible: true, label_x: pointer.x + 10, label_y
        : pointer.y + 10 })
    });
    this.roiReference.on("mouseout", function()
    {
      roi.setState({ visible: false })
    });
  }

  render()
  {
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
