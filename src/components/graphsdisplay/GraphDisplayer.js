import LineGraph from "./LineGraph"


export default function GraphDisplayer({ graphConfiguration, graphData }) {

  const renderGraph = () => {
    switch (graphConfiguration.customGraphSettings.visualizationSettings.type) {
      case 'LINE':
        return (
          <LineGraph graphConfiguration={graphConfiguration} graphData={graphData} />
        );
      case 'BAR':
        return (
          <div>
            Bar graph
          </div>
        );
      default:
        return (<></>);
    }
  }

  return renderGraph();
}