import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons"
import Icon3 from "react-native-vector-icons/FontAwesome5"
import {auth, firebase, storage} from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import {StatusBar} from 'expo-status-bar';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import {getDownloadURL, uploadBytes} from 'firebase/storage';
import uuid from 'react-native-uuid';


export default class Registration extends Component {

  constructor() {
    super();
    this.state = {
      showPass: true,
      press: false,
      email: '', 
      password: '',
      name: '',
      university: '',
      halls: '',
      phoneNumber: '',
      diet: '',
      image: null,
      url: '',
      fileName: ''
    };
  }

  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true });
    } else {
      this.setState({ showPass: true, press: false });
    }
  };

  askPermissionsAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    } else {
      this.takeAndUploadPictureAsync();
    }
  };

  takeAndUploadPictureAsync = async () => {
    const { cancelled, uri } = await ImagePicker.launchCameraAsync();

    if (!cancelled) {
			this.updateInputVal(uri, 'image');
			const fileName = uuid.v4();
			this.updateInputVal(fileName, 'fileName');
			const storageRef = storage.ref(`${fileName}`);
			const img = await fetch(uri);
			const bytes = await img.blob();
			await uploadBytes(storageRef, bytes);
			await getDownloadURL(storageRef).then((x) => {
				this.updateInputVal(x, 'url')
			})
    }
  };

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = () => {
    const accountRef = firebase.firestore().collection('accounts');

    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signup!')
    } else {
      auth
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(userCredentials => {
        const user = userCredentials.user;
        user.updateProfile({
          name: this.state.name,
          university: this.state.university,
          halls: this.state.halls,
          phoneNumber: this.state.phoneNumber,
          diet: this.state.diet
        })       
        console.log('Registered with:', user.email);

        const data = {
          email: this.state.email,
          name: this.state.name,
          university: this.state.university,
          halls: this.state.halls,
          phoneNumber: this.state.phoneNumber,
          diet: this.state.diet,
          url: this.state.url,
          fileName: this.state.fileName
        }

        accountRef.doc(auth.currentUser.uid).set(data)
        
        this.setState({
          email: '', 
          name: '',
          university: '',
          halls: '',
          phoneNumber: '',
          diet: '',
          url: '',
          fileName: ''
        })

        this.props.navigation.navigate('Login')
      })
      .catch(error => alert(error.message))      
    }
  }

  render() {
    return (              
      <LinearGradient style={styles.container} 
                        colors={["#4096ab","#002b8b"]}
                        start={{x: 0, y: 0}}
                        end={{x:0, y:1}}>
      <View style={{paddingTop: 100, paddingBottom: 100}}>  
      <ScrollView style={styles.regform}>

        <Text style={styles.header}>Registration</Text>

        <View style={styles.inputContainer}>
          <Icon name={'ios-person-outline'} size={20} color={'rgba(0,255,255,0.7)'} style={styles.inputIcon}/>
          <TextInput
            style={styles.textinput}
            value={this.state.email}
            placeholder={'Email'}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            underLineColor="transparent"
            onChangeText={(val) => {this.updateInputVal(val, 'email')}}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name={'lock-closed-outline'} size={20} color={'rgba(0,255,255,0.7)'} style={styles.inputIcon}/>
          <TextInput
            style={styles.textinput}
            value={this.state.password}
            placeholder={'Password'}
            secureTextEntry={this.state.showPass}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            underLineColor="transparent"
            onChangeText={(val) => this.updateInputVal(val, 'password')}
          />

          <TouchableOpacity
          style={styles.btnEye}
          onPress={this.showPass.bind(this)}>
          <Icon name={this.state.press == false ? 'ios-eye-outline' : 'ios-eye-off-outline'} size={26} color={'rgba(0,255,255,0.7)'}/>
          
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Icon name={'pencil-outline'} size={20} color={'rgba(0,255,255,0.7)'} style={styles.inputIcon}/>
          <TextInput
            style={styles.textinput}
            value={this.state.name}
            placeholder={'Name'}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            underLineColor="transparent"
            onChangeText={(val) => this.updateInputVal(val, 'name')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon3 name={'graduation-cap'} size={17} color={'rgba(0,255,255,0.7)'} style={{ position: 'absolute', top: 10 }}/>
          <TextInput
            style={styles.textinput}
            value={this.state.university}
            placeholder={'University'}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            underLineColor="transparent"
            onChangeText={(val) => this.updateInputVal(val, 'university')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon2 name={'office-building-outline'} size={20} color={'rgba(0,255,255,0.7)'} style={styles.inputIcon}/>
          <TextInput
            style={styles.textinput}
            value={this.state.halls}
            placeholder={'Halls'}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            underLineColor="transparent"
            onChangeText={(val) => this.updateInputVal(val, 'halls')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name={'md-phone-portrait-outline'} size={20} color={'rgba(0,255,255,0.7)'} style={styles.inputIcon}/>
          <TextInput
            style={styles.textinput}
            value={this.state.phoneNumber}
            placeholder={'Phone Number'}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            underLineColor="transparent"
            onChangeText={(val) => this.updateInputVal(val, 'phoneNumber')}
          />
        </View>

        <View style={{ borderBottomWidth: 1, borderColor: '#f8f8f8', paddingTop: 15, paddingBottom: 15, paddingRight: 15 }}>
          <Icon name={'ios-fast-food-outline'} size={20} color={'rgba(0,255,255,0.7)'} style={styles.inputIcon}/>
          <View style={{ marginLeft: 25 }}>
            <RNPickerSelect
              style={{width: 200, inputIOS: {color: 'white'}, inputAndroid: {color: 'white'}}}
              placeholder={{ label: 'Select any dietary requirements', value: '' }}
              placeholderTextColor={'rgba(255,255,255,0.7)'}
              value={this.state.diet}
              onValueChange={(val) => this.updateInputVal(val, 'diet')}
              items={[
                {label: 'None', value: 'none'},
                {label: 'Vegetarian', value: 'vegetarian'},
                {label: 'Vegan', value: 'vegan'},
                {label: 'Halal', value: 'halal'},
                {label: 'Koscher', value: 'koscher'},
                {label: 'Gluten-Free', value: 'gluten-free'},
                {label: 'Dairy-Free', value: 'dairy-free'},
              ]}/>
            </View>
        </View>
      
        <View style={styles.imageInputContainer} >
          <View style={styles.imageContainer}>
            {this.state.image && <Image style={styles.previewImage} source={{ uri: this.state.image }} />}
          </View>
          <View>
            <TouchableOpacity
              onPress={this.registerUser}
              activeOpacity={0.9}>
              <Button title="Upload profile picture..." onPress={this.askPermissionsAsync}/>
            </TouchableOpacity> 		
          </View>  
        </View>
      
        <TouchableOpacity 
          onPress={() => {this.registerUser()}} 
          style={styles.button}>
          <Text style={styles.btntext}>Sign up</Text>
        </TouchableOpacity>
        <View style={styles.loginMessage}>
          <Text style={[styles.logintext, {color: '#00bfff'}]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} >
            <Text style={[styles.logintext, {color: 'white', textDecorationLine: 'underline', right: 20}]}>Login!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="auto"/>
      </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 60,
    paddingRight: 60
  },
  loginMessage: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  logintext: {
  },
  regform: {
    alignSelf: 'stretch'
  },
  header: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: '#00bfff',
    borderBottomWidth: 1
  },
  textinput: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: '#fff',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
    paddingLeft: 25
  },
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#00bfff',
    marginTop: 30,
    borderRadius: 45
  },
  btntext: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20
  },
  inputIcon: {
    position: 'absolute',
    top: 8,
  },
  inputContainer: {
    marginTop: 10,
  },
  imageInputContainer: {
    marginTop: 20,
    alignItems: 'center'
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
  btnEye: {
    position: 'absolute',
    top: 8,
    right: 10
  }
});
