import React, { useEffect, useState } from 'react';
import { FlatList, Button, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable } from 'react-native';
import { auth, firebase } from '../config';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker';

const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
const width = Dimensions.get("screen").width
const primaryColor = '#00bfff'
const list_of_food = 
[
  {
    name: "POT NOODLE",
    date: 240,
    img: require('../assets/wheat.png')
  },
  {
    name: "SPRING ONION",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "AUBERGINE",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "WASABI PUMPKIN KATSU",
    date: 3,
    img: require('../assets/wheat.png')
  },
  {
    name: "RICE",
    date: 180,
    img: require('../assets/wheat.png')
  },
  {
    name: "FLOUR",
    date: 180,
    img: require('../assets/wheat.png')
  },
  {
    name: "BEANCURD",
    date: 120,
    img: require('../assets/wheat.png')
  },
  {
    name: "BAMBOO LEAVES",
    date: 360,
    img: require('../assets/wheat.png')
  },
  {
    name: "SESAME SNAPS",
    date: 120,
    img: require('../assets/wheat.png')
  },
  {
    name: "EGGS",
    date: 21,
    img: require('../assets/wheat.png')
  },
  {
    name: "MILK",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "BREAD",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "YOGHURT",
    date: 14,
    img: require('../assets/wheat.png')
  },
  {
    name: "MINCE",
    date: 3,
    img: require('../assets/wheat.png')
  },
  {
    name: "APPLE",
    date: 4,
    img: require('../assets/wheat.png')
  },
  {
    name: "BANANA",
    date: 3,
    img: require('../assets/wheat.png')
  },
  {
    name: "ORANGE",
    date: 7,
    img: require('../assets/wheat.png')
  },
  {
    name: "PEAR",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "GRAPES",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "PEACH",
    date: 3,
    img: require('../assets/wheat.png')
  },
  {
    name: "LEMON",
    date: 10,
    img: require('../assets/wheat.png')
  },
  {
    name: "CARROTS",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "MUSHROOMS",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "LETTUCE",
    date: 12,
    img: require('../assets/wheat.png')
  },
  {
    name: "CUCUMBER",
    date: 7,
    img: require('../assets/wheat.png')
  },
  {
    name: "TOMATO",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "TOMATOES",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "PEPPER",
    date: 10,
    img: require('../assets/wheat.png')
  },
  {
    name: "POTATOES",
    date: 120,
    img: require('../assets/wheat.png')
  },
  {
    name: "ONION",
    date: 90,
    img: require('../assets/wheat.png')
  },
  {
    name: "FROZEN VEG",
    date: 365,
    img: require('../assets/wheat.png')
  },
  {
    name: "ASPARAGUS",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "BEANS",
    date: 6,
    img: require('../assets/wheat.png')
  },
  {
    name: "BROCCOLI",
    date: 7,
    img: require('../assets/wheat.png')
  },
  {
    name: "CABBAGE",
    date: 60,
    img: require('../assets/wheat.png')
  },
  {
    name: "CAPSICUM",
    date: 14,
    img: require('../assets/wheat.png')
  },
  {
    name: "CAULIFLOWER",
    date: 14,
    img: require('../assets/wheat.png')
  },
  {
    name: "CELERY",
    date: 28,
    img: require('../assets/wheat.png')
  },
  {
    name: "CORN",
    date: 3,
    img: require('../assets/wheat.png')
  },
  {
    name: "CUCUMBER",
    date: 12,
    img: require('../assets/wheat.png')
  },
  {
    name: "EGGPLANT",
    date: 12,
    img: require('../assets/wheat.png')
  },
  {
    name: "PEAS",
    date: 6,
    img: require('../assets/wheat.png')
  },
  {
    name: "AVOCADO",
    date: 3,
    img: require('../assets/wheat.png')
  },
  {
    name: "KIWI",
    date: 7,
    img: require('../assets/wheat.png')
  },
  {
    name: "STRAWBERRIES",
    date: 3,
    img: require('../assets/wheat.png')
  },
  {
    name: "WATERMELON",
    date: 8,
    img: require('../assets/wheat.png')
  },
  {
    name: "BEEF",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "LAMB",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "STEAK",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "MINCE",
    date: 3,
    img: require('../assets/wheat.png')
  },
  {
    name: "SAUSAGES",
    date: 7,
    img: require('../assets/wheat.png')
  },
  {
    name: "TUNA",
    date: 365,
    img: require('../assets/wheat.png')
  },
  {
    name: "PRAWNS",
    date: 4,
    img: require('../assets/wheat.png')
  },
  {
    name: "CHICKEN",
    date: 4,
    img: require('../assets/wheat.png')
  },
    {
    name: "TOFU",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "CREAM",
    date: 5,
    img: require('../assets/wheat.png')
  },
  {
    name: "ICE CREAM",
    date: 60,
    img: require('../assets/wheat.png')
  },
  {
    name: "CREAM CHEESE",
    date: 14,
    img: require('../assets/wheat.png')
  },
  {
    name: "BUTTER",
    date: 60,
    img: require('../assets/wheat.png')
  },
  {
    name: "MARGARINE",
    date: 120,
    img: require('../assets/wheat.png')
  },
  {
    name: "VEGETABLE OIL",
    date: 120,
    img: require('../assets/wheat.png')
  },
  {
    name: "OLIVE OIL",
    date: 14,
    img: require('../assets/wheat.png')
  },
  {
    name: "CHOCOLATE",
    date: 300,
    img: require('../assets/wheat.png')
  },
  {
    name: "BROWN RICE",
    date: 120,
    img: require('../assets/wheat.png')
  },
  {
    name: "CEREAL",
    date: 365,
    img: require('../assets/wheat.png')
  },
  {
    name: "CAKE",
    date: 7,
    img: require('../assets/wheat.png')
  },
  {
    name: "COOKIES",
    date: 7,
    img: require('../assets/wheat.png')
  },
  {
    name: "MUFFINS",
    date: 7,
    img: require('../assets/wheat.png')
  },
  {
    name: "MAYO",
    date: 60,
    img: require('../assets/wheat.png')
  },
  {
    name: "MAYONNAISE",
    date: 60,
    img: require('../assets/wheat.png')
  },
  {
    name: "KETCHUP",
    date: 150,
    img: require('../assets/wheat.png')
  },
  {
    name: "JUICE",
    date: 14,
    img: require('../assets/wheat.png')
  },
]



async function callGoogleVisionAsync(image) {
  
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
						type: 'DOCUMENT_TEXT_DETECTION', 
						maxResults: 1
          }
        ],
      },
    ],
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  return result.responses;
}

export default function ScannerScreen({route, navigation}){

  const itemRef = firebase.firestore().collection('items');
  
  const [items, setItems] = React.useState([]);

  const [inputName, setInputName] = useState('')
  const [inputQuantity, setInputQuantity] = useState('')
  const [inputExpiryDate, setInputExpiryDate] = useState('')
 
  const [isSubmitVisible, setIsSubmitVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  async function fetchResults() {
    try {
      const base64 = route.params.imageData;
      const result = await callGoogleVisionAsync(base64);
      const recipetList = result[0].textAnnotations[0].description
      var items_with_date = []
      var count = 0;
      for (const key in list_of_food) {
        const food = list_of_food[key]
        if (recipetList.includes(food.name)) {
          var date = new Date();
          date.setDate(date.getDate() + food.date);
          count++;
          items_with_date.push({
            id: count,
            name: food.name,
            quantity: 1,
            expiryDate: date.toLocaleDateString(),
            img: food.img
          });
        }
      }
      setIsSubmitVisible(true);
      setItems(items_with_date);
    } catch (error) {
      setItems(`Undefined Text`);
    }
  }

  useEffect(() => {
    fetchResults();  
  }, [])

  const addItems = () => {
    // check item is not empty
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    for (var key in items) {
      const item = items[key]
      const data = {
        heading: item.name,
        expiryDate: item.expiryDate,
        quantity: item.quantity,
        ownerID: auth.currentUser.uid,
        createdAt: timestamp
      };
      itemRef
      .add(data)
      .catch((error) => {
        alert(error);
      })
    }
    navigation.navigate("Pantry")
  }

  const editItem = (id) => {
    toggleModal();
    // check item is not empty
    if (inputName && inputName.length > 0) {
      for (var key in items) {
        const item = items[key];
        if (item.id == id) {
          item.name = inputName;
          item.quantity = inputQuantity;
          item.expiryDate = inputExpiryDate;
        }
      }
    
    } else {
      if (!inputName) {
        alert('Please input name');
      } else if (!inputQuantity) {
        alert('Please input quantity');
      } else if (!inputExpiryDate) {
        alert('Please input expiry date');
      }
    }
  }

  const ItemDivider = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "grey"
        }}
      />
    );
  }

  if (items === undefined) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>   
    )
  }

  return (
    <View>
      {items && <FlatList
        data={items}
        numColumns={1}
        ItemSeparatorComponent={ItemDivider}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({item}) => (
            <View>
              <Pressable style={styles.flatListContainer}>
                <View style={{paddingLeft: 20}}>
                  <View styles={{flexDirection: 'row'}}>
                    <Text style={styles.itemHeading}>
                      {item.name + ' x'  + item.quantity}
                    </Text>
                  </View>
                  <Text style={styles.itemExpiryDate}>
                    {'Expires on: ' + item.expiryDate}
                  </Text>
                </View>
                <Button title="Edit" onPress={toggleModal}/>
                <Modal isVisible={isModalVisible}>
                  <View>
                  
                    <Text style={styles.formLabel}>
                      Edit Item
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
                              onPress={() => {editItem(item.id)}}/>
                      <Button title="Go Back" 
                              onPress={toggleModal}/>
                    </View>

                  </View>
                </Modal>
              </Pressable>
            </View>
        )}>
      </FlatList>}
      {isSubmitVisible ? 
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={addItems}
            activeOpacity={0.9}>
            <Text style={styles.submitText}>Add Items To Pantry</Text>
          </TouchableOpacity> 
        </View>
      : null}
    </View>
  );
}
ScannerScreen.navigation
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: 300,
    height: 300,
  },

  datePickerStyle: {
    marginTop: 20,
    width: 320,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignSelf: 'center',
  },

  flatListContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    alignItems: 'center',
    flexGrow: 1
  },

  itemHeading: {
    fontWeight: 'bold',
    fontSize: 17,
    paddingTop: 20,
    paddingBottom: 10
  },

  itemExpiryDate: {
    opacity: 0.6,
    fontSize: 15,
    paddingVertical: 5,
    paddingBottom: 10
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

  formLabel: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },

  submitText: {
    fontSize: 17,
    color: 'black',
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'KohinoorBangla-Light',
    fontWeight: 'bold'
  },

  submitButtonContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flexDirection: 'column',
    flex: 1
  },

  submitButton: {
    alignItems: 'center',
    position: 'absolute',
    width: width - 30,
    height: 60,
    backgroundColor: primaryColor,
    borderRadius: 60,
    marginBottom: 20,
    marginLeft: 15,
    padding: '1%',
    bottom: 35
  },
});