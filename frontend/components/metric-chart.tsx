import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { CartesianChart, Line, AreaRange } from "victory-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCustomFont } from "@/hooks/use-custom-font";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMemo } from "react";

type DataPoint = {
    x: number;
    value: number;
    label?: string;
    grouping?: "day" | "week" | "month";
};

type MetricChartProps = {
    data: DataPoint[];
    xAxisLabel?: (value: number) => string;
    title?: string;
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

export function MetricChart({ data, xAxisLabel, title}: MetricChartProps) {
    const colorScheme = useColorScheme() ?? "light"; 
    const font = useCustomFont("500", 12);
    const textColor = useThemeColor({}, "text");
    const dataColor = Colors[colorScheme].tint;
    const meanColor = useThemeColor({ light: "#6B7280", dark: "#9CA3AF"}, "text");
    const sdColor = useThemeColor({ light: "rgba(47, 110, 228, 0.15)", dark: "rgba(90, 140, 255, 0.15)" }, "text");

    const chartData = useMemo(() => {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const point = data[i];
            const values = [];
            for (let j = 0; j <= i; j++) {
                values.push(data[j].value);
            }
            
            const mean = calculateMean(values);
            const sd = calculateStandardDeviation(values, mean);
            
            result.push({
                x: point.x,
                value: point.value,
                mean,
                upperBound: mean + sd,
                lowerBound: mean - sd,
                label: point.label
            });
        }
        return result;
    }, [data]);
    
    const grouping = data.length > 0 ? data[0]?.grouping : undefined;
    
    function formatXLabel(value: number): string {
        if (xAxisLabel) {
            return xAxisLabel(value);
        }
        const point = data.find(d => d.x === value);
        if (point && point.label) {
            return point.label;
        }
        return "";
    }
    
    function getXAxisTitle(): string {
        if (grouping === "day") {
            return "Date";
        }
        if (grouping === "week") {
            return "Week";
        }
        if (grouping === "month") {
            return "Month";
        }
        return "Time";
    }

    return (
        <ThemedView style={styles.container} lightColor={Colors.light.secondaryBackground} darkColor={Colors.dark.secondaryBackground}>
            <Text align="center" style={styles.title}>{title}</Text>
            <CartesianChart
                data={chartData}
                xKey="x"
                yKeys={["value", "mean", "upperBound", "lowerBound"]}
                domainPadding={{ left: 50, right: 50, top: 20, bottom: 40 }}
                axisOptions={{ 
                    font,
                    labelColor: textColor,
                    formatXLabel,
                }}
            >
                {({ points }) => (
                    <>
                        <AreaRange
                            upperPoints={points.upperBound}
                            lowerPoints={points.lowerBound}
                            color={sdColor}
                        />
                        <Line
                            points={points.mean}
                            color={meanColor}
                            strokeWidth={2}
                        />
                        <Line 
                            points={points.value}
                            color={dataColor}
                            strokeWidth={3}
                        />
                    </>
                )}
            </CartesianChart>
            <Text style={styles.xAxisLabel} align="center">{getXAxisTitle()}</Text>
        
            <View style={styles.labelsContainer}>
                <View style={styles.labelItem}>
                    <View style={[styles.labelLine, { backgroundColor: dataColor, height: 3 }]} />
                    <Text style={styles.labelText}>Recorded Values</Text>
                </View>
                <View style={styles.labelItem}>
                    <View style={[styles.labelLine, { backgroundColor: meanColor, opacity: 0.6 }]} />
                    <Text style={styles.labelText}>Mean</Text>
                </View>
                <View style={styles.labelItem}>
                    <View style={[styles.labelDot, { backgroundColor: sdColor }]} />
                    <Text style={styles.labelText}>Range</Text>
                </View>
            </View>
        </ThemedView>
    );
}
const styles = StyleSheet.create({
     container: {
        width: "100%",
        maxWidth: 600,
        height: 400,
        marginVertical: 8,
        borderRadius: 12,
        padding: 20,
        alignSelf: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 20,
        letterSpacing: 0.2,
    },
    xAxisLabel: {
        fontSize: 12,
        fontWeight: "500",
        marginTop: 12,
        textAlign: "center",
        opacity: 0.7,
        letterSpacing: 0.3,
        textTransform: "uppercase",
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
    labelDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    labelText: {
        fontSize: 13,
        fontWeight: "500",
        letterSpacing: 0.1,
        opacity: 0.85,
    },
});