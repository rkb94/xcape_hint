import React, { useState, useEffect } from 'react';
import HintSearch from './src/HintSearch';
import firestore from '@react-native-firebase/firestore';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  TouchableHighlight,
  Modal,
  Alert, 
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
const backgroundImage = require("./assets/main_bg.jpg");
const logoImage = require("./assets/main_logo.png");
const defaultMerchant = "";
const defaultTheme = "";

const App: () => React$Node = () => {
  const [isGetMerchantList, setIsGetMerchantList] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [theme, setTheme] = useState("");
  const [merchantList, setMerchantList] = useState([]);
  const [themeList, setThemeList] = useState([]);
  
  useEffect(() => {
    AsyncStorage.getItem('merchant').then(
      (merchant) => {
        if (merchant == null) {
          createOneButtonAlert("", "지점을 설정해주세요.");
          setThemeList([]);
          setModalVisible(true);
        } else {
          setMerchantConfig(merchant);
          AsyncStorage.getItem('theme').then(
            (theme) => {
              if (theme == null) {
                createOneButtonAlert("", "테마를 설정해주세요.");
                setModalVisible(true);
              } else {
                setTheme(theme);
              }
            }
          )
        }
      }
    );
    
    if (!isGetMerchantList) {
      firestore().collection("xcape").onSnapshot(merchant => {
        merchant.docs.map((doc) => {
          setMerchantList(merchantList => [...merchantList, { name: doc.id }]);
        })
      })
      setIsGetMerchantList(true);
    }
  }, [theme, merchant, isGetMerchantList]);

  function setMerchantConfig(merchant) {
    setMerchant(merchant);
    AsyncStorage.setItem('merchant', merchant);
    getThemList(merchant);
  }

  function setThemeConfig(theme) {
    setTheme(theme);
    AsyncStorage.setItem('theme', theme);
    setThemeList([]);
  }
  
  function getThemList(merchant) {
    firestore()
    .collection("xcape")
    .doc(merchant)
    .collection('테마')
    .onSnapshot(themes => {
      setThemeList([]);
      themes.docs.map((theme) => {
        setThemeList(themeList => [...themeList, { name: theme.id }]);
      });
    })
  }

  function createOneButtonAlert(title, message) {
    Alert.alert(
        title,
        message,
        [
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ImageBackground 
          source={backgroundImage} 
          resizeMode="cover" 
          style={styles.background_image}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  테마를 입력해주세요.
                </Text>
                <Picker
                  selectedValue={ merchant == defaultMerchant ? defaultMerchant : merchant }
                  style={{ height: 100, width: 200 }}
                  onValueChange={(itemValue) => {
                    setMerchantConfig(itemValue);
                  }}
                >
                  <Picker.Item label="지점을 선택해주세요." key="" value="" />
                  {merchantList.map(merchant => {
                    return (
                      <Picker.Item key={merchant.name} label={merchant.name} value={merchant.name} />
                    );
                  })}
                </Picker>
                <Picker
                  selectedValue={theme == defaultTheme ? defaultTheme : theme}
                  style={{ height: 100, width: 200 }}
                  onValueChange={(itemValue) => {
                    console.log(itemValue);
                    setThemeConfig(itemValue);
                  }}
                >
                  <Picker.Item label="테마를 선택해주세요." key="" value="" />
                  {themeList.map(theme => 
                    <Picker.Item key={theme.name} label={theme.name} value={theme.name} />
                  )}
                </Picker>
                <TouchableHighlight
                  style={styles.setting_complete_button}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>설정 완료</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scroll_view}
          >
            <View style={styles.header}>
              <TouchableHighlight
                style={styles.open_button}
                onLongPress={() => {
                  setModalVisible(true);
                }}
              >
                <Image 
                  source={logoImage}
                  style={styles.main_logo}
                />
              </TouchableHighlight>
            </View>
            <HintSearch 
              style={styles.hint_search}
              merchant={merchant}
              theme={theme}
            />
          </ScrollView>
        </ImageBackground>
      </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#1c1c1c',
  },
  background_image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: 'center',
  },
  open_button: {
    borderRadius: 20,
    margin: 10,
    padding: 15,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: 'center',
  },
  main_logo: {
    width: 100,
    height: 105,
  },
  hint_search: {
    marginTop: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "gray",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  setting_complete_button: {
    borderRadius: 10,
    margin: 15,
    padding: 10,
    backgroundColor: "#edd837"
  },
});

export default App;
