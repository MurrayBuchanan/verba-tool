import { StyleSheet, View } from "react-native";
import { ThemedText as Text } from "@/components/themed-text";
import { CartesianChart, Line, AreaRange } from "victory-native";
import { useCustomFont } from "@/hooks/use-custom-font";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useMemo } from "react";
import { Intervention } from "@/constants/transcript";
import { Rect } from "@shopify/react-native-skia";

type DataPoint = {
    x: number;
    value: number;
    label?: string;
    grouping?: "Day" | "Week" | "Month";
    date?: Date;
};

type MetricChartProps = {
    data: DataPoint[];
    xAxisLabel?: (value: number) => string;
    title?: string;
    interventions?: Intervention[];
    showMean: boolean;
    showRange: boolean;
    showInterventions: boolean;
};

function calculateMean(values: number[]): number {
    if (values.length === 0) {
        return 0;
    }
    
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum / values.length;
}

function calculateStandardDeviation(values: number[], mean: number): number {
    if (values.length < 2) {
        return 0;
    }
    
    let sumSquaredDifferences = 0;
    for (let i = 0; i < values.length; i++) {
        const difference = values[i] - mean;
        const squared = difference * difference;
        sumSquaredDifferences += squared;
    }
    
    const variance = sumSquaredDifferences / (values.length - 1);
    return Math.sqrt(variance);
}


export function MetricChart({ data, xAxisLabel, title, interventions = [], showMean = true, showRange = true, showInterventions = true }: MetricChartProps) {
    const font = useCustomFont("500", 12);
    const labelColour = useThemeColor({}, 'text');
    const dataColour = useThemeColor({}, 'accent');
    const meanColour = useThemeColor({}, 'meanColour');
    const standardDeviationColour = useThemeColor({}, 'standardDeviationColour');
    const interventionColour = useThemeColor({}, 'interventionColour');

    const chartData = useMemo(() => {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const point = data[i];
            const values = [];
            for (let j = 0; j <= i; j++) {
                values.push(data[j].value);
            }
            
            const mean = calculateMean(values);
            const standardDeviation = calculateStandardDeviation(values, mean);
            
            result.push({
                x: point.x,
                value: point.value,
                mean,
                upperBound: mean + standardDeviation,
                lowerBound: mean - standardDeviation,
                label: point.label
            });
        }
        return result;
    }, [data]);

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

    function formatXLabel(value: number): string {
        if (xAxisLabel) {
            return xAxisLabel(value);
        }
        const point = data.find(dataPoint => dataPoint.x === value);
        if (point && point.label) {
            return point.label;
        }
        return "";
    }
    
    return (
        <View>
            <Text style={styles.title} align="center">{title}</Text>
            <View style={styles.container}>
                <CartesianChart
                    data={chartData}
                    xKey="x"
                    yKeys={["value", "mean", "upperBound", "lowerBound"]}
                    domainPadding={{ left: 50, right: 50, top: 20, bottom: 40 }}
                    axisOptions={{ font, labelColor: labelColour, formatXLabel }}>
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
                                {showRange && (
                                    <AreaRange
                                        upperPoints={points.upperBound}
                                        lowerPoints={points.lowerBound}
                                        color={standardDeviationColour}
                                    />
                                )}
                                {showMean && (
                                    <Line
                                        points={points.mean}
                                        color={meanColour}
                                        strokeWidth={2}
                                    />
                                )}
                                <Line 
                                    points={points.value}
                                    color={dataColour}
                                    strokeWidth={3}
                                />
                            </>
                        );
                    }}
                </CartesianChart>
            </View>
            <Text style={styles.xAxisLabel} align="center">{data[0].grouping}</Text>
        
            <View style={styles.labelsContainer}>
                <View style={styles.labelItem}>
                    <View style={[styles.labelLine, { backgroundColor: dataColour, height: 3 }]} />
                    <Text style={styles.labelText}>Recorded Values</Text>
                </View>
                {showMean && (
                    <View style={styles.labelItem}>
                        <View style={[styles.labelLine, { backgroundColor: meanColour, opacity: 0.6 }]} />
                        <Text style={styles.labelText}>Mean</Text>
                    </View>
                )}
                {showRange && (
                    <View style={styles.labelItem}>
                        <View style={[styles.labelSquare, { backgroundColor: standardDeviationColour }]} />
                        <Text style={styles.labelText}>Range</Text>
                    </View>
                )}
                {showInterventions && interventionPeriods.length > 0 && (
                    <View style={styles.labelItem}>
                        <View style={[styles.labelSquare, { backgroundColor: interventionColour }]} />
                        <Text style={styles.labelText}>Intervention Period</Text>
                    </View>
                )}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginVertical: 16,
    },
    container: {
        position: "relative",
        width: "100%",
        height: 300,
    },
    xAxisLabel: {
        fontSize: 12,
        marginTop: 16,
    },
    labelsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
        gap: 24,
        flexWrap: "wrap",
    },
    labelItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    labelLine: {
        width: 18,
        height: 3,
        borderRadius: 2,
    },
    labelSquare: {
        width: 10,
        height: 10,
        borderRadius: 3,
    },
    labelText: {
        fontSize: 13,
        fontWeight: "500",
        letterSpacing: 0.1,
        opacity: 0.85,
    },
});