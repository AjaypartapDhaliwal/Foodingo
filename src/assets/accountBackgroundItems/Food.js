import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Fooditem from './FoodItem';

const dimensions = Dimensions.get('window');

export default function Food({foodCount = 5}) {

    return (
        <View
            style={[
                styles.container,
                {width: dimensions.width, height: dimensions.height},
            ]}>
            {new Array(foodCount).fill(true).map((_, i) => (
                <Fooditem key={i} scene={dimensions} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute'
    }
});