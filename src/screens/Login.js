import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {StatusBar} from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import {auth, firebase} from '../config';

import logo from '../assets/logo.png';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export default class Login extends Component {

  constructor() {
    super();
    this.state = {
      showPass: true,
      press: false,
      email: '', 
      password: ''
    };
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  userLogin = async () => {
    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signin!')
    } else {
      auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(async userCredentials => {
        const user = userCredentials.user;

        const accountRef = firebase.firestore().collection('accounts')

        const doc = await accountRef.doc(user.uid).get();
        
        const url = doc.data().url
        const name = doc.data().name
        const university = doc.data().university
        const halls = doc.data().halls
        const phoneNumber = doc.data().phoneNumber
        const diet = doc.data().diet

        this.setState({
          isLoading: false,
          email: '', 
          password: ''
        });

        this.props.navigation.navigate('Home', 
          { url: url, name: name, university: university, halls: halls, phoneNumber: phoneNumber, diet: diet });
      })
      .catch(error => alert(error.message))
    }
  }

  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true });
    } else {
      this.setState({ showPass: true, press: false });
    }
  };

  render() {
    return (

        <LinearGradient style={styles.backgroundContainer} 
                        colors={["#4096ab","#002b8b"]}
                        start={{x: 0, y: 0}}
                        end={{x:0, y:1}}>

          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.logoText}>Foodingo</Text>
          </View>

          <View style={styles.inputContainer}>
            <Icon name={'ios-person-outline'} size={20} color={'rgba(0,255,255,0.7)'} style={styles.inputIcon}/>
            <TextInput
              style={styles.input}
              placeholder={'Email'}
              placeholderTextColor={'rgba(255,255,255,0.7)'}
              underLineColor="transparent"
              value={this.state.email}
              onChangeText={(val) => {this.updateInputVal(val, 'email')}}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name={'lock-closed-outline'} size={20} color={'rgba(0,255,255,0.7)'} style={styles.inputIcon}/>
            <TextInput
              style={styles.input}
              placeholder={'Password'}
              secureTextEntry={this.state.showPass}
              placeholderTextColor={'rgba(255,255,255,0.7)'}
              underLineColor="transparent"
              value={this.state.password}
              onChangeText={(val) => {this.updateInputVal(val, 'password')}}
            />

            <TouchableOpacity
              style={styles.btnEye}
              onPress={this.showPass.bind(this)}>
              <Icon name={this.state.press == false ? 'ios-eye-outline' : 'ios-eye-off-outline'} size={26} color={'rgba(0,191,300,0.7)'}/>
            
            </TouchableOpacity>

          </View>

          <TouchableOpacity style={styles.btnLogin}
          onPress={() => this.userLogin()}>
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>

          <View style={styles.signUp}>
            <Text style={[styles.signUpMessage, {color: '#00bfff'}]}>No account? </Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Registration')} >
              <Text style={[styles.signUpMessage, {color: 'white', textDecorationLine: 'underline'}]}>Create one!</Text>
            </TouchableOpacity>
          </View>

          <StatusBar style="auto"/>
        </LinearGradient>
        
    );
  }
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: (WIDTH * 0.75),
    height: (WIDTH * 0.75)
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    color: 'white',
    fontSize: 60,
    opacity: 0.5,
    textShadowColor: '#00bfff',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  input: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 45,
    fontSize: 16,
    paddingLeft: 45,
    backgroundColor: 'rgba(0,150,300,0.35)',
    color: 'rgba(255,255,255,0.7)',
    marginHorizontal: 25,
  },
  inputIcon: {
    position: 'absolute',
    top: 8,
    left: 37,
  },
  inputContainer: {
    marginTop: 10,
  },
  btnEye: {
    position: 'absolute',
    top: 8,
    right: 37,
  },
  btnLogin: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 45,
    backgroundColor: '#00bfff',
    justifyContent: 'center',
    marginTop: 20,
  },
  text: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 20,
    textAlign: 'center',
  },
  signUp: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  signUpMessage: {
  }
});
