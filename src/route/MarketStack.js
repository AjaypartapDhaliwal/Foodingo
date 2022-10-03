import { createStackNavigator } from '@react-navigation/stack';
import MarketScreen from "../screens/Market.js";
import MarketHelpScreen from "../components/MarketHelp.js"
import SearchResultsScreen from '../screens/SearchResults.js'
import AccountScreen from '../screens/Account.js';
import ProfileScreen from '../screens/Profile.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'


const Stack = createStackNavigator();
const primaryColor = '#00bfff'

export default function MarketStack({navigation, route}) {

  const {halls, university} = route.params
  const MarketPage = () =>
    <MarketScreen navigation={navigation} halls={halls} 
      university={university} />

  return (
    <Stack.Navigator>
      <Stack.Screen name="Market" halls={halls} university={university} 
        component={MarketPage} options={{
        headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("MarketHelp")}
          title="Info"
          color="#00cc00"
          style={{marginRight: 8}}>
          <Ionicons
            name="help-circle-outline"
            size={40}
            color={primaryColor}
          />
        </TouchableOpacity>
        ),
      }} />
      <Stack.Screen name="MarketHelp" component={MarketHelpScreen} />
      <Stack.Screen name="Search Results" component={SearchResultsScreen}/>
      <Stack.Screen name="Account" component={AccountScreen}/>
      <Stack.Screen name="Profile" component={ProfileScreen}/>
    </Stack.Navigator>
  );
}