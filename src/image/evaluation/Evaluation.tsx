import * as React from 'react';
import { IAuthProps } from '../../common/IAuthProps';
import { IDisplayRoi, IRoi } from "../Roi";
import { deleteEvaluation, getEvaluation } from './EvaluationController';
import EvaluationView from './EvaluationView';

export enum EvaluationStatus {
    Pending = "Pending",
    Running = "Running",
    Complete = "Complete",
    Error = "Error"
}

export interface IEvaluation {
    creationDate: string,
    diagnosticId: number,
    id: number,
    image: string,
    information: [],
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
    isImageLoaded: boolean,
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
            information: [],
            isImageLoaded: false,
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
                handleDeleteEvaluation={this.deleteEvaluation}
                id={this.state.id}
                image={this.state.image}
                imageHeight={this.state.imageHeight}
                imageWidth={this.state.imageWidth}
                isImageLoaded={this.state.isImageLoaded}
                name={this.state.name}
                rois={this.state.rois}
                status={this.state.status}
                updateDate={this.state.updateDate}
                ratio={this.state.ratio}
                opticalEvaluationId={this.props.opticalEvaluationId}
                patientId={this.props.patientId}
                information = {this.state.information}
            />
        );
    }

    private deleteEvaluation = () => {
        return deleteEvaluation(this.props.id, this.props.token)
    }

    private fetchEvaluation = () => {
        if (this.props.token !== "") {
            getEvaluation(this.props.id, this.props.token)
                .then(response => {
                    if (response.status === 400) {
                        this.props.toast(response.message);
                    }
                    else {
                        this.setEvaluation(response);
                    }
                });
        }
    }

    private setEvaluation = (restEvaluation: any) => {
        // image load
        const { displayImage } = this.state;
        displayImage.onload = this.updateEvaluationImageOnLoad(restEvaluation);
        displayImage.src = "data:image/png;base64," + restEvaluation.image;
        // restEvaluation.information.split(",")
        this.setState({
            'displayImage': displayImage,
            'information' : restEvaluation.information.split(",")
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
                disabled: false,
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
                isImageLoaded: true,
                name: restDiagnostic.name,
                'ratio': ratio,
                rois: restDiagnostic.rois,
                status: restDiagnostic.status,
            });
    }
}

export default Evaluation;
