import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Line, Image, Text } from "react-konva";

class PolyRoi extends Component
{
  constructor(props)
  {
    super(props);
    var points = [];
    for (var i=0; i < props.x_coordinates; i++)
    {
        points.push(props.x_coordinates[i]);
        points.push(props.y_coordinates[i]);
    }
    this.state = {
      tooltip: props.tooltip,
      text: props.text,
      visible: false,
      key: props.id,
      points: points
    }
  }

  render()
  {
    return(
      <Line ref="iRoi"
        points={this.state.points}
        key={"r" + this.state.key}
        fill={this.props.color}
        opacity={this.props.opacity}
      />
    );
  }
}

class Diagnostic extends Component
{
  state =
  {
    id: 0,
    width: 0,
    height: 0,
    notes: "",
    rois: [],
    diagnostic: ""
  }

  constructor(props)
  {
    super(props);
    this.state.id = props.id;

  }

  componentDidMount()
  {
    const canvas = document.createElement("canvas");
    canvas.width = this.state.width;
    canvas.height = this.state.height;
    const context = canvas.getContext("2d");
    this.setState({ canvas, context });

    //TODO: get the diagnostic here

    const image = document.createElement('img');
    image.onload = () =>
    {
      context.drawImage(image, 0, 0);
    }
    image.src = "data:image/png;base64,01823y01824yh917";



    this.setState({ canvas });
  }

  handleMouseDown = () =>
  {
    console.log("clicked");
    const stage = this.image.getStage();
    const point = stage.getPointerPosition();
  }

  render()
  {
    const { canvas } = this.state;
    console.log("canvas", canvas);
    return(
      <div>
        <div> {/* Konva div */}
          <Stage width={this.state.width} height={this.state.height}>
            <Layer>
              <Image
                image={this.state.image}
                />
            </Layer>
            <Layer>
              <Image
                image={canvas}
                ref={node => (this.image = node)}
                width={this.state.width}
                height={this.state.height}
                onMouseDown={this.handleMouseDown}
              />
            </Layer>
          </Stage>
        </div>
        <div>
        </div>
      </div>
    );
  }
}
