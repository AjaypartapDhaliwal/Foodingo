import * as ImagePicker from 'expo-image-picker';
import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TextInput,
  FlatList,
  Button,
  Dimensions
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { auth, firebase} from '../config';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker';
import PantryItem from "../components/PantryItem";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const width = Dimensions.get("screen").width
const primaryColor = '#00bfff'
const secondaryColor = '#c6dde5'

const Stack = createNativeStackNavigator();

export default function PantryScreen({navigation}) {

  const [items, setItems] = useState([]);

  const itemRef = firebase.firestore().collection('items');
  const [inputName, setInputName] = useState('');
  const [inputQuantity, setInputQuantity] = useState('');
  const [inputExpiryDate, setInputExpiryDate] = useState('');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  
  useEffect(() => {
    itemRef.orderBy('createdAt', 'desc')
    .onSnapshot(
        querySnapshot => {
          const items = []
          querySnapshot.forEach((doc) => {
            const ownerID = doc.data().ownerID
            if (ownerID === auth.currentUser.uid) {
              const heading = doc.data().heading
              const expiryDate = doc.data().expiryDate
              const quantity = doc.data().quantity
              const daysLeft = dateDifference(new Date(
                changeDateFormat(expiryDate)), new Date())  
              if (daysLeft >= 0) {
                items.push({
                  id: doc.id,
                  heading,
                  expiryDate: expiryDate.toLocaleString(),
                  daysLeft: daysLeft + 1,
                  quantity
                })
              } else {
                itemRef.doc(doc.id).delete().then().catch((error) => alert(error))
              }
              items.sort((a, b) => { return a.daysLeft - b.daysLeft})
          }})
          setItems(items)
        }
    )
  }, [])

  const changeDateFormat = (date) => {
    const array = date.toString().split('/')
    return array[2] + '/' + array[1] + '/' + array[0]
  }

  const dateDifference = (date1, date2) => {
    return Math.ceil((date1 - date2) / (1000 * 60 * 60 * 24))
  }

  const addItem = () => {
    toggleModal()
    // check item is not empty
    if (inputName && inputName.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: inputName.toUpperCase(),
        expiryDate: inputExpiryDate,
        quantity: inputQuantity,
        createdAt: timestamp,
        ownerID: auth.currentUser.uid
      };

      itemRef
      .add(data)
      .then(() => {
        setInputName('')
        setInputQuantity('')
        setInputExpiryDate('')
        Keyboard.dismiss();
      })
      .catch((error) => {
        alert(error);
      })
    } else {
      if (!inputName) {
        alert('Please enter name')
      } else if (!inputQuantity) {
        alert('Please enter quantity')
      } else if (!inputExpiryDate) {
        alert('Please enter expiry date')
      }
    }
  }

  const askPermissionsAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    } else {
      takePictureAsync();
    }
  };

  const takePictureAsync = async () => {
    const { cancelled, uri, base64 } = await ImagePicker.launchCameraAsync({
      base64: true,
    });

    if (!cancelled) {
      navigation.navigate("Scanner", {imageData: base64});
    }
  };

  return (
      <View style={styles.container}>
        <FlatList
            showsVerticalScrollIndicator={false}
            data={items}
            numColumns={1}
            renderItem={({item}) => (
                <View>
                  <PantryItem id={item.id} heading={item.heading}
                              quantity={item.quantity}
                              expiryDate={item.expiryDate} navigation={navigation}
                              daysLeft={item.daysLeft}/>
                </View>
            )}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity 
              style={styles.scanButton} 
              activeOpacity={0.9} 
              onPress={askPermissionsAsync}>
            <Ionicons name="ios-camera-outline" size={50} />
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.addButton}
              onPress={toggleModal}
              activeOpacity={0.9}>
            <Ionicons name="add-outline" size={50} />
          </TouchableOpacity>
        </View>
        <Modal isVisible={isModalVisible}>
          <View>
            <Text style={styles.formLabel}>
              Add Item
            </Text>

            <View>
              <TextInput placeholderTextColor='#5d5c5e' placeholder='Name '
                         value={inputName}
                         style={styles.inputStyle}
                         onChangeText={(n) => setInputName(n)}
              />
              <TextInput placeholderTextColor='#5d5c5e' placeholder='Quantity'
                         value={inputQuantity}
                         style={styles.inputStyle}
                         onChangeText={(q) => setInputQuantity(q)}
              />
              <DatePicker
                  style={styles.datePickerStyle}
                  date={inputExpiryDate} //initial date from state
                  mode="date" //The enum of date, datetime and time
                  placeholder="Select Expiry Date"
                  format="DD/MM/YYYY"
                  minDate="01-01-2020"
                  maxDate="01-01-2030"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                    },
                    dateInput: {
                      marginLeft: 36,
                      backgroundColor: '#DCDCDC',
                      borderColor: 'white',
                      borderRadius: 50
                    },
                    placeholderText: {
                      color: '#5d5c5e'
                    }
                  }}
                  onDateChange={(date) => {setInputExpiryDate(date);
                  }}
              />
            </View>
            <View style={{padding: 10}}>
              <Button title="Submit"
                      onPress={addItem}/>
              <Button title="Go Back" 
                      onPress={toggleModal}/>
            </View>
          </View>
        </Modal>
        <StatusBar style="auto"/>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  flatListContainer: {
    flex: 1,
    backgroundColor: '#bee5b0',
    justifyContent: 'center',
    height: 70,
    width: width - 20,
    borderRadius: 10,
    marginVertical: 5,
  },

  circular: {
    width: 20,
    height: 20,
    marginRight: 20,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 50,
  },

  datePickerStyle: {
    marginTop: 20,
    width: 320,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignSelf: 'center',
  },

  addButton: {
    alignItems: 'center',
    width: width / 2 - 5,
    height: 65,
    backgroundColor: primaryColor,
    borderRadius: 10,
    marginBottom: 8,
    padding: '1%'
  },

  scanButton: {
    alignItems: 'center',
    width: width / 2 - 5,
    height: 65,
    backgroundColor: primaryColor,
    borderRadius: 10,
    marginBottom: 8,
    padding: '1%'
  },

  formLabel: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },

  inputStyle: {
    marginTop: 20,
    width: 300,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#DCDCDC',
    alignSelf: 'center',
    color: 'black'
  },

  submitButton: {
    height: 85,
    flex: 1,
    backgroundColor: "#FFBB34",
    borderColor: "#555555",
    borderWidth: 0,
    borderRadius: 0,
    marginTop: 200,
    justifyContent: "flex-start"
  }
});

