import { IMetricsConfiguration, MetricsConfiguration } from "../../tsmetrics-core/MetricsConfiguration";

const VSCodeMetricsConfigurationDefaults = {
    Exclude: [],
    EnabledForJS: true,
    EnabledForJSX: true,
    EnabledForTS: true,
    EnabledForTSX: true,
    EnabledForHTML: true,
    DecorationModeEnabled: true,
    OverviewRulerModeEnabled: true,
    CodeLensEnabled: false,
    FileSizeLimitMB: 0.5,
    // todo: this should be read from package.json
    ComplexityColorLow: "#4bb14f",
    ComplexityColorNormal: "#ffc208",
    ComplexityColorHigh: "#f44034",
    ComplexityColorExtreme: "#ff0000",
};

export type IVSCodeMetricsConfiguration = typeof VSCodeMetricsConfigurationDefaults & IMetricsConfiguration;

export const getInitialVSCodeMetricsConfiguration: () => IVSCodeMetricsConfiguration = () => {
    return {
        ...MetricsConfiguration,
        ...VSCodeMetricsConfigurationDefaults,
    };
};

