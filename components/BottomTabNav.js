import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search from "../screens/Search";
import Transaction from "../screens/Transaction";

const Tab = createBottomTabNavigator();

class BottomTabNav extends React.Component {
    render() { 
        return (
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Transaction" component={Transaction} />
                    <Tab.Screen name="Search" component={Search} />
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
}
 
export default BottomTabNav;