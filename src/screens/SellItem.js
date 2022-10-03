import React, { useState } from 'react'
import {
  View,
  Button,
	Dimensions,
	StyleSheet,
	Image, 
	TextInput,
	Keyboard,
	TouchableOpacity, 
	Text
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {auth, firebase, storage} from "../config";
import {getDownloadURL, uploadBytes} from 'firebase/storage';
import uuid from 'react-native-uuid';
import DropDownPicker from 'react-native-dropdown-picker';

const width = Dimensions.get("screen").width
const primaryColor = '#00bfff'

export default function SellItemScreen ({navigation, route}) {

	const [image, setImage] = useState(null);
	const [url, setUrl] = useState('');
	const [price, setPrice] = useState('');
  	const [reason, setReason] = useState('');
	const [fileName, setFileName] = useState('');

	// Drop down picker
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [items, setItems] = useState([
	{label: 'Fruit & Veg', value: 'Fruit & Veg'},
	{label: 'Protein', value: 'Protein'}, 
	{label: 'Grain', value: 'Grain'}, 
	{label: 'Dairy', value: 'Dairy'},
	{label: 'Frozen', value: 'Frozen'},
  ]);

	const itemRef = firebase.firestore().collection('items');
	const marketRef = firebase.firestore().collection('market');
	const sellItemRef = firebase.firestore().collection('selling');
	const accountRef = firebase.firestore().collection('accounts')

	const askPermissionsAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    } else {
      takeAndUploadPictureAsync();
    }
  	};

  	const takeAndUploadPictureAsync = async () => {
    const { cancelled, uri} = await ImagePicker.launchCameraAsync();

    if (!cancelled) {
			setImage(uri);
			const fileName = uuid.v4();
			setFileName(fileName);
			const storageRef = storage.ref(`${fileName}`);
			const img = await fetch(uri);
			const bytes = await img.blob();
			await uploadBytes(storageRef, bytes);
			await getDownloadURL(storageRef).then((x) => {
				setUrl(x)
			})
    	}
  	};

	const handleSubmit = async () => {
		const {id, name, quantity, expiryDate} = route.params;
		if (price && price.length > 0 && reason && reason.length > 0) {
			const timestamp = firebase.firestore.FieldValue.serverTimestamp(); 
			const doc = await accountRef.doc(auth.currentUser.uid).get()
			const seller = doc.data().name
			const halls = doc.data().halls
			const university = doc.data().university   
			const data = {
				name: name,
				quantity: quantity,
				expiryDate: expiryDate,
				price: correctPriceFormat(price),
				seller: seller,
				reason: reason,
				ownerID: auth.currentUser.uid,
				ownerHalls: halls,
				ownerUniversity: university,
				url: url,
				fileName: fileName,
				category: value,
				createdAt: timestamp
			}

			sellItemRef
			.doc(id).set(data)
			.then()
			.catch((error) => {
				alert(error)
			})

			marketRef
			.doc(id).set(data)
			.then(() => {
				setPrice('')
				setReason('')
				Keyboard.dismiss()
			}).catch((error) => {
				alert(error)
			})

			itemRef.doc(id)
			.delete()
			.then()
			.catch((error) => {
				alert(error);
			})

			navigation.navigate('Pantry');
		} else {
			if (!price) {
				alert('Please enter price')
			} else if (!reason) {
				alert('Please enter reason for selling')
			} else if (!value) {
				alert('Please select a category for your food')	
			}
		}
	}

	const correctPriceFormat = (price) => {
		const array = price.split('.')
		if (array.length === 1) {
			return price + '.00'
		} else if (array[1].length === 1) {
			return price + '0'
		} else {
			return price
		}
	}
	
  return (
		<View style={styles.container}>
      <View style={styles.imageContainer}>
				{image && <Image style={styles.previewImage} source={{ uri: image }} />}
      </View>
			<View>
				<TouchableOpacity
					onPress={handleSubmit}
					activeOpacity={0.9}>
					<Button title="Upload image..." onPress={askPermissionsAsync}/>
				</TouchableOpacity> 		
			</View>   
      <TextInput
        value={price}
        style={styles.longFormInput}
        placeholder='Price'
        onChangeText={(n) => {
			setPrice(n)}
		}
      />
      <TextInput
        value={reason}
        style={styles.longFormInput}
        placeholder='Reason for selling the item'
        onChangeText={(n) => setReason(n)}
      />
			<DropDownPicker
				open={open}
				value={value}
				items={items}
				setOpen={setOpen}
				setValue={setValue}
				setItems={setItems}
				containerStyle={{
					marginTop: 18,
					marginBottom: 18
				}}
    		/>
			<View style={styles.submitButtonContainer}>
				<TouchableOpacity
					style={styles.submitButton}
					onPress={handleSubmit}
					activeOpacity={0.9}>
					<Text style={styles.submitText}>Add Items To Market</Text>
				</TouchableOpacity> 
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 32,
  },

	longFormInput: {
    width: '100%',
    height: 50,
    color: 'black',
		backgroundColor: 'white',
    borderColor: 'black',
		borderRadius: 9,
    borderWidth: 1,
    padding: 8,
    margin: 16
  },
	
  imageContainer: {
		marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
		borderRadius: 9,
    backgroundColor: '#eee',
    width: '80%',
    height: 150,
		shadowColor: 'grey',
		shadowOffset: {
			height: 2,
			width: 0,
		},
		shadowOpacity: 0.75,
		shadowRadius: 5,
		elevation: 20
  },

  previewImage: {
    width: '100%',
    height: '100%',
		borderRadius: 9,
  },

	submitText: {
    fontSize: 17,
    color: 'black',
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'KohinoorBangla-Light',
    fontWeight: 'bold'
  },

	submitButton: {
    width: width - 80,
    height: 60,
    backgroundColor: primaryColor,
    borderRadius: 60,
    marginTop: 20,
    padding: '1%',
  },
})