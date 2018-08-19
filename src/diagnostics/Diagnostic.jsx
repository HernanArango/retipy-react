import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import { Stage, Layer, Line, Image } from "react-konva";
import { Configuration as CNF } from "../Configuration";
import PolyRoi from "../roi/PolyRoi";

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  roiButton: {
    margin: theme.spacing.unit / 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

const getId = (id, token) => {
  const endpoint = (id) => `${CNF.DIAGNOSTIC_ENDPOINT}/${id}`
  return fetch(CNF.REST_URL + endpoint(id), {
    method: 'GET',
    mode: 'cors',
    referrer: 'no-referrer',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json',
      'Authorization': token,
    }})
    .then(response => response.json())
}

class Diagnostic extends Component
{
  state =
  {
    id: 0,
    width: 600,
    height: 600,
    ratio: 1,
    notes: "",
    roiElementList: [],
    roiCount: 0,
    roiList: [],
    diagnostic: "",
    points: [],
    roiText: "",
    addingRoi: false,
    creationDate: "",
  }

  constructor(props)
  {
    super(props);
    this.state.id = props.id;
  }

  componentDidMount()
  {
    // Load the data from the rest endpoint
    getId(this.state.id, this.props.token).then(data =>
      {
        //image load
        const image = document.createElement('img');
        image.onload = () =>
        {
          const initial_width = image.naturalWidth;
          const initial_height = image.naturalHeight;
          var ratio = 1;
          var width = image.naturalWidth;
          var height = image.naturalHeight;
          if (width > this.state.width)
          {
            ratio = this.state.width / initial_width;
            height = initial_height * ratio;
            width = initial_width * ratio;
            if (height > this.state.height)
            {
              ratio = this.state.height / initial_height;
              width = initial_width * ratio;
              height = initial_height * ratio;
            }
          }
          else if(height > this.state.height)
          {
            ratio = this.state.height / initial_height;
            width = initial_width * ratio;
            height = initial_height * ratio;
          }
          console.log(`image is resized ${ratio}%`);


          // extra data load
          const dataRoiList = data.rois;
          var roiElementList = [];
          var roiDictList = [];
          for (var i=0; i < dataRoiList.length; i++)
          {
            var currentRoi = dataRoiList[i];
            var pointsFixed = [];
            for (var pIndex=0; pIndex < currentRoi.roi_x.length; pIndex++)
            {
              pointsFixed.push(currentRoi.roi_x[pIndex] * ratio);
              pointsFixed.push(currentRoi.roi_y[pIndex] * ratio);
            }
            const roi = <PolyRoi
              tooltip={i}
              text={currentRoi.notes}
              key={i}
              points={pointsFixed} />
            roiElementList.push(roi);
            const roiDict = {
              notes: currentRoi.notes,
              roi_x: currentRoi.roi_x,
              roi_y: currentRoi.roi_y
            }
            roiDictList.push(roiDict);
          }
          this.setState(
            {
              height: height,
              width: width,
              ratio: ratio,
              image: image,
              roiElementList: roiElementList,
              roiList: roiDictList
            });
        }
        image.src = "data:image/png;base64," + data.image;

        this.setState(
          {
            diagnostic: data.diagnostic,
            creationDate: data.creationDate,
          });
        this.props.toast("Diagnostic Loaded Successfully");

      })
      .catch(error => console.log(error));
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

  handleAddRoi = event =>
  {
    this.setState({ addingRoi: event.target.checked });
  }

  handleClearRoi = () =>
  {
    this.setState( { points: [], addingRoi: false } );
  }

  handleUndoLastPoint = () =>
  {
    const pLength = this.state.points.length
    if (pLength >= 2)
    {
      this.setState({points: this.state.points.slice(0, pLength-2)})
    }
  }

  handleSaveRoi = () =>
  {
    if (this.state.addingRoi && this.state.points.length >= 6)
    {
      const id = this.state.roiCount;
      const roiElement =
        <PolyRoi tooltip={id} text={this.state.roiText} key={id} points={this.state.points} />
      var roi_x = [];
      var roi_y = [];
      for(var i=0; i < this.state.points.length; i+=2)
      {
        roi_x.push(this.state.points[i]/this.state.ratio);
        roi_y.push(this.state.points[i+1]/this.state.ratio);
      }
      const roiDict = {
        notes: this.state.roiText,
        roi_x: roi_x,
        roi_y: roi_y
      }
      var roiList = this.state.roiElementList;
      roiList.push(roiElement);
      var roiDictList = this.state.roiList;
      roiDictList.push(roiDict);
      this.setState(
        {
          roiElementList: roiList,
          roiList: roiDictList,
          roiCount: id + 1,
          points: [],
          addingRoi: false,
          roiText: "",
        });

      this.props.toast("Added new RoI");
    }
  }

  handleAddRoiNotes = event =>
  {
    this.setState({roiText: event.target.value});
  }

  handleUpdateDiagnostic = event =>
  {
    if (this.state.addingRoi)
    {
      this.props.toast("Please Add or Cancel the current RoI");
      return;
    }
    if (this.state.diagnostic==="")
    {
      this.props.toast("Diagnostic must have a value");
      return;
    }

    var diagnosticData =
    {
      id: this.state.id,
      diagnostic: this.state.diagnostic,
      rois: this.state.roiList,
      status: "UPDATED",
    }

    fetch(
      CNF.REST_URL + CNF.DIAGNOSTIC_ENDPOINT,
      {
        method: 'POST',
        body: JSON.stringify(diagnosticData),
        mode: 'cors',
        headers:
        {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(success =>
        this.props.toast("Diagnostic Updated Successfully"))
      .catch(error =>
        {
          console.log(error);
          this.props.toast("There was an error saving this diagnostic");
        });
  }

  render()
  {
    const { classes } = this.props;
    return(
      <div className={classes.root}>
      <Grid container spacing={16} className={classes.container}>
        <Grid item xs={12} sm={12} > {/* Konva div */}
        <Grid container justify="center">
        <Paper className={classes.paper}>
          <Typography variant="display1">Diagnostic</Typography>
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
                visible={this.state.addingRoi}
              />
            </Layer>
            <Layer>
              {this.state.roiElementList}
            </Layer>
          </Stage>
        </Paper>
        </Grid>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="display1">New Region of Interest</Typography>
            <Grid container>
              <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.addingRoi}
                    color="primary"
                    onChange={this.handleAddRoi}
                  />}
                label="Add new"
              />
              </Grid>
              <Grid item xs={4}>
                <Button
                  onClick={this.handleUndoLastPoint}
                  disabled={!this.state.addingRoi}
                  className={classes.roiButton}
                >
                  Undo Last Point
                </Button>
              </Grid>
              <Grid item xs={1}>
                <TextField
                      value={this.state.points.length/2}
                      label="Points"
                      disabled
                    />
              </Grid>
            </Grid>
            <TextField
              required
              id="roiNotes"
              disabled={!this.state.addingRoi}
              placeholder="eg. Dead Tissue"
              helperText="Roi Observation"
              value={this.state.roiText}
              onChange={this.handleAddRoiNotes}
              margin="normal"
              label="Notes"
              fullWidth
            />
              <Button
                variant="raised"
                type="submit"
                onClick={this.handleSaveRoi}
                disabled={!this.state.addingRoi}
                className={classes.roiButton}
              >
                Save
              </Button>
              <Button
                color="primary"
                onClick={this.handleClearRoi}
                disabled={!this.state.addingRoi}
                className={classes.roiButton}
              >
                Cancel
              </Button>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="display1">Diagnostic Information</Typography>
            <Grid container>
              <Grid item xs={6}>
              <TextField
                value={this.state.roiElementList.length}
                label="RoI Count"
                className={classes.textField}
                disabled/>
              </Grid>
              <Grid item xs={6}>
              <TextField
                value={ new Date(this.state.creationDate).toDateString()}
                label="Date Added"
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                disabled/>
              </Grid>
              <Grid item xs={12}>
              <TextField
                value={this.state.diagnostic}
                label="Diagnostic"
                helperText="Most prominent disease"
                onChange={e => this.setState({diagnostic: e.target.value})}
                fullWidth/>
              </Grid>
              <Grid item xs={12}>
              <Button
                variant="raised"
                color="primary"
                className={classes.button}
                onClick={this.handleUpdateDiagnostic}>
                Update Diagnostic
              </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Diagnostic);
