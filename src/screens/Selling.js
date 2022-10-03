import React, { useEffect } from 'react';
import { FlatList, Button, Dimensions, StyleSheet, Text, Alert, View, Pressable } from 'react-native';
import { auth, firebase, storage } from '../config';
import { deleteObject } from 'firebase/storage';

const width = Dimensions.get("screen").width
const primaryColor = '#00bfff'

export default function SellingScreen({}){

  const sellItemRef = firebase.firestore().collection('selling');
  const pantryItemRef = firebase.firestore().collection('items');
  const marketItemRef = firebase.firestore().collection('market');
  
  const [items, setItems] = React.useState([]);

	useEffect(() => {
    sellItemRef.orderBy('createdAt', 'desc')
    .onSnapshot(
        querySnapshot => {
          const items = []
          querySnapshot.forEach((doc) => {
            const daysLeft = dateDifference(
              new Date(changeDateFormat(doc.data().expiryDate)), new Date())
            if (doc.data().ownerID === auth.currentUser.uid) {
              const name = doc.data().name
              const expiryDate = doc.data().expiryDate
              const quantity = doc.data().quantity
              const price = doc.data().price
              const reason = doc.data().reason
              const fileName = doc.data().fileName
              if (daysLeft >= 0) {
                items.push({
						    	id: doc.id,
						    	name,
						    	expiryDate: expiryDate.toLocaleString(),
                  daysLeft: daysLeft + 1,
						    	quantity,
                  price,
                  reason,
                  fileName
						    })
              } else {
                sellItemRef.doc(doc.id).delete().then().catch((error) => alert(error))
              }
            }
          })
          setItems(items);
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

  const removeFromSelling = (id, fileName) => {
    const storageRef = storage.ref(`${fileName}`);
    deleteObject(storageRef)
      .then()
      .catch((error) => alert(error))

    marketItemRef.doc(id)
    .delete()
    .then()
    .catch((error) => {
      alert(error);
    }) 

    sellItemRef.doc(id)
    .delete()
    .then()
    .catch((error) => {
      alert(error);
    })
  }

  const itemSold = (id, fileName) => {
    Alert.alert('Remove?',
        'Are you sure you want to remove this from the market?',
        [
          {text: 'Cancel'},
          {
            text: 'OK', onPress: () => {
              removeFromSelling(id, fileName);
            }
          }
        ],
        {cancelable: false},
    )
  }

  // const cancelFromSelling = (id, name, expiryDate, quantity) => {
  //   Alert.alert('Remove?',
  //       'Are you sure you want to remove this from the market?',
  //       [
  //         {text: 'Cancel'},
  //         {
  //           text: 'OK', onPress: () => {
  //             console.log(id);
  //             removeFromSelling(id)
    
  //             // Add back to pantry 
  //             const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  //             const data = {
  //               heading: name.toUpperCase(),
  //               expiryDate: expiryDate,
  //               quantity: quantity,
  //               createdAt: timestamp
  //             };

  //             pantryItemRef
  //             .add(data)
  //             .then()
  //             .catch((error) => {
  //               alert(error);
  //             }) 
  //           }
  //         }
  //       ],
  //       {cancelable: false},
  //   )
  // }

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

  return (
    <View>
      <FlatList
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
                    {'Expires in: ' + item.daysLeft + (item.daysLeft == 1 ? ' day' : ' days')}
                  </Text>
                </View>
                <Button title="Sold" 
                  onPress={() => itemSold(item.id, item.fileName)}/>
              </Pressable>
            </View>
        )}>
      </FlatList>
    </View>
  );
}

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