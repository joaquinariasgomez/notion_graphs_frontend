import '../../css/CreateGraphBox.css';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import { useState } from 'react';
import { createGraph } from '../../api/RequestUtils';
import { useGlobalStateValue } from '../../context/GlobalStateProvider';
import ClipLoader from 'react-spinners/ClipLoader';
import { actionTypes } from '../../context/globalReducer';

export default function CreateCustomGraphStep4({ graphConfiguration, onUpdateGraphConfig, gotoBack, gotoBegin }) {

    // Context
    const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

    const [isCumulative, setIsCumulative] = useState(graphConfiguration.customGraphSettings.visualizationSettings.cumulative);
    const [isGroupByCategory, setIsGroupByCategory] = useState(graphConfiguration.customGraphSettings.visualizationSettings.groupByCategory);

    const closeCreateGraphBox = () => {
        dispatch({
            type: actionTypes.SET_SHOW_CREATE_GRAPH_BOX,
            value: false
        })
    }

    const onBackButton = () => {
        if (graphConfiguration.customGraphSettings.dataSettings.source === 'SAVINGS') {
            gotoBegin()
        } else {
            gotoBack()
        }
    }

    const handleCreateGraph = async () => {
        try {
            closeCreateGraphBox()
            // TODO JOAQUIN: APPEND GRAPH AS PENDING, THEN OVERRIDE THE CONTENT
            const apiResponse = await createGraph(userJWTCookie, graphConfiguration);
            if (apiResponse) {
                dispatch({
                    type: actionTypes.APPEND_GRAPH,
                    value: apiResponse
                })
            }
        } catch (error) {
            // TODO: handle exception
        } finally { }
    }

    const handleSelectedVisualizationType = (type) => {
        onUpdateGraphConfig({
            customGraphSettings: {
                ...graphConfiguration.customGraphSettings,
                visualizationSettings: {
                    ...graphConfiguration.customGraphSettings.visualizationSettings,
                    type: type
                }
            }
        })
    }

    const handleSelectedGroupByTime = (groupByTime) => {
        onUpdateGraphConfig({
            customGraphSettings: {
                ...graphConfiguration.customGraphSettings,
                visualizationSettings: {
                    ...graphConfiguration.customGraphSettings.visualizationSettings,
                    groupByTime: groupByTime
                }
            }
        })
    }

    const handleSelectedGroupByIncomeBankAccountsCategory = () => {
        if (graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts === true) {
            onUpdateGraphConfig({
                customGraphSettings: {
                    ...graphConfiguration.customGraphSettings,
                    visualizationSettings: {
                        ...graphConfiguration.customGraphSettings.visualizationSettings,
                        groupByIncomeBankAccounts: false
                    }
                }
            })
        } else {
            onUpdateGraphConfig({
                customGraphSettings: {
                    ...graphConfiguration.customGraphSettings,
                    visualizationSettings: {
                        ...graphConfiguration.customGraphSettings.visualizationSettings,
                        groupByIncomeBankAccounts: true,
                        groupByIncomeSources: false
                    }
                }
            })
        }
    }

    const handleSelectedGroupByIncomeSourcesCategory = () => {
        if (graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources === true) {
            onUpdateGraphConfig({
                customGraphSettings: {
                    ...graphConfiguration.customGraphSettings,
                    visualizationSettings: {
                        ...graphConfiguration.customGraphSettings.visualizationSettings,
                        groupByIncomeSources: false
                    }
                }
            })
        } else {
            onUpdateGraphConfig({
                customGraphSettings: {
                    ...graphConfiguration.customGraphSettings,
                    visualizationSettings: {
                        ...graphConfiguration.customGraphSettings.visualizationSettings,
                        groupByIncomeSources: true,
                        groupByIncomeBankAccounts: false
                    }
                }
            })
        }
    }

    const handleSelectedGroupByCategory = () => {
        var newValue = !isGroupByCategory;
        setIsGroupByCategory(newValue);
        onUpdateGraphConfig({
            customGraphSettings: {
                ...graphConfiguration.customGraphSettings,
                visualizationSettings: {
                    ...graphConfiguration.customGraphSettings.visualizationSettings,
                    groupByCategory: newValue
                }
            }
        })
    }

    const handleSelectedCumulative = () => {
        var newValue = !isCumulative;
        setIsCumulative(newValue);
        onUpdateGraphConfig({
            customGraphSettings: {
                ...graphConfiguration.customGraphSettings,
                visualizationSettings: {
                    ...graphConfiguration.customGraphSettings.visualizationSettings,
                    cumulative: newValue
                }
            }
        })
    }

    const renderStep4Heading = () => {
        if (graphConfiguration.customGraphSettings.dataSettings.source === "EXPENSES") {
            return (
                <div className='creategraphbox__heading last_step'>
                    <h2>Expenses</h2>
                    <TrendingDownRoundedIcon fontSize='medium' />
                </div>
            );
        } else if (graphConfiguration.customGraphSettings.dataSettings.source === "INCOMES") {
            return (
                <div className='creategraphbox__heading last_step'>
                    <h2>Incomes</h2>
                    <AttachMoneyRoundedIcon fontSize='medium' />
                </div>
            );
        } else {
            return (
                <div className='creategraphbox__heading last_step'>
                    <h2>Savings</h2>
                    <TrendingUpRoundedIcon fontSize='medium' />
                </div>
            );
        }
    }

    const renderLineChartText = () => {
        if ((graphConfiguration.customGraphSettings.dataSettings.source === "EXPENSES" && graphConfiguration.customGraphSettings.visualizationSettings.groupByCategory === true) || (graphConfiguration.customGraphSettings.dataSettings.source === "INCOMES" && graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts === true || graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources === true)) {
            return (
                <p>Multiline chart</p>
            );
        } else {
            return (
                <p>Line chart</p>
            );
        }
    }

    const renderBarChartText = () => {
        if ((graphConfiguration.customGraphSettings.dataSettings.source === "EXPENSES" && graphConfiguration.customGraphSettings.visualizationSettings.groupByCategory === true) || (graphConfiguration.customGraphSettings.dataSettings.source === "INCOMES" && graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts === true || graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources === true)) {
            return (
                <p>Multibar chart</p>
            );
        } else {
            return (
                <p>Bar chart</p>
            );
        }
    }

    const renderVisualizationButtons = () => {
        return (
            <div className='creategraphbox__step__bigbuttons'>
                <button
                    className={`${graphConfiguration.customGraphSettings.visualizationSettings.type === 'LINE' ? 'selected' : 'not_selected'} small`}
                    onClick={() => handleSelectedVisualizationType('LINE')}
                >
                    {renderLineChartText()}
                </button>
                <button
                    className={`${graphConfiguration.customGraphSettings.visualizationSettings.type === 'BAR' ? 'selected' : 'not_selected'} small`}
                    onClick={() => handleSelectedVisualizationType('BAR')}
                >
                    {renderBarChartText()}
                </button>
            </div>
        );
    }

    const renderGroupByTimeButtons = () => {
        return (
            <div className='creategraphbox__step__bigbuttons'>
                <button
                    className={`${graphConfiguration.customGraphSettings.visualizationSettings.groupByTime === 'DAY' ? 'selected' : 'not_selected'} small`}
                    onClick={() => handleSelectedGroupByTime('DAY')}
                >
                    <p>Day</p>
                </button>
                <button
                    className={`${graphConfiguration.customGraphSettings.visualizationSettings.groupByTime === 'WEEK' ? 'selected' : 'not_selected'} small`}
                    onClick={() => handleSelectedGroupByTime('WEEK')}
                >
                    <p>Week</p>
                </button>
                <button
                    className={`${graphConfiguration.customGraphSettings.visualizationSettings.groupByTime === 'MONTH' ? 'selected' : 'not_selected'} small`}
                    onClick={() => handleSelectedGroupByTime('MONTH')}
                >
                    <p>Month</p>
                </button>
                <button
                    className={`${graphConfiguration.customGraphSettings.visualizationSettings.groupByTime === 'YEAR' ? 'selected' : 'not_selected'} small`}
                    onClick={() => handleSelectedGroupByTime('YEAR')}
                >
                    <p>Year</p>
                </button>
            </div>
        );
    }

    const renderGroupByCategoriesButtons = () => {
        if (graphConfiguration.customGraphSettings.dataSettings.source === 'EXPENSES') {
            return (
                <button
                    className={`${isGroupByCategory === true ? 'selected' : 'not_selected'} small`}
                    onClick={handleSelectedGroupByCategory}
                >
                    <p>Group by category</p>
                </button>
            );
        } else if (graphConfiguration.customGraphSettings.dataSettings.source === 'INCOMES') {
            return (
                <>
                    <button
                        className={`${graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts === true ? 'selected' : 'not_selected'} small`}
                        onClick={handleSelectedGroupByIncomeBankAccountsCategory}
                    >
                        <p>Group by bank account</p>
                    </button >
                    <button
                        className={`${graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources === true ? 'selected' : 'not_selected'} small`}
                        onClick={handleSelectedGroupByIncomeSourcesCategory}
                    >
                        <p>Group by income source</p>
                    </button>
                </>
            );
        } else {
            return (<></>);
        }
    }

    const renderOnOffButtons = () => {
        return (
            <div className='creategraphbox__step__bigbuttons notitle'>
                {renderGroupByCategoriesButtons()}
                <button
                    className={`${isCumulative === true ? 'selected' : 'not_selected'} small`}
                    onClick={handleSelectedCumulative}
                >
                    <p>Cumulative results</p>
                </button>
            </div>
        );
    }

    const renderStep4Content = () => {
        return (
            <>
                <div className='creategraphbox__stepgraycontainer'>
                    <h2>Visualization</h2>
                    {renderVisualizationButtons()}
                </div>
                <div className='creategraphbox__stepgraycontainer'>
                    <h2>Group by time</h2>
                    {renderGroupByTimeButtons()}
                </div>
                <div className='creategraphbox__stepgraycontainer'>
                    {renderOnOffButtons()} {/* Group by category and Cumulative results buttons */}
                </div>
            </>
        );
    }

    return (
        <div className='creategraphbox__stepcontainer'>
            <div className='creategraphbox__stepcontent'>
                {renderStep4Heading()}
                {renderStep4Content()}
            </div>
            <div className='creategraphbox__arrows'>
                <button className='creategraphbox__button back' onClick={onBackButton} disabled={false}>
                    Back
                </button>
                <button className='creategraphbox__button next create_graph' onClick={handleCreateGraph} disabled={false}>
                    Create graph
                </button>
            </div>
        </div>
    );
}
