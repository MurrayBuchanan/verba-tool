import { StyleSheet } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { CartesianChart, Bar } from "victory-native";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import { useThemeColor } from "@/hooks/use-theme-color";

// Example from: https://nearform.com/open-source/victory-native/docs/cartesian/guides/basic-bar-chart

type DataPoint = {
    month: number;
    score: number;
};

type BarGraphProps = {
    data: DataPoint[];
};

export function BarGraph({ data }: BarGraphProps) {
    const font = useFont(require("@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf"), 12);
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={styles.chartWrapper}>
            <CartesianChart
                data={data}
                xKey="month"
                yKeys={["score"]}
                domainPadding={{ left: 35, right: 35, top: 20 }}
                axisOptions={{ 
                    font,
                    labelColor: textColor,
                    formatXLabel: (value) => {
                        const date = new Date(2025, value - 1);
                        return date.toLocaleString("default", { month: "short" });
                    },
            }}>
                {({ points, chartBounds }) => (
                    <Bar
                        chartBounds={chartBounds}
                        points={points.score}
                        roundedCorners={{ topLeft: 5, topRight: 5 }}>
                        <LinearGradient start={vec(0, 0)} end={vec(0, 400)} colors={["#371B34", "#a78bfa00"]}
                        />
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
