import * as React from 'react';
import { IAuthProps } from '../../common/IAuthProps';
import { Endpoints, RetipyObjects } from '../../configuration/Endpoints';
import { IDisplayRoi, IRoi } from "../Roi";
import EvaluationView from './EvaluationView';

export enum EvaluationStatus {
    Pending = "Pending",
    Complete = "Complete",
    Error = "Error"
}

export interface IEvaluation {
    creationDate: string,
    diagnosticId: number,
    id: number,
    image: string,
    name: string,
    rois: IRoi[],
    status: EvaluationStatus,
    updateDate: string,
}

export interface IDisplayEvaluation extends IEvaluation {
    displayRois: IDisplayRoi[],
    displayImage: HTMLImageElement,
    imageHeight: number,
    imageWidth: number,
    ratio: number,
}

interface IEvaluationProps extends IAuthProps {
    diagnosticId: number,
    id: number,
    opticalEvaluationId: number,
    patientId: number,
}

class Evaluation extends React.Component<IEvaluationProps, IDisplayEvaluation> {
    constructor(props: IEvaluationProps) {
        super(props);

        this.state = {
            creationDate: "",
            diagnosticId: 0,
            displayImage: document.createElement('img'),
            displayRois: [],
            id: 0,
            image: "",
            imageHeight: 600,
            imageWidth: 600,
            name: "",
            ratio: 1,
            rois: [],
            status: EvaluationStatus.Error,
            updateDate: "",
        }

        if (this.props.id !== 0) {
            this.fetchEvaluation();
        }
    }

    public render() {
        return(
            <EvaluationView
                creationDate={this.state.creationDate}
                diagnosticId={this.state.diagnosticId}
                displayImage={this.state.displayImage}
                displayRois={this.state.displayRois}
                id={this.state.id}
                image={this.state.image}
                imageHeight={this.state.imageHeight}
                imageWidth={this.state.imageWidth}
                name={this.state.name}
                rois={this.state.rois}
                status={this.state.status}
                updateDate={this.state.updateDate}
                ratio={this.state.ratio}
                opticalEvaluationId={this.props.opticalEvaluationId}
                patientId={this.props.patientId}
            />
        );
    }

    private fetchEvaluation = () => {
        if (this.props.token !== "") {
        fetch(
            Endpoints.Server + "/retipy" + RetipyObjects.RetipyEvaluation + `/${this.props.id}`,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': this.props.token,
                    'content-type': 'application/json',
                },
                method: 'GET',
                mode: 'cors',
                referrer: 'no-referrer',
            })
            .then(response => {
                if (!response.ok) {
                    throw Error("There was an error retrieving the evaluation data");
                }
                return response.json();
            })
            .then(data => this.setEvaluation(data))
            .catch(error => this.props.toast(error));
        }
    }

    private setEvaluation = (restEvaluation: any) => {
        // image load
        const { displayImage } = this.state;
        displayImage.onload = this.updateEvaluationImageOnLoad(restEvaluation);
        displayImage.src = "data:image/png;base64," + restEvaluation.image;
        this.setState({
            'displayImage': displayImage,
        });
        this.props.toast("Evaluation Loaded Successfully");
    }

    private updateEvaluationImageOnLoad = (restDiagnostic: any) => () => {
        const { displayImage } = this.state;
        const initialWidth = displayImage.naturalWidth;
        const initialHeight = displayImage.naturalHeight;
        let imageWidth = this.state.imageWidth;
        let imageHeight = this.state.imageHeight;
        if (window.innerWidth < imageWidth)
        {
            imageWidth = window.innerWidth - 5;
            imageHeight = window.innerWidth - 5;
        }
        let ratio = 1;
        let width = displayImage.naturalWidth;
        let height = displayImage.naturalHeight;
        if (width > imageWidth) {
            ratio = imageHeight / initialWidth;
            height = initialHeight * ratio;
            width = initialWidth * ratio;
            if (height > imageHeight) {
                ratio = imageHeight / initialHeight;
                width = initialWidth * ratio;
                height = initialHeight * ratio;
            }
        }
        else if (height > imageHeight) {
            ratio = imageHeight / initialHeight;
            width = initialWidth * ratio;
            height = initialHeight * ratio;
        }

        // extra data load
        const dataRoiList = restDiagnostic.rois;
        const roiList: IDisplayRoi[] = [];
        for (let i = 0; i < dataRoiList.length; i++) {
            const currentRoi = dataRoiList[i];
            const pointsFixed: number[] = [];
            for (let pIndex = 0; pIndex < currentRoi.x.length; pIndex++) {
                pointsFixed.push(currentRoi.x[pIndex] * ratio);
                pointsFixed.push(currentRoi.y[pIndex] * ratio);
            }
            const roi: IDisplayRoi = {
                color: currentRoi.color,
                displayP: pointsFixed,
                id: i,
                notes: currentRoi.notes,
                x: currentRoi.x,
                y: currentRoi.y,
            }
            roiList.push(roi);
        }
        this.setState(
            {
                creationDate: restDiagnostic.creationDate,
                diagnosticId: restDiagnostic.diagnosticId,
                'displayImage': displayImage,
                displayRois: roiList,
                image: restDiagnostic.image,
                imageHeight: height,
                imageWidth: width,
                name: restDiagnostic.name,
                'ratio': ratio,
                rois: restDiagnostic.rois,
                status: restDiagnostic.status,
            });
    }
}

export default Evaluation;
