import React from "react";
import { View, StyleSheet } from "react-native";

export function List({ children }: { children: React.ReactNode }) {
  	const items = React.Children.toArray(children);

  	return (
    	<View style={styles.container}>
     		{items.map((child, index) => (
        		<View key={index}>
          			<View style={styles.item}>{child}</View>
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
});
