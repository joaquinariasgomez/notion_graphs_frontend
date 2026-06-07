import { useMemo } from 'react';
import { format, parse } from 'date-fns';
import {
    computeVelocity,
    computeProjection,
    computeCategoryBreakdown,
    computeAnomalies,
    computeVolatility,
    computeFrequency,
    formatCurrency,
} from './InsightsUtils';

function parseDate(dateStr) {
    return parse(dateStr, 'yyyy-MM-dd', new Date());
}

function friendlyDate(dateStr) {
    return format(parseDate(dateStr), 'MMM d');
}

export default function InsightsPanel({ graphConfiguration, graphData }) {
    const hasData = graphData?.data && graphData.data.length > 0;

    const velocity = useMemo(
        () => computeVelocity(graphConfiguration, graphData),
        [graphConfiguration, graphData]
    );
    const projection = useMemo(
        () => computeProjection(graphConfiguration, graphData),
        [graphConfiguration, graphData]
    );
    const categoryBreakdown = useMemo(
        () => computeCategoryBreakdown(graphConfiguration, graphData),
        [graphConfiguration, graphData]
    );
    const anomalies = useMemo(
        () => computeAnomalies(graphConfiguration, graphData),
        [graphConfiguration, graphData]
    );
    const volatility = useMemo(
        () => computeVolatility(graphConfiguration, graphData),
        [graphConfiguration, graphData]
    );
    const frequency = useMemo(
        () => computeFrequency(graphConfiguration, graphData),
        [graphConfiguration, graphData]
    );

    const source = graphConfiguration.customGraphSettings?.dataSettings?.source;
    const sourceLabel =
        source === 'INCOMES' ? 'Income' :
            source === 'SAVINGS' ? 'Savings' :
                'Spending';

    if (!hasData) {
        return (
            <div className="insights__empty">
                <p>Not enough data yet to show insights.</p>
                <p>Try refreshing the chart or adjusting its time range.</p>
            </div>
        );
    }

    return (
        <div className="insights__panel">

            {/* Velocity */}
            {velocity && (
                <div className="insights__card">
                    <span className="insights__card__label">{sourceLabel} rate</span>
                    <div className="insights__card__value">
                        {formatCurrency(velocity.perDay)}
                        <span className="insights__card__unit">/day</span>
                    </div>
                    <span className="insights__card__secondary">
                        {formatCurrency(velocity.perWeek)}/week &nbsp;·&nbsp; {formatCurrency(velocity.total)} over {velocity.periodDays} days
                    </span>
                </div>
            )}

            {/* Projection */}
            {projection && (
                <div className="insights__card insights__card--accent">
                    <span className="insights__card__label">Projected this {projection.periodLabel}</span>
                    <div className="insights__card__value">{formatCurrency(projection.projected)}</div>
                    <span className="insights__card__secondary">
                        {formatCurrency(projection.elapsedTotal)} so far &nbsp;·&nbsp; {projection.remainingDays} day{projection.remainingDays !== 1 ? 's' : ''} left
                    </span>
                </div>
            )}

            {/* Volatility */}
            {volatility && (
                <div className="insights__card">
                    <span className="insights__card__label">Consistency</span>
                    <div className={`insights__card__value insights__volatility--${volatility.label.toLowerCase()}`}>
                        {volatility.label}
                    </div>
                    <span className="insights__card__secondary">{volatility.description}</span>
                </div>
            )}

            {/* Anomalies */}
            {anomalies.anomalies.length > 0 && (
                <div className="insights__card insights__card--warning">
                    <span className="insights__card__label">Unusual days</span>
                    <div className="insights__card__value">{anomalies.anomalies.length}</div>
                    <ul className="insights__anomaly__list">
                        {anomalies.anomalies.slice(0, 3).map(({ date, value }) => (
                            <li key={date}>
                                <span className="insights__anomaly__date">{friendlyDate(date)}</span>
                                <span className="insights__anomaly__value">{formatCurrency(value)}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="insights__card__secondary">Normal up to {formatCurrency(anomalies.threshold)}</span>
                </div>
            )}

            {/* Category breakdown */}
            {categoryBreakdown && (
                <div className="insights__card insights__card--wide">
                    <span className="insights__card__label">By category</span>
                    <div className="insights__category__list">
                        {categoryBreakdown.breakdown.slice(0, 6).map(({ category, total, sharePercent, perDay }) => (
                            <div key={category} className="insights__category__row">
                                <div className="insights__category__bar-row">
                                    <span className="insights__category__name">{category}</span>
                                    <span className="insights__category__total">{formatCurrency(total)}</span>
                                </div>
                                <div className="insights__category__bar-track">
                                    <div
                                        className="insights__category__bar-fill"
                                        style={{ width: `${sharePercent}%` }}
                                    />
                                </div>
                                <span className="insights__category__meta">
                                    {sharePercent.toFixed(1)}% &nbsp;·&nbsp; {formatCurrency(perDay)}/day
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Frequency — only when backend supplies count */}
            {frequency && (
                <>
                    <div className="insights__card">
                        <span className="insights__card__label">Transactions</span>
                        <div className="insights__card__value">{frequency.totalTransactions}</div>
                        <span className="insights__card__secondary">
                            {frequency.perWeek.toFixed(1)}/week &nbsp;·&nbsp; avg {formatCurrency(frequency.avgTransactionSize)} each
                        </span>
                    </div>

                    {frequency.categoryFrequency && (
                        <div className="insights__card insights__card--wide">
                            <span className="insights__card__label">{frequency.breakdownLabel}</span>
                            <div className="insights__category__list">
                                {frequency.categoryFrequency.slice(0, 5).map(({ category, count, avgSize, perWeek }) => (
                                    <div key={category} className="insights__category__row">
                                        <div className="insights__category__bar-row">
                                            <span className="insights__category__name">{category}</span>
                                            <span className="insights__category__total">{count} trips</span>
                                        </div>
                                        <span className="insights__category__meta">
                                            {perWeek.toFixed(1)}/week &nbsp;·&nbsp; avg {formatCurrency(avgSize)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}
