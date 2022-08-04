import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../config";
import firebase from "firebase";

const bgImg = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

export default class Transaction extends React.Component {
  constructor() {
    super();
    this.state = {
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false,
      scannedData: "",
      bookID: "",
      studentID: "",
    };
  }
  render() {
    const { bookID, studentID, domState, scanned } = this.state;
    if (domState !== "normal") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarcodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ImageBackground source={bgImg} style={styles.Img}>
          <View style={styles.lowerContainer}>
            <Image source={appName} style={styles.appName} />
            <Image source={appIcon} style={styles.appIcon} />
            <View style={styles.textinputContainer}>
              <TextInput
                style={styles.textinput}
                placeholder={"Book ID"}
                placeholderTextColor={"#ffffff"}
                value={bookID}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => {
                  this.getCamPerms("bookID");
                }}
              >
                <Text style={styles.scanbuttonText}>SCAN</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textinputContainer}>
              <TextInput
                style={styles.textinput}
                placeholder={"Student ID"}
                placeholderTextColor={"#ffffff"}
                value={studentID}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => {
                  this.getCamPerms("studentID");
                }}
              >
                <Text style={styles.scanbuttonText}>SCAN</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity 
                style={[styles.button,{marginTop:25}]} 
                onPress={()=>{this.handleTransaction()}} 
              >
                <Text style={styles.buttonText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
  getCamPerms = async (domState) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions: status === "granted",
      domState: domState,
      scanned: false,
    });
  };
  handleBarcodeScanned = async ({ type, data }) => {
    const { domState } = this.state;
    if (domState == "bookID") {
      this.setState({
        scanned: true,
        bookID: data,
        domState: "normal",
      });
    }
    if (domState == "studentID") {
      this.setState({
        scanned: true,
        studentID: data,
        domState: "normal",
      });
    }
  };
  handleTransaction = () => {
    let bookID = this.state.bookID;
    db.collection("books")
      .doc(bookID)
      .get()
      .then((doc) => {
        let book = doc.data();
        if(book.is_book_available){
          this.initBookIssue();
        } else {
          this.initBookReturn();
        }
      })
  }
  initBookIssue = () => {
    //Add later.
    console.log("Book Issue");
  }
  initBookReturn = () => {
    //Add later.
    console.log("Book Return");
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5653D4",
  },
  text: {
    color: "white",
    fontSize: 30,
  },
  button: {
    width: "60%",
    padding: 5,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 24,
    color: "white",
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center",
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF",
    margin: 10,
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#5653D4",
    color: "#FFFFFF",
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scanbuttonText: {
    fontSize: 24,
    color: "#0A0101",
  },
  Img: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  appIcon: {
    width: 100,
    height: 100,
  },
  appName: {
    width: 375,
    height: 95,
  },
};
