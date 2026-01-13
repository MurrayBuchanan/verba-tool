import { StyleSheet } from "react-native";
import { ThemedView as View } from "@/components/themed-view";
import { CartesianChart, Line } from "victory-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCustomFont } from "@/hooks/use-custom-font";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";


type DataPoint = {
    x: number;
    value: number;
    label?: string;
};

type ChartProps = {
    data: DataPoint[];
    xAxisLabel?: (value: number) => string;
};

// TODO: Add mean and SD lines (maybe toggles)

export function Chart({ data, xAxisLabel }: ChartProps) {
    const font = useCustomFont('600', 12);
    const textColor = useThemeColor({}, 'text');
    const colorScheme = useColorScheme() ?? 'light';
    const lineColor = Colors[colorScheme].tint;

    const defaultXAxisLabel = (value: number) => {
        const point = data.find(d => d.x === value);
        return point?.label || `#${value}`;
    };

    return (
        <View style={styles.chartContainer} lightColor={Colors.light.secondaryBackground} darkColor={Colors.dark.secondaryBackground}>
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
                {({ points }) => (
                    <Line 
                        points={points.value}
                        color={lineColor}
                        strokeWidth={3}/>
                )}
            </CartesianChart>
        </View>
    );
  }
const styles = StyleSheet.create({
	chartContainer: {
        marginVertical: 12,
		width: 350,
		height: 200,
		borderRadius: 12,
		padding: 16,
	},
});
