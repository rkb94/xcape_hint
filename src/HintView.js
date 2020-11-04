import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    Text,
    View, 
    ScrollView
} from 'react-native';

function HintView({hint}) {
    return (
        <View style={styles.HintView__container}>
            <ScrollView>
                <Text 
                    style={styles.HintView__hintText}
                >
                    {hint}
                </Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    HintView__container: {
        display: 'flex',
        marginBottom: 20,
        width: '100%',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 200,
        borderRadius: 15
    },
    HintView__hintText: {
        padding: 10,
        color: 'white',
        fontSize: 25
    }
});

export default HintView