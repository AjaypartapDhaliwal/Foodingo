import * as React from 'react';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';
import Card from '../components/Card';

const primaryColor = '#00bfff'

export default function SearchResultsScreen({route, navigation}) {
  
  const {items} = route.params;

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgrounColor: 'white'}}>
    	<FlatList 
				columnWrapperStyle={{justifyContent: 'space-between'}} 
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					marginTop: 10,
					paddingBottom: 20,
				}}
				numColumns={2}
				data={items}
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
  }
});
