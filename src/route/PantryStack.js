import { createStackNavigator } from '@react-navigation/stack';
import PantryScreen from "../screens/Pantry.js";
import ScannerScreen from "../screens/Scanner.js";
import MarketScreen from '../screens/Market.js';
import SellItemScreen from '../screens/SellItem.js';
import SearchResultsScreen from '../screens/SearchResults.js'
import PantryHelpScreen from "../components/PantryHelp.js"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'

const Stack = createStackNavigator();
const primaryColor = '#00bfff'

export default function PantryStack({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Pantry" component={PantryScreen} options={{
        headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("PantryHelp")}
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
      <Stack.Screen name="Sell Item" component={SellItemScreen}/>
      <Stack.Screen name="Market" component={MarketScreen} options={{headerLeft: () => null }}/>
      <Stack.Screen name="Search Results" component={SearchResultsScreen}/>
      <Stack.Screen name="Scanner" component={ScannerScreen} />
      <Stack.Screen name="PantryHelp" component={PantryHelpScreen} />
    </Stack.Navigator>
  );
}