import React, {useRef, useEffect, useState} from 'react';
import {Animated, StyleSheet, Easing} from 'react-native';

const styles = StyleSheet.create({
    fooditem: {
        position: 'absolute',
    }
});

const START_Y_POSITION = -100;
const FOODITEM_TYPES = ['🍞','🍖','🍗','🍔','🍟','🍕','🥞','🥯','🥨','🧆','🌯','🌮','🥗',
    ,'🧇','🧀','🥚','🥘','🥣','🍿','🍳','🍲','🍛','🍠','🍝','🍤','🍣','🍡','🥡'];

export default function Fooditem({scene}) {
    const [config, setConfig] = useState(() => getConfig());
    const animatedY = useRef(new Animated.Value(START_Y_POSITION)).current;

    const runAnimation = () => {
        animatedY.setValue(START_Y_POSITION);
        Animated.sequence([
            Animated.delay(config.fallDelay),
            Animated.timing(animatedY, {
                toValue: scene.height,
                duration: config.fallDuration,
                easing: Easing.linear,
                useNativeDriver: true,

            }),
        ]).start(() =>{
            const newConfig = getConfig();
            setConfig(newConfig);
        });
    };

    useEffect(() => {
        if (config) {
            runAnimation();
        }
    }, [config]);

    return (
        <Animated.Text
            style={[
                styles.fooditem,
                {
                    left: config.xPosition,
                    fontSize: config.size,
                    opacity: config.opacity,
                    transform: [{translateY: animatedY}],
                },
            ]}>
            {config.type}
        </Animated.Text>
    )
}

function getConfig(scene) {
    const size = 50;
    const opacity = randomInt(1,2) / 10;
    const type = FOODITEM_TYPES[randomInt(0,FOODITEM_TYPES.length - 1)];
    const xPosition = `${randomInt(0,100)}%`;

    const fallDuration = randomInt(30000,50000);
    const fallDelay = randomInt(500,10000);
    return {
        size,
        opacity,
        type,
        xPosition,
        fallDelay,
        fallDuration,
    };
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}