import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import HintView from './HintView';
import { 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableHighlight,  
    View, 
    Alert, 
} from 'react-native';


function HintSearch({merchant, theme}) {
    const [hintList, setHintList] = useState([]);
    const [hint, setHint] = useState([]);
    const [input, setInput] = React.useState("");
    const [selectMerchant, setSelectMerchant] = useState("");
    const [selectThmem, setSelectTheme] = useState("");

    useEffect(() => {
        if (merchant == "" || theme == "") {
            setSelectMerchant("");
            setSelectTheme("");
        } else {
            if (selectMerchant != merchant || selectThmem != theme) {
                getHintList(merchant, theme);
            }
            setSelectMerchant(merchant);
            setSelectTheme(theme);
        }
    }, [merchant, theme]);

    function getHintList(merchant, theme) {
        firestore()
            .collection("xcape")
            .doc(merchant)
            .collection('테마')
            .doc(theme)
            .collection('힌트')
            .onSnapshot(hint => {
                setHintList(
                    hint.docs.map((doc) => doc.data())
                );
            }
        );
    }

    function createFailInputAlert(title, message) {
        Alert.alert(
            title,
            message,
            [
                { text: "OK", onPress: () => this.secondTextInput.focus() }
            ],
            { cancelable: false }
        );
    }

    const searchHint = (e) => {
        e.preventDefault();
        console.log(input)
        let hintMessage = hintList.find(hint => hint.key == input);
        console.log(hintMessage);
        try {
            setHint(hintMessage.message);
        } catch(e) {
            createFailInputAlert("잘못된 입력입니다.", "다시 입력해주세요.");
        }
    }

    function convertToUpperCase(input) {
        if (input.length > 5) {
            return input.substr(0,5).toUpperCase();
        } else {
            return input.toUpperCase();   
        }
    }

    return (
        <View>
            <Text style={styles.theme_text}>
                {selectThmem}
            </Text>
            <HintView hint={hint} />
            <View style={styles.hint_input}>
                <TextInput
                    style={styles.hint_input_field}
                    onChangeText={text => setInput(convertToUpperCase(text))}
                    value={input}
                    autoCapitalize="characters"
                    onSubmitEditing={searchHint}
                    ref={(input) => { this.secondTextInput = input; }}
                />
                <TouchableHighlight
                    style={styles.hintInputButtonTouchableOpacity}
                    onPress={searchHint}
                >
                    <Icon 
                        style={styles.hint_input_button_icon}
                        name="search-outline" 
                        size={30} 
                        color="white"
                    />
                </TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    hint_input: {
        flex: 1,
        flexDirection: "row",
        width: 300,
    },
    hint_input_field: {
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        height: 50,
        borderColor: '#fee000', 
        borderWidth: 2,
        borderRadius: 15,
        fontSize: 25,
        textAlign: "center",
        flex: 5
    },
    hintInputButtonTouchableOpacity: {
        flex: 1,
        height: 50,
    },
    hintInputButton: {
        color: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hint_input_button_icon: {
        margin: 12
    },
    white: {
        color: 'white'
    },
    theme_text: {
        marginTop: 0,
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        height: 35,
        margin: 10,
        borderBottomColor: '#fee000', 
        borderBottomWidth: 2,
    }
  });

export default HintSearch
