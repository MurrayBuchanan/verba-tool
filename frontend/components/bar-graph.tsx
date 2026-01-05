import { StyleSheet } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { CartesianChart, Bar } from "victory-native";
import { LinearGradient, vec } from "@shopify/react-native-skia";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCustomFont } from "@/hooks/use-custom-font";

// Example from: https://nearform.com/open-source/victory-native/docs/cartesian/guides/basic-bar-chart

type DataPoint = {
    x: number;
    value: number;
    label?: string;
};

type BarGraphProps = {
    data: DataPoint[];
    xAxisLabel?: (value: number) => string;
};

export function BarGraph({ data, xAxisLabel }: BarGraphProps) {
    const font = useCustomFont('600', 12);
    const textColor = useThemeColor({}, 'text');

    const defaultXAxisLabel = (value: number) => {
        const point = data.find(d => d.x === value);
        return point?.label || `#${value}`;
    };

    return (
        <View style={styles.chartWrapper}>
            <CartesianChart
                data={data}
                xKey="x"
                yKeys={["value"]}
                domainPadding={{ left: 35, right: 35, top: 20 }}
                
                axisOptions={{ 
                    font,
                    labelColor: textColor,
                    formatXLabel: xAxisLabel || defaultXAxisLabel,
            }}>
                {({ points, chartBounds }) => (
                    <Bar 
                        chartBounds={chartBounds} 
                        points={points.value}
                        roundedCorners={{ topLeft: 5, topRight: 5 }}>                        
                        <LinearGradient start={vec(0, 0)} end={vec(0, 400)} colors={["#538BFA", "#B8CDF7"]}/>
                    </Bar>
                )}
            </CartesianChart>
        </View>
    );
  }
const styles = StyleSheet.create({
	chartWrapper: {
		width: 350,
		height: 200,
	},
});
