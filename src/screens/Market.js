import * as React from 'react';
import {useState, useEffect} from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, FlatList, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import {auth, firebase} from '../config'
import { TouchableOpacity } from 'react-native-gesture-handler';

const categoryItems = [
  {
  image: require('../assets/home.png'),
  text: "Home",
  },
  {
    image: require('../assets/veg.png'),
    text: "Fruit & Veg",
  },
  {
    image: require('../assets/meat.png'),
    text: "Protein",
  },
  {
    image: require('../assets/wheat.png'),
    text: "Grain",
  },
  {
    image: require('../assets/dairy.png'),
    text: "Dairy",
  },
  {
    image: require('../assets/frozen.png'),
    text: "Frozen",
  }
];

const primaryColor = '#00bfff'

export default function MarketScreen({navigation, halls, university}) {

  const marketRef = firebase.firestore().collection('market')
  
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categoryIndex, setCategoryIndex ] = React.useState(0)
  const [category, setCategory ] = React.useState('')
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    marketRef.orderBy('createdAt', 'desc')
    .onSnapshot(
      querySnapshot => {
        const items = []
        querySnapshot.forEach((doc) => {
          if (doc.data().ownerID !== auth.currentUser.uid) {
            const daysLeft = dateDifference(
              new Date(changeDateFormat(doc.data().expiryDate)), new Date())
            if (daysLeft < 0) {
              marketRef.doc(doc.id).delete().then().catch((error) => alert(error))
            } else {
            if (doc.data().ownerHalls === halls
            && doc.data().ownerUniversity === university) {
              if (daysLeft >= 0) {  
                items.push({
                  id: doc.id,
                  name: doc.data().name,
                  quantity: doc.data().quantity,
                  expiryDate: doc.data().expiryDate,
                  price: doc.data().price, 
                  seller: doc.data().seller,  
                  ownerID: doc.data().ownerID,
                  reason: doc.data().reason,
                  category: doc.data().category,
                  url: doc.data().url
                })
              } else {
                marketRef.doc(doc.id).delete().then().catch((error) => alert(error))
              }
            }
          }}})
        
        setItems(items)
      }
    )
  }, [])

  useEffect(() => {
    const filteredItems = items?.filter(v => v.category == category)
    if (category != "Home" && category != "") {
      setFiltered(filteredItems);
    } 
  }, [category])

  const changeDateFormat = (date) => {
    const array = date.toString().split('/')
    return array[2] + '/' + array[1] + '/' + array[0]
  }

  const dateDifference = (date1, date2) => {
    return Math.ceil((date1 - date2) / (1000 * 60 * 60 * 24))
  }

  const searchForItems = () => {
    const results = []
    for (let item of items) {
      if (item.name.includes(searchQuery.toUpperCase())) {  
        results.push(item)
      }
    }
    navigation.navigate('Search Results', {items: results});
  }

  const selectCategory = (id, typeOfFood) => {
    setCategoryIndex(id);
    setCategory(typeOfFood);
  } 
  
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgrounColor: 'white'}}>
      <View style={styles.header}>
        <View>
          <Text style={{fontSize:25, fontWeight:'bold'}}>Welcome to</Text>
          <Text style={{fontSize:38, fontWeight:'bold', color:{primaryColor}}}>Market place</Text>
        </View>
        <Ionicons name="cart" size={40} />
      </View>
      <View style={{marginTop:10, flexDirection:'row'}}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} style={{marginLeft:20}}/>
          <TextInput placeholder="Search" style={styles.input} onChangeText={text => setSearchQuery(text)}/>
        </View>
        <TouchableOpacity style={styles.sortButton} onPress={searchForItems}>
          <Ionicons name="arrow-forward-outline" size={30} color='white'/>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 10, borderRadius: 10, backgroundColor: 'white', paddingBottom: 10, paddingLeft: 10}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:15}}>
          {categoryItems.map((item, index) => (
            <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => selectCategory(index, item.text)} style={{alignItems:"center", marginRight: 20}}>
              <Image source={item.image} style={{width:35, height:35, resizeMode: "contain"}} />
              <Text style={[
                {fontSize:13, fontWeight:'800'},
                categoryIndex == index && styles.categoryTextSelected]}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList 
      columnWrapperStyle={{justifyContent: 'space-between'}} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        marginTop: 10,
        paddingBottom: 20,
      }}
      numColumns={2}
      data={(category == "Home" || category == "")?items:filtered}
      renderItem={({item}) => {
        return <Card navigation={navigation} food={item}/>;
      }}
      />
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  sortButton: {
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 130,
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  categoryText: {
    fontSize: 15,
    color: 'grey',
    fontWeight: 'bold'
  },
  categoryTextSelected: {
    color: primaryColor,
    paddingBottom: 5,
    textDecorationLine: 'underline'
  }
});


