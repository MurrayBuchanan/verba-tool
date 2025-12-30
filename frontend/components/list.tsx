import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView as View } from "@/components/themed-view";

export type ListProps = {
	children: React.ReactNode;
	divider?: boolean;
};

export function List({ children, divider = false }: ListProps) {
  	const items = React.Children.toArray(children);

  	return (
    	<View style={styles.container}>
     		{items.map((child, index) => (
        		<View key={index}>
          			<View style={styles.item}>{child}</View>
          			{divider && index < items.length - 1 && (
            			<View lightColor="#E0E0E0" darkColor="#424242" style={styles.divider} />
          			)}
        		</View>
      		))}
    	</View>
  	);
}

const styles = StyleSheet.create({
  	container: {
    	flexDirection: "column",
  	},
  	item: {
    	paddingVertical: 4,
  	},
  	divider: {
    	height: StyleSheet.hairlineWidth,
  	},
});
