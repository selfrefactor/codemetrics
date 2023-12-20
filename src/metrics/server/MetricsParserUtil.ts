import { ScriptTarget } from "typescript";
import { Minimatch } from "minimatch";
import { Connection, Diagnostic, } from "vscode-languageserver";
import { IVSCodeMetricsConfiguration } from "../common/VSCodeMetricsConfiguration";

import { TextDocument } from "vscode-languageserver-textdocument";
import { IMetricsModel } from "../../tsmetrics-core/MetricsModel";
import { MetricsParser } from "../../tsmetrics-core/MetricsParser";
import { MIN_COMPLEXITY } from "../../constants";

export class MetricsParserUtil {
    constructor(private appConfig: IVSCodeMetricsConfiguration, private connection: Connection) {}

    public getMetrics(document: TextDocument): IMetricsModel[] {
        const target = ScriptTarget.Latest;
        const result: IMetricsModel[] = [];
        let input = document.getText();
        let diagnostics: Diagnostic[] = [];
        if (
            !this.isExcluded(document.uri) &&
            !this.isAboveFileSizeLimit(input) &&
            !this.isLanguageDisabled(document.languageId)
        ) {
            let metrics = MetricsParser.getMetricsFromText(document.uri, input, this.appConfig, <any>target);
            var collect = (model: IMetricsModel) => {
                if (model.visible && model.getCollectedComplexity() >= MIN_COMPLEXITY) {
                    result.push(model);
                }
                model.children.forEach((element) => {
                    collect(element);
                });
            };
            collect(metrics.metrics);
        }

        this.connection.sendDiagnostics({ uri: document.uri, diagnostics: diagnostics });
        return result;
    }

    private isLanguageDisabled(languageId: string): boolean {
        if (languageId == "typescript" && !this.appConfig.EnabledForTS) return true;
        if (languageId == "typescriptreact" && !this.appConfig.EnabledForTSX) return true;
        if (languageId == "javascript" && !this.appConfig.EnabledForJS) return true;
        if (languageId == "javascriptreact" && !this.appConfig.EnabledForJSX) return true;
        return false;
    }

    private isAboveFileSizeLimit(fileContent: string) {
        if (this.appConfig.FileSizeLimitMB < 0) {
            return false;
        }

        try {
            let fileSizeInBytes = fileContent.length;
            let configuredLimit = this.appConfig.FileSizeLimitMB * 1024 * 1024;
            return fileSizeInBytes > configuredLimit;
        } catch (error) {
            return false;
        }
    }
    private isExcluded(fileName: string) {
        const exclusionList = this.appConfig.Exclude || [];
        return exclusionList.some((pattern) => {
            return new Minimatch(pattern).match(fileName);
        });
    }
}
