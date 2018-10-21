import * as React from "react";
import { IAuthProps } from "../../common/IAuthProps";
import { IDisplayRoi, IRoi } from "../Roi";
import { getDiagnostic, saveDiagnostic } from "./DiagnosticController";
import { DiagnosticStatus } from "./DiagnosticStatus";
import DiagnosticView from "./DiagnosticView";

export interface IDiagnostic {
    creationDate?: string,
    diagnostic: string,
    id: number,
    image: string,
    rois: IRoi[],
    status: DiagnosticStatus,
    updateDate?: string,
}

export interface IDisplayDiagnostic {
    creationDate: string,
    diagnostic: string,
    id: number,
    image: string,
    rois: IDisplayRoi[],
    status: DiagnosticStatus,
    updateDate: string,
}

interface IDiagnosticState extends IDisplayDiagnostic {
    displayImage: HTMLImageElement,
    imageHeight: number,
    imageWidth: number,
    isAddingRoi: boolean,
    isImageLoaded: boolean,
    newRoiColor: string,
    newRoiPoints: number[],
    newRoiText: string,
    notes: string,
    ratio: number,
    roiCount: number,
}

interface IDiagnosticProps extends IAuthProps {
    id: number,
    opticalEvaluationId: number,
    patientId: number,
    editable: boolean,
}

class Diagnostic extends React.Component<IDiagnosticProps, IDiagnosticState> {
    constructor(props: IDiagnosticProps) {
        super(props);
        this.state = {
            creationDate: "",
            diagnostic: "",
            displayImage: document.createElement('img'),
            id: props.id,
            image: "",
            imageHeight: 600,
            imageWidth: 600,
            isAddingRoi: false,
            isImageLoaded: false,
            newRoiColor: "black",
            newRoiPoints: [],
            newRoiText: "",
            notes: "",
            ratio: 1,
            roiCount: 0,
            rois: [],
            status: DiagnosticStatus.Created,
            updateDate: "",
        }

        if (props.id !== 0) {
            this.fetchDiagnostic();
        }
        else
        {
            this.props.toast("Wrong diagnostic id");
        }
    }

    public render(): JSX.Element {
        return (
            <DiagnosticView
                isEditingEnabled={this.props.editable}
                creationDate={this.state.creationDate}
                diagnostic={this.state.diagnostic}
                displayImage={this.state.displayImage}
                handleRoiAddColor={this.handleRoiAddColor}
                handleRoiAddNotes={this.handleRoiAddNotes}
                handleRoiAddPoints={this.handleRoiAddPoints}
                handleRoiClear={this.handleRoiClear}
                handleRoiDelete={this.handleRoiDelete}
                handleRoiEnableCreate={this.handleRoiEnableCreate}
                handleRoiSave={this.handleRoiSave}
                handleRoiUndoLastPoint={this.handleRoiUndoLastPoint}
                handleSaveDiagnostic={this.saveDiagnostic}
                handleUpdateDiagnostic={this.handleUpdateDiagnostic}
                id={this.state.id}
                image={this.state.image}
                imageHeight={this.state.imageHeight}
                imageWidth={this.state.imageWidth}
                isAddingRoi={this.state.isAddingRoi}
                isImageLoaded={this.state.isImageLoaded}
                newRoiColor={this.state.newRoiColor}
                newRoiPoints={this.state.newRoiPoints}
                newRoiText={this.state.newRoiText}
                rois={this.state.rois}
                status={this.state.status}
                updateDate={this.state.updateDate}
                diagnosticId={this.props.id}
                opticalEvaluationId={this.props.opticalEvaluationId}
                patientId={this.props.patientId}
            />);
    }

    private fetchDiagnostic = () => {
        getDiagnostic(this.state.id, this.props.token)
            .then(data => this.updateDiagnostic(data))
            .catch(error => this.props.toast(error.message));
    }

    private handleUpdateDiagnostic = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        this.setState({
            diagnostic: event.target.value,
        });
    }

    private handleRoiAddColor = (event: any) => {
        this.setState({
            newRoiColor: event.target.value,
        })
    }

    private handleRoiAddNotes = (event: any) => {
        this.setState({
            newRoiText: event.target.value,
        });
    }

    private handleRoiAddPoints = (x: number, y: number) => {
        const newPoints = this.state.newRoiPoints.concat(x, y);
        this.setState({
            newRoiPoints: newPoints,
        });
    }

    private handleRoiEnableCreate = (event: any) => {
        this.setState({
            isAddingRoi: event.target.checked,
        });
    }

    private handleRoiClear = () => {
        this.setState({
            isAddingRoi: false,
            newRoiPoints: [],
        });
    }

    private handleRoiSave = () => {
        if (!this.state.isAddingRoi) {
            this.props.toast("You must be adding a Roi before saving");
        }
        else if (this.state.newRoiPoints.length < 6) {
            this.props.toast("At least three points must be added to create a ROI");
        }
        else {
            const roiPoints = this.state.newRoiPoints;
            const pointCount = roiPoints.length;
            const roiX: number[] = [];
            const roiY: number[] = [];
            for (let i = 0; i < pointCount; i += 2) {
                roiX.push(roiPoints[i] / this.state.ratio);
                roiY.push(roiPoints[i + 1] / this.state.ratio);
            }
            const roi: IDisplayRoi = {
                color: this.state.newRoiColor,
                displayP: roiPoints,
                id: Math.random(),
                notes: this.state.newRoiText,
                x: roiX,
                y: roiY,
            }
            this.setState({
                isAddingRoi: false,
                newRoiPoints: [],
                newRoiText: "",
                roiCount: pointCount + 1,
                rois: this.state.rois.concat(roi),
            });

            this.props.toast("ROI added successfully");
        }
    }

    private handleRoiDelete = (id:number) => (event: React.MouseEvent<HTMLElement>) => {
        const newRoiList: IDisplayRoi[] = []
        for (const roi of this.state.rois)
        {
            if (roi.id !== id)
            {
                newRoiList.push(roi)
            }
        }
        this.setState({
            rois: newRoiList,
        })
    }

    private handleRoiUndoLastPoint = () => {
        const pointCount = this.state.newRoiPoints.length;
        if (pointCount >= 2) {
            this.setState({
                newRoiPoints: this.state.newRoiPoints.slice(0, -2),
            })
        }
        else {
            this.props.toast("Cannot undo");
        }
    }

    private saveDiagnostic = () => {
        if (this.state.isAddingRoi) {
            this.props.toast("Please add or remove the current RoI before saving");
        }
        else if (this.state.diagnostic === "") {
            this.props.toast("Diagnostic must have a value");
        }
        else {
            const diagnosticData: IDiagnostic =
            {
                diagnostic: this.state.diagnostic,
                id: this.state.id,
                image: this.state.image,
                rois: this.state.rois as IRoi[],
                status: DiagnosticStatus.Updated,
            }
            saveDiagnostic(
                diagnosticData,
                this.props.patientId,
                this.props.opticalEvaluationId,
                this.props.token,
                this.props.toast);

        }
    }

    private updateDiagnostic = (restDiagnostic: any) => {
        // image load
        const { displayImage } = this.state;
        displayImage.onload = this.updateDiagnosticImageOnLoad(restDiagnostic);
        displayImage.src = "data:image/png;base64," + restDiagnostic.image;
        this.setState({
            'displayImage': displayImage,
        });
        this.props.toast("Diagnostic Loaded Successfully");
    }

    private updateDiagnosticImageOnLoad = (restDiagnostic: any) => () => {
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
        for (const currentRoi of dataRoiList) {
            const pointsFixed: number[] = [];
            for (let pIndex = 0; pIndex < currentRoi.x.length; pIndex++) {
                pointsFixed.push(currentRoi.x[pIndex] * ratio);
                pointsFixed.push(currentRoi.y[pIndex] * ratio);
            }
            const roi: IDisplayRoi = {
                color: currentRoi.color,
                displayP: pointsFixed,
                id: Math.random(),
                notes: currentRoi.notes,
                x: currentRoi.x,
                y: currentRoi.y,
            }
            roiList.push(roi);
        }
        this.setState(
            {
                creationDate: restDiagnostic.creationDate,
                diagnostic: restDiagnostic.diagnostic,
                image: restDiagnostic.image,
                imageHeight: height,
                imageWidth: width,
                isImageLoaded: true,
                'ratio': ratio,
                rois: roiList,
            });
    }

}
export default Diagnostic;
