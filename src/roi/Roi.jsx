import React, { Component } from "react";
import { Rect, Text } from "react-konva";

export default class Roi extends Component
{
  constructor(props)
  {
    super(props);
    const size_x = props.x2 - props.x1;
    const size_y = props.y2 - props.y1;
    this.state = {
      tooltip: props.tooltip,
      text: props.text,
      visible: false,
      key: props.id,
      size_x: size_x,
      size_y: size_y,
      label_x: this.props.x1 + size_x/4,
      label_y: this.props.y1 + size_y/3
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
      roi.setState({ visible: true, label_x: pointer.x + 10, label_y: pointer.y + 10 })
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
      <Rect ref={this.setRoiReference}
        key={"r" + this.state.key}
        x={this.props.x1}
        y={this.props.y1}
        width={this.state.size_x}
        height={this.state.size_y}
        fill={this.props.color}
        opacity={this.props.opacity}
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
};
