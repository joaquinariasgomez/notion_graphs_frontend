import LineGraph from "./LineGraph";
import BarGraph from "./BarGraph";
import MultiLineGraph from "./MultiLineGraph";
import MultiBarGraph from "./MultiBarGraph";


export default function GraphDisplayer({ graphConfiguration, graphData }) {

  const renderGraph = () => {
    const type = graphConfiguration.customGraphSettings.visualizationSettings.type;
    const isGrouped = graphConfiguration.customGraphSettings.visualizationSettings.groupByCategory === true || graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts === true || graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources === true;
    switch (type) {
      case 'LINE':
        if (isGrouped) {
          return (
            <MultiLineGraph graphConfiguration={graphConfiguration} graphData={graphData} />
          );
        } else {
          return (
            <LineGraph graphConfiguration={graphConfiguration} graphData={graphData} />
          );
        }
      case 'BAR':
        if (isGrouped) {
          return (
            <MultiBarGraph graphConfiguration={graphConfiguration} graphData={graphData} />
          );
        } else {
          return (
            <BarGraph graphConfiguration={graphConfiguration} graphData={graphData} />
          );
        }
      default:
        return (<></>);
    }
  }

  return renderGraph();
}