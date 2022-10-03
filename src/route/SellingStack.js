import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import SellingScreen from "../screens/Selling"
import SellingHelp from "../components/SellingHelp"

const Stack = createStackNavigator();

export default function SellingStack({navigation}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name="Selling Page" 
                component={SellingScreen}
                options={{
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Selling Help")}
                            title="Info"
                            color="#00cc00"
                            style={{marginRight: 8}}>
                            <Ionicons
                                name="help-circle-outline"
                                size={40}
                                color="#00bfff"
                            />
                        </TouchableOpacity>
                    )
                }}/>
            <Stack.Screen name="Selling Help" component={SellingHelp} />
        </Stack.Navigator>
    )
}
