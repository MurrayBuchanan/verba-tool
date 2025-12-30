import React from 'react'; 
import { TextInput, StyleSheet, View, Text, KeyboardTypeOptions } from 'react-native'; 

type Props = { 
    label?: string;
    placeholder?: string;
    value: string; 
    onChangeText: (text: string) => void; 
    secureTextEntry?: boolean; 
    keyboardType?: KeyboardTypeOptions; 
}; 

export const TextField = ({ label, placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default' }: Props) => { 
    return ( 
        <View style={styles.container}> 
            {label && <Text style={styles.label}>{label}</Text>} 
            <TextInput 
                style={styles.input} 
                placeholder={placeholder} 
                placeholderTextColor="#999" 
                value={value} 
                onChangeText={onChangeText} 
                secureTextEntry={secureTextEntry} 
                autoCorrect={true} 
                keyboardType={keyboardType} 
            /> 
        </View> 
    ); 
}; 

const styles = StyleSheet.create({ 
    container: { 
        width: '100%', 
        marginVertical: 14, 
    }, 
    label: { 
        fontSize: 18,
        fontWeight: '600', 
        marginBottom: 6, 
        color: '#222', 
    }, 
    input: { 
        paddingVertical: 16, 
        paddingHorizontal: 18, 
        fontSize: 18,
        backgroundColor: '#FFF', 
        borderRadius: 12, 
        borderWidth: 2,
        borderColor: '#CCC', }, 
        description: { fontSize: 16, 
        color: '#555',
        marginTop: 6, 
        lineHeight: 22, 
    }, 
});