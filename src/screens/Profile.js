import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import Food from '../assets/accountBackgroundItems/Food'

function ProfileScreen({route}) {

  const url = route.params.url;
  const name = route.params.name;
  const university = route.params.university
  const halls = route.params.halls
  const phoneNumber = route.params.phoneNumber
  const diet = route.params.diet

  return (

        <View style={styles.container}>
            <Food />
            <View style={styles.profileContainer}>
                <View style={{alignSelf: "center"}}>

                    <View style={styles.profileImage}>
                        <Image source={{uri: url}} style={styles.image} resizeMode="center">
                        </Image>
                    </View>

                </View>

                <View style={styles.name}>
                    <Text style={[styles.text, { color: "black", fontSize: 28}]}>{name}</Text>
                </View>

                <View style={styles.statsContainer}>

                    <View style={styles.statsBox}>
                        <Text style={[styles.text, { fontSize: 18}]}>University</Text>
                        <Text style={[styles.text, styles.subText]}>{university}</Text>
                    </View>

                    <View style={styles.statsBox}>
                        <Text style={[styles.text, { fontSize: 18}]}>Halls</Text>
                        <Text style={[styles.text, styles.subText]}>{halls}</Text>
                    </View>

                    <View style={styles.statsBox}>
                        <Text style={[styles.text, { fontSize: 18}]}>Phone Number</Text>
                        <Text style={[styles.text, styles.subText]}>{phoneNumber}</Text>
                    </View>

                    <View style={styles.statsBox}>
                        <Text style={[styles.text, { fontSize: 18}]}>Diet</Text>
                        <Text style={[styles.text, styles.subText]}>{diet}</Text>
                    </View>

                </View>
            </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'c2ffff'
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'transparent'
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontFamily: "HelveticaNeue",
    color: "#52575D",
    fontWeight: 'bold'
  },
  subText: {
    fontSize: 10,
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: 'bold'
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined
  },
  profileImage: {
    width: 200,
    height: 200,
    overflow: "hidden",
    borderRadius: 200,
    borderWidth: 5,
    borderColor: "#00bfff",
    borderStyle: 'solid',
    marginTop: 20,
  },
  name: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
    height: 70
  },
  statsContainer: {
    flexDirection: "column",
    alignSelf: "center",
    marginTop: 1,
    height: 250,
  },
  statsBox: {
    alignItems: "center",
    justifyContent: 'center',
    flex: 1,
    borderColor: "#DFD8C8",
    borderTopWidth: 1,
  }
});

export default ProfileScreen;