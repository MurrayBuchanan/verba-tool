import { useState, useMemo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedReaction, runOnJS, useDerivedValue, useAnimatedStyle } from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { ThemedText as Text } from "@/components/themed-text";
import { Intervention } from "@/constants/interfaces";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { useFont, Circle, Line as LinePath, Rect, vec } from "@shopify/react-native-skia";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Inter_500Medium } from "@expo-google-fonts/inter";
import { Data, calculateMean, calculateStandardDeviation } from "@/utils/chart-grouping";
import { nelsonRule1, nelsonRule2, nelsonRule3 } from "@/utils/chart-rules";

// This is simplified SPC chart shows the baseline and control limits rather than rule-based quality 
// controls as this is to visualise change in language for professional interpretation rather than an automated 
// quality control system. Automated rule checks can lead to false-alarm considering the use of blackbox data.

// The baseline is the mean of the data before the first intervention
// The control limits are set at 3 standard deviations from the baseline as this is the traditional SPC rule

// Documentation:
// Victory Native Documentation: https://nearform.com/open-source/victory-native/docs/cartesian/cartesian-chart/
// ToolTip: https://stackoverflow.com/questions/78615845/toolitips-with-victory-native-xl-cart
// React Native Reanimated: https://docs.swmansion.com/react-native-reanimated/docs/2.x/fundamentals/shared-values/

type Props = {
    data: Data[];
    xAxisLabel?: (value: number) => string;
    title?: string;
    interventions?: Intervention[];
    showMean: boolean;
    showRange: boolean;
    showInterventions: boolean;
};

function findPointAtX<T extends { x: number }>(points: T[], x: number): T | null {
    if (points.length === 0) {
        return null;
    } 
    const exact = points.find((d) => d.x === x);
    if (exact) {
        return exact;
    }
    let closest = points[0];
    for (let i = 1; i < points.length; i++) {
        if (Math.abs(points[i].x - x) < Math.abs(closest.x - x)) closest = points[i];
    }
    return closest;
}

type ToolTipAxisProps = {
    xPosition: SharedValue<number>;
    top: number;
    bottom: number;
    colour: string;
};

function ToolTipLine({ xPosition, top, bottom, colour }: ToolTipAxisProps) {
    const bottomPoint = useDerivedValue(() => vec(xPosition.value, bottom));
    const topPoint = useDerivedValue(() => vec(xPosition.value, top));
    return <LinePath p1={bottomPoint} p2={topPoint} color={colour} strokeWidth={1.5} />;
}

function ToolTip({ x, y, color = "black" }: { x: SharedValue<number>; y: SharedValue<number>; color?: string }) {
    return <Circle cx={x} cy={y} r={8} color={color} />;
}

export function MetricChart({ data, xAxisLabel, title, interventions = [], showMean = true, showRange = true, showInterventions = true }: Props) {
    const labelColour = useThemeColor({}, 'text');
    const gridColour = useThemeColor({}, 'backgroundTertiary');
    const dataColour = useThemeColor({}, 'accent');
    const meanColour = useThemeColor({}, 'meanColour');
    const standardDeviationColour = useThemeColor({}, 'standardDeviationColour');
    const interventionColour = useThemeColor({}, 'interventionColour');
    const borderColour = useThemeColor({}, 'backgroundTertiary');
    const warning = useThemeColor({}, 'warning');

    const { state, isActive } = useChartPressState({
        x: 0,
        y: { value: 0, mean: 0, upperBound: 0, lowerBound: 0 },
    });

    const [pressedX, setPressedX] = useState<number | null>(null);
    const syncPressToJs = useCallback((active: boolean | number, x: number | boolean) => { setPressedX(active ? (x as number) : null) }, []);

    useAnimatedReaction(
        () => [state.isActive.value, state.x.value.value],
        ([active, x]) => {
            runOnJS(syncPressToJs)(active, x);
        },
        []
    );

    const chartData = useMemo(() => {
        if (!data.length) {
            return [];
        }

        const values = data.map((d) => d.value);

        const mean = calculateMean(values);
        const standardDeviation = calculateStandardDeviation(values, mean);
        const upperControlLimit = mean + 3 * standardDeviation;
        const lowerControlLimit = mean - 3 * standardDeviation;

        const rule1 = nelsonRule1(values);
        const rule2 = nelsonRule2(values);
        const rule3 = nelsonRule3(values);

        return data.map((point, index) => {
            const ruleBreached =
                rule1.positions.includes(index) ||
                rule2.positions.includes(index) ||
                rule3.positions.includes(index);

            return {
                ...point,
                mean: mean,
                upperBound: upperControlLimit,
                lowerBound: lowerControlLimit,
                ruleBreached,
            };
        });
    }, [data, interventions]);

    const tooltipPoint = useMemo(() => (pressedX == null ? null : findPointAtX(chartData, pressedX)), [pressedX, chartData]);

    const valueLabelStyle = useAnimatedStyle(() => ({
        position: "absolute",
        left: state.x.position.value - 24,
        top: -24,
        width: 48,
        opacity: state.isActive.value ? 1 : 0,
    }));

    const interventionPeriods = useMemo(() => {
        if (!data.length || !interventions.length) {
            return [];
        }

        const setDateToMidnight = (date: Date): Date => {
            date.setHours(0, 0, 0, 0);
            return date;
        };

        return interventions.flatMap((intervention) => {
            const startDate = setDateToMidnight(new Date(intervention.start_date));
            const endDate = setDateToMidnight(new Date(intervention.end_date));
            
            // Find point where the intervention starts
            const startPoint = data.find((dataPoint) => 
                dataPoint.date && setDateToMidnight(dataPoint.date).getTime() >= startDate.getTime()
            );
            
            // Find point where the intervention ends
            const endPoint = data.findLast?.((dataPoint) => 
                dataPoint.date && setDateToMidnight(dataPoint.date).getTime() <= endDate.getTime()
            );
            
            if (startPoint && endPoint) {
                return [{
                    id: intervention.id,
                    startX: startPoint.x,
                    endX: endPoint.x,
                }];
            }
            return [];
        });
    }, [interventions, data]);

    const formatXLabel = useCallback(
        (value: number): string => {
            if (xAxisLabel) {
                return xAxisLabel(value);
            }

            if (!chartData.length) {
                return "";
            }

            const point = findPointAtX(chartData, value);
            return point?.label ?? "";
        },
        [xAxisLabel, chartData]
    );

    return (
        <View style={[styles.container, { borderColor: borderColour }]}>
            <Text type='strong' align='center' style={styles.title}>{title}</Text>
            <View style={styles.chart}>

                <Animated.View style={valueLabelStyle} pointerEvents="none">
                    { tooltipPoint != null && (
                        <Text type="caption" align='center'>{tooltipPoint.value}</Text>
                    )}
                </Animated.View>

                <CartesianChart
                    data={chartData}
                    xKey="x"
                    yKeys={["value", "mean", "upperBound", "lowerBound"]}
                    domainPadding={{ left: 50, right: 50, top: 20, bottom: 40 }}
                    chartPressState={state}
                    frame={{
                        lineWidth: { top: 0.5, right: 0, bottom: 0.5, left: 0 },
                        lineColor: gridColour,
                    }}
                    axisOptions={{
                        font: useFont(Inter_500Medium, 12),
                        labelColor: labelColour,
                        formatXLabel,
                        lineWidth: { grid: 0.5, frame: 0 },
                        lineColor: { grid: gridColour, frame: gridColour },
                    }}>
                        
                    {({ points, chartBounds }) => {
                        const valuePoints = points.value;

                        const interventionOverlay = interventionPeriods.map((interventionPeriod) => {
                            const startIndex = chartData.findIndex(d => d.x === interventionPeriod.startX);
                            const endIndex = chartData.findIndex(d => d.x === interventionPeriod.endX);
                            
                            if (startIndex === -1 || endIndex === -1) {
                                return null;
                            }
                            
                            const startX = valuePoints[startIndex].x;
                            const endX = valuePoints[endIndex].x;
                            const width = Math.max(0, endX - startX);
                            const height = chartBounds.bottom - chartBounds.top;

                            return (
                                <Rect
                                    key={interventionPeriod.id}
                                    x={startX}
                                    y={chartBounds.top}
                                    width={width}
                                    height={height}
                                    color={interventionColour}
                                />
                            );
                        });

                        return (
                            <>
                                {showInterventions && interventionOverlay}
                                {isActive && (
                                    <>
                                        <ToolTipLine
                                            xPosition={state.x.position}
                                            top={chartBounds.top}
                                            bottom={chartBounds.bottom}
                                            colour={dataColour}
                                        />
                                        <ToolTip x={state.x.position} y={state.y.value.position} color={dataColour} />
                                    </>
                                )}
                                {showRange && (
                                    <>
                                        <Line
                                            points={points.upperBound}
                                            color={standardDeviationColour}
                                            strokeWidth={2}
                                            strokeCap="round"
                                            strokeJoin="round"
                                        />
                                        <Line
                                            points={points.lowerBound}
                                            color={standardDeviationColour}
                                            strokeWidth={2}
                                            strokeCap="round"
                                            strokeJoin="round"
                                        />
                                    </>
                                )}
                                {showMean && (
                                    <Line
                                        points={points.mean}
                                        color={meanColour}
                                        strokeWidth={3}
                                        strokeCap="round"
                                        strokeJoin="round"
                                    />
                                )}
                                <Line 
                                    points={points.value}
                                    color={dataColour}
                                    strokeWidth={3}
                                    strokeCap="round"
                                    strokeJoin="round"
                                />
                                {valuePoints.map((point, index) => {
                                    if (!chartData[index]?.ruleBreached || point.x == null || point.y == null) {
                                        return null;
                                    }
                                    return (
                                        <Circle
                                            key={`rule-${index}`}
                                            cx={point.x as number}
                                            cy={point.y as number}
                                            r={5}
                                            color={warning}
                                        />
                                    );
                                })}
                            </>
                        );
                    }}
                </CartesianChart>
            </View>

            <Text type="caption" style={styles.timeLabel} align='center'>Time</Text>
            <View style={styles.labelsContainer}>
                <View style={styles.labelItem}>
                    <View style={[styles.labelLine, { backgroundColor: dataColour }]} />
                    <Text type="caption">Recorded Data</Text>
                </View>
                {showMean && (
                    <View style={styles.labelItem}>
                        <View style={[styles.labelLine, { backgroundColor: meanColour }]} />
                        <Text type="caption">Baseline</Text>
                    </View>
                )}
                {showRange && (
                    <View style={styles.labelItem}>
                        <View style={[styles.labelLine, { backgroundColor: standardDeviationColour }]} />
                        <Text type="caption">Control Limits (±3 SD)</Text>
                    </View>
                )}
                {showInterventions && interventionPeriods.length > 0 && (
                    <View style={styles.labelItem}>
                        <View style={[styles.labelDot, { backgroundColor: interventionColour }]} />
                        <Text type="caption">Intervention Period</Text>
                    </View>
                )}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    title: {
        marginVertical: 20,
    },
    container: {
        flex: 1,
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 20,
    },
    chart: {
        position: "relative",
        width: "100%",
        height: 360,
    },
    timeLabel: {
        marginTop: 20,
        marginBottom: 4,
    },
    labelsContainer: {
        marginVertical: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    labelItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    labelLine: {
        width: 10,
        height: 3,
        borderRadius: 4,
    },
    labelDot: {
        width: 10,
        height: 10,
        borderRadius: 4,
    }
});