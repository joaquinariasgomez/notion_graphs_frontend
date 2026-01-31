import LineGraph from "./LineGraph";
import BarGraph from "./BarGraph";
import MultiLineGraph from "./MultiLineGraph";
import MultiBarGraph from "./MultiBarGraph";
import BurndownGraph from "./BurndownGraph";
import HeatmapGraph from "./HeatmapGraph";


export default function GraphDisplayer({ graphConfiguration, graphData, showLegend, showAverages, showStandardDeviation, showTitle }) {

  const renderCustomGraph = () => {
    const type = graphConfiguration.customGraphSettings.visualizationSettings.type;
    const isGrouped = graphConfiguration.customGraphSettings.visualizationSettings.groupByCategory === true || graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts === true || graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources === true;
    return (
      <HeatmapGraph graphConfiguration={graphConfiguration} graphData={graphData} showTitle={showTitle} />
    );
    switch (type) {
      case 'LINE':
        if (isGrouped) {
          return (
            <MultiLineGraph graphConfiguration={graphConfiguration} graphData={graphData} showLegend={showLegend} showAverages={showAverages} showStandardDeviation={showStandardDeviation} showTitle={showTitle} />
          );
        } else {
          return (
            <LineGraph graphConfiguration={graphConfiguration} graphData={graphData} showAverages={showAverages} showStandardDeviation={showStandardDeviation} showTitle={showTitle} />
          );
        }
      case 'BAR':
        if (isGrouped) {
          return (
            <MultiBarGraph graphConfiguration={graphConfiguration} graphData={graphData} showLegend={showLegend} showAverages={showAverages} showStandardDeviation={showStandardDeviation} showTitle={showTitle} />
          );
        } else {
          return (
            <BarGraph graphConfiguration={graphConfiguration} graphData={graphData} showAverages={showAverages} showStandardDeviation={showStandardDeviation} showTitle={showTitle} />
          );
        }
      default:
        return (<></>);
    }
  }

  const renderBurndownGraph = () => {
    return <BurndownGraph graphConfiguration={graphConfiguration} graphData={graphData} showTitle={showTitle} />;
  }

  const renderGraph = () => {
    const graphType = graphConfiguration.requestType;
    switch (graphType) {
      case 'CUSTOM_GRAPH':
        return renderCustomGraph();
      case 'BURNDOWN':
        return renderBurndownGraph();
      default:
        return (<></>);
    }
  }

  return renderGraph();
}