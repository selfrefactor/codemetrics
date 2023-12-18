import { CodeLens, Range, Uri } from "vscode";
import { AppConfiguration } from "../models/AppConfiguration";
import { IMetricsModel } from "../tsmetrics-core/MetricsModel";

export class CodeMetricsCodeLens extends CodeLens {
    constructor(public model: IMetricsModel, private uri: Uri, range: Range) {
        super(range);
    }

    public getCollectedComplexity(): number {
        return this.model.getCollectedComplexity();
    }

    public toString(appConfig: AppConfiguration): string {
        return this.model.toString(appConfig.getCodeMetricsSettings(this.uri));
    }

    public getExplanation(appConfig: AppConfiguration): string {
        return this.model.getExplanation();
    }

    public getChildren() {
        return this.model.children;
    }
}
