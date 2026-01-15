import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText as Text } from "@/components/themed-text";
import { CartesianChart, Line, AreaRange } from "victory-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCustomFont } from "@/hooks/use-custom-font";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMemo, useRef, useEffect } from "react";

type DataPoint = {
    x: number;
    value: number;
    label?: string;
};

type ChartProps = {
    data: DataPoint[];
    xAxisLabel?: (value: number) => string;
};

function calculateMean(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum / numbers.length;
}

function calculateStandardDeviation(values: number[], mean: number): number {
    if (values.length < 2) return 0;
    
    const squaredDifferences = values.map(value => {
        const difference = value - mean;
        return Math.pow(difference, 2);
    });
    
    const sumSquaredDifferences = squaredDifferences.reduce((total, squaredDiff) => total + squaredDiff, 0);
    
    // Uses Bessel's correction (n-1)
    const variance = sumSquaredDifferences / (values.length - 1);
    
    return Math.sqrt(variance);
}

export function Chart({ data, xAxisLabel }: ChartProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const font = useCustomFont('500', 12);
    const fontRef = useRef(font);
    
    // Uses the cached font after it's loaded once
    useEffect(() => {
        if (font) {
            fontRef.current = font;
        }
    }, [font]);
    
    const chartFont = font || fontRef.current;
    const textColor = useThemeColor({}, 'text');
    const dataColor = Colors[colorScheme].tint;
    const meanColor = useThemeColor({ light: '#E4502F', dark: '#E4502F'}, 'text');
    const sdColor = useThemeColor({ light: '#E4C62F', dark: '#E4C62F' }, 'text');


    const chartData = useMemo(() => {
        return data.map((point, index) => {
            const valuesUpToPoint = data.slice(0, index + 1).map(d => d.value);
            
            const mean = calculateMean(valuesUpToPoint);
            const sd = calculateStandardDeviation(valuesUpToPoint, mean);
            
            return {
                x: point.x,
                value: point.value,
                mean: mean,
                upperBound: mean + sd,
                lowerBound: mean - sd,
                label: point.label
            };
        });
    }, [data]);
    
    const formatXLabel = (value: number) => {
        if (xAxisLabel) {
            return xAxisLabel(value);
        }
        
        const point = data.find(d => d.x === value);
        if (point?.label) {
            return point.label;
        }
        
        return `#${value}`;
    };

    return (
        <ThemedView 
            style={styles.chartContainer} 
            lightColor={Colors.light.secondaryBackground} 
            darkColor={Colors.dark.secondaryBackground}
        >
            {chartFont && (
            <>
                <Text align="center" style={styles.chartTitle}>Changes over time</Text>
                <CartesianChart
                    data={chartData}
                    xKey="x"
                    yKeys={["value", "mean", "upperBound", "lowerBound"]}
                    domainPadding={{ left: 35, right: 35, top: 20 }}
                    axisOptions={{ 
                        font: chartFont,
                        labelColor: textColor,
                        formatXLabel: formatXLabel,
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
            
                <View style={styles.labelsContainer}>
                    <View style={styles.labelItem}>
                        <View style={[styles.labelDot, { backgroundColor: dataColor }]} />
                        <Text style={styles.labelText}>Data</Text>
                    </View>
                    <View style={styles.labelItem}>
                        <View style={[styles.labelDot, { backgroundColor: meanColor }]} />
                        <Text style={styles.labelText}>Baseline</Text>
                    </View>
                    <View style={styles.labelItem}>
                        <View style={[styles.labelDot, { backgroundColor: sdColor }]} />
                        <Text style={styles.labelText}>Range</Text>
                    </View>
                </View>
            </>
            )}
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    chartContainer: {
        marginVertical: 12,
        width: 350,
        height: 250,
        borderRadius: 12,
        padding: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        gap: 20,
    },
    labelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    labelDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    labelText: {
        fontSize: 12,
        fontWeight: '500',
    },
});
