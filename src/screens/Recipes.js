import * as React from 'react';
import { useState, useEffect } from 'react';
import { ScrollView, Keyboard, ActivityIndicator, Image, FlatList, Dimensions, TouchableOpacity, StyleSheet, View, SafeAreaView, Text, Linking, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const primaryColor = '#00bfff'
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height/2
const chefHat = require('../assets/chef-hat.png')

const Stack = createNativeStackNavigator();

export default function RecipesScreen () {
  
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }

  const [recipes, setRecipes] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [numberOfRecipes, setNumberOfRecipes] = useState(5);
  const [loading, setLoading] = useState(false);

  const apiId = '149c6278'
  const apiUrl = `https://api.edamam.com/search?q=${searchQuery}&app_id=${apiId}&app_key=${apiKey}&from=0&to=${numberOfRecipes.toString()}&calories=591-722&health=alcohol-free`;

  async function apiCall() {
    setLoading(true);
    let resp = await fetch(apiUrl);
    let respJson = await resp.json();
    setRecipes(respJson.hits);
    setLoading(false);
    Keyboard.dismiss();
  }

  useEffect(() => {
    setLoading(true)
    apiCall()
  }, [numberOfRecipes])

  const openUrl = async (url) => {
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Unable to open link :(, try another recipe! :D`);
    }
  }

  const increaseNumberOfRecipes = () => {
    const newNumberRecipes = numberOfRecipes + 5;
    setNumberOfRecipes(newNumberRecipes)
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: 'white'}}>
      <View style={styles.header}>
        <View>
          <Text style={{fontSize:25, fontWeight:'bold'}}>What's cooking</Text>
          <Text style={{fontSize:38, fontWeight:'bold', color:{primaryColor}}}>Good Looking?</Text>
        </View>
      </View>
      <View style={{marginTop:10, flexDirection:'row'}}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} style={{marginLeft:20}}/>
          <TextInput placeholder="Search" style={styles.input} onChangeText={text => setSearchQuery(text)}/>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.button}
        title='submit'
        onPress={apiCall}>
        <Text style={styles.buttonText}>FIND RECIPES</Text>
      </TouchableOpacity>
      <SafeAreaView style={{flex: 1}}>
        {loading ? <ActivityIndicator size='large' color={primaryColor}/> :
        <FlatList 
      numColumns={1}
      style={styles.recipes}
      data={recipes}
      renderItem={({item}) => (
        <View style={styles.recipe}>
          <Image
            style={styles.image}
            source={{uri: `${item.recipe.image}`}}
          />
          <View style={{padding: 20, flexDirection:'row'}}>
            <Text style={styles.label} onPress={() => {openUrl(item.recipe.url)}}>{item.recipe.label}</Text>
            <TouchableOpacity onPress={toggleModal} activeOpacity={0.4} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Image source={chefHat} style={{width:35, marginLeft: 60, height:35, resizeMode: "contain"}} />
            </TouchableOpacity>
          </View>
          <Modal isVisible={isModalVisible}>
            <View>
              <View style={styles.detailsCard}>
              <Text style={{marginTop: 7, textAlign: 'center', fontWeight: 'bold', fontSize:20, color: primaryColor}}>Details</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{marginTop: 20, marginLeft: 20, alignItems: 'flex-start',fontWeight: 'bold', fontSize:18}}>Calories: </Text>
                  <Text style={{marginTop: 22, marginLeft: 2, alignItems: 'flex-start', fontSize:16}}>{item.recipe.calories}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.detailCardHeading}>Meal Type: </Text>
                  <Text style={styles.detailCardSubHeading}>{item.recipe.mealType}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.detailCardHeading}>Diet Label: </Text>
                  <Text style={styles.detailCardSubHeading}>{`${item.recipe.dietLabels}`}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.detailCardHeading}>Cuisine Type: </Text>
                  <Text style={styles.detailCardSubHeading}>{`${item.recipe.cuisineType}`}</Text>
                </View>
                <Text style={styles.detailCardHeading}>Ingredients:</Text>
                <ScrollView horizontal style={{marginLeft: 20,flexDirection: 'row'}}>
                  {item.recipe.ingredients.map((item, index) => (
                  <TouchableOpacity key={index} activeOpacity={0.8} style={{alignItems:"center", marginRight: 7}}>
                    <View style={{borderRadius: 8, paddingVertical: 9, paddingHorizontal: 8, marginTop: 10, backgroundColor: primaryColor}}>
                      <Text style={styles.dietaryRequirementsButtonText}>{`${item['food']}`}</Text>
                    </View>
                  </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity onPress={toggleModal} activeOpacity={0.6}>
                  <View style={styles.backButton}>
                    <Text style={styles.buttonText}>Back</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    keyExtractor={(item, index) => index.toString()} />}
        <TouchableOpacity 
          style={styles.button}
          title='showmore'
          onPress={increaseNumberOfRecipes}>
          <Text style={styles.buttonText}>SHOW MORE</Text>
        </TouchableOpacity>      
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  header: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    height: 50,
    backgroundColor: '#c6dde5',
    borderRadius: 10,
    flex:1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    fontWeight:'bold',
    fontSize:20,
    paddingLeft: 10,
    flex:1
  },
  inputField: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 1
  },
  sortButton: {
    marginLeft: 15,
    height: 50,
    width: 65,
    borderRadius: 10,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    flexDirection: 'row',
    backgroundColor: primaryColor,
    alignItems: 'center',
    height: 35,
    width: width - 35,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 15
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  label: {
    fontSize: 15,
    width: '60%',
    alignSelf: 'center',
    color: primaryColor,
    fontWeight: '700',
    textDecorationLine: 'underline'
  },
  recipe: {
    shadowColor: 'black',
    shadowOpacity: 0.56,
    shadowOffset: {width: 1, height: 1.5},
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 20,
    backgroundColor: 'white',
    margin: 10,
    marginTop: 20,
  },
  detailsCard: {
    height: height - 70,
    backgroundColor: 'white',
    width: (width/2 - 30) * 2,
    borderRadius: 10,
    shadowColor: 'grey',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.75,
    shadowRadius: 5,
    elevation: 20
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 13,
    textAlign: 'center',
  },
  dietaryRequirementsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 10,
    textAlign: 'center',
  },
  detailCardHeading: {
    marginTop: 7, 
    marginLeft: 20, 
    alignItems: 'flex-start',
    fontWeight: 'bold', 
    fontSize:18
  },
  detailCardSubHeading: {
    marginTop: 9, 
    marginLeft: 2,
    alignItems: 'flex-start',
    fontSize:16
  },
  backButton: {
    marginBottom: 20, 
    marginLeft: 20, 
    marginRight: 20, 
    borderRadius: 8, 
    paddingVertical: 8, 
    paddingHorizontal: 8, 
    marginTop: 10, 
    backgroundColor: primaryColor
  }
});