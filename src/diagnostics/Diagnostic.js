import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Line, Image, Text } from "react-konva";
import { Configuration as CNF } from "../Configuration.js";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'

const getId = (id) => {
  var endpoint = (id) => `${CNF.DIAGNOSTIC_ENDPOINT}/${id}`
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

class PolyRoi extends Component
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

  setPoints(points)
  {
    this.setState({points: points});
  }

  render()
  {
    return(
      <Line ref="iRoi"
        points={this.state.points}
        key={"r" + this.state.key}
        closed={true}
        fill="black"
        opacity={0.5}
      />
    );
  }
}

export default class Diagnostic extends Component
{
  state =
  {
    id: 0,
    width: 0,
    height: 0,
    notes: "",
    rois: [],
    roiCount: 0,
    diagnostic: "",
    points: [],
    roiText: "",
    addingRoi: false
  }

  constructor(props)
  {
    super(props);
    this.state.id = props.id;
  }

  componentDidMount()
  {

    getId(this.state.id).then(data =>
      {
        const image = document.createElement('img');
        image.onload = () =>
        {
          this.setState({width: image.naturalWidth, height: image.naturalHeight});
          this.setState({ image });
        }
        image.src = "data:image/png;base64," + data.image;
      });
  }

  handleMouseDown = () =>
  {
    if (this.state.addingRoi)
    {
      const stage = this.image.getStage();
      const point = stage.getPointerPosition();
      var currentPoints = this.state.points.slice();
      currentPoints.push(point.x);
      currentPoints.push(point.y);
      console.log(`x:${point.x} y:${point.y}`);
      this.setState( { points: currentPoints } );
    }
  }

  handleAddRoi = () =>
  {
    console.log("enable add roi");
    this.setState({ addingRoi: true });
  }

  handleClearRoi = () =>
  {
    this.setState( { points: [], addingRoi: false } );
  }

  handleSaveRoi = () =>
  {
    if (this.state.addingRoi && this.state.points.length >= 6)
    {
      const id = this.state.roiCount;
      console.log(`saving roi with id ${id}`);
      const roi =
        <PolyRoi tooltip={id} text={this.state.roiText} key={id} points={this.state.points} />
      var roiList = this.state.rois;
      roiList.push(roi);
      this.setState(
        {
          rois: roiList,
          roiCount: id + 1,
          points: [],
          addingRoi: false,
          roiText: ""
        });
    }
  }

  render()
  {
    return(
      <div>
        <div> {/* Konva div */}
          <Stage
            width={this.state.width}
            height={this.state.height}
            onContentClick={this.handleMouseDown}
          >
            <Layer>
              <Image
                image={this.state.image}
                ref={node => (this.image = node)}
                width={this.state.width}
                height={this.state.height}
              />
            </Layer>
            <Layer>
              <Line ref="currentRoi"
                points={this.state.points}
                closed={false}
                stroke="white"
                opacity={0.5}
              />
            </Layer>
            <Layer>
              {this.state.rois}
            </Layer>
          </Stage>
        </div>
        <div>
          <Button
            variant="raised"
            color="primary"
            onClick={this.handleAddRoi}
            disabled={this.state.addingRoi} >
            Add Roi
          </Button>
          <Button
            variant="raised"
            color="primary"
            onClick={this.handleSaveRoi}
            disabled={!this.state.addingRoi} >
            Save Current Roi
          </Button>
          <Button
            variant="raised"
            color="primary"
            onClick={this.handleClearRoi}
            disabled={!this.state.addingRoi} >
            Remove Current Roi
          </Button>
          <TextField
            color="primary"
            disabled={!this.state.addingRoi}
            placeholder="WYS in the selected ROI"
            helperText="Roi Observation"
            value={this.state.roiText} />
        </div>
      </div>
    );
  }
}
