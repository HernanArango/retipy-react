import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Image, Text } from "react-konva";
import { Configuration as CNF } from './Configuration.js';

const getId = (id) => {
  var endpoint = (id) => `${CNF.EVALUATION_ENDPOINT}/${id}`
  return fetch(CNF.REST_URL + endpoint(id), {
    method: 'GET',
    mode: 'cors',
    referrer: 'no-referrer',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json'
    }})
    .then(response => response.json())
}

class Roi extends Component
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

  render()
  {
    return(
      [

      <Rect ref="iRoi"
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
}

class Result extends Component
{
  handleClick = () => {
    console.log(this.state.name);
  }

  constructor(props)
  {
    super(props)
    this.state =
    {
      name: props.name,
      data: props.data,
      image: props.image
    }
  }

  render()
  {
    console.log(this.state.data)
    return(
      <div>
        <label>Image: {this.state.name}</label>
      <Stage width={this.state.image.width} height={this.state.image.height}>
        <Layer>
          <Image image={this.state.image} />
        </Layer>
        <Layer>
          {this.state.data}
        </Layer>
      </Stage>
    </div>
    );
  }
}

export default class RetinalEvaluation extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      id: props.id,
      uri: "",
      results: [],
      selection: props.selection,
      block: true
    };
  }

  componentDidMount()
  {
    getId(this.state.id).then(data => {
      var results = [];
      // process the result array
      for (var i = 0; i < data.results.length; i++)
      {
        var currentResultData = data.results[i];
        // process the internal Roi objects
        var roiList = [];
        for (var roiIndex=0; roiIndex < currentResultData.data.length; roiIndex++)
        {
          var currentRoi = <Roi
            key={roiIndex}
            id={roiIndex}
            x1={currentResultData.data[roiIndex].roi_x[0]}
            x2={currentResultData.data[roiIndex].roi_x[3]}
            y1={currentResultData.data[roiIndex].roi_y[0]}
            y2={currentResultData.data[roiIndex].roi_y[3]}
            color={Konva.Util.getRandomColor()}
            opacity={0.5}
            text={currentResultData.data[roiIndex].description} />;
          roiList.push(currentRoi);
        }
        // we reverse the list so we print first the bottom right Roi first, to avoid tooltip overlap
        roiList.reverse();
        // load the result image in memory
        var currentImage = document.createElement('img');
        // eslint-disable-next-line
        currentImage.onload = () => // wait for the image to load to update the state
        {
          var currentResult = <Result
          name={currentResultData.name}
          data={roiList}
          image={currentImage} />;
          results.push(currentResult);
          this.setState({uri: data.uri, results: results, block: false});
        }
        currentImage.src = "data:image/png;base64," + currentResultData.image;
      }
    });
  }

  render()
  {
    for(var i=0; i < this.state.results.length; i++)
    {

    }
    return(
      <div>
        {this.state.results[this.state.selection]}
      </div>
     );
  }
}
