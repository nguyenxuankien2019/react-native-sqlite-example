import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View, FlatList, Text } from "react-native";
import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(false);
const errorCB = (err) => {
  console.log("SQL Error: " + err);
}

const successCB = () => {
  console.log("SQL executed fine");
}

const openCB = () => {
  console.log("Database OPENED");
}

const HomeScreen = ({ }) => {
  const [vocab, onChangeVocab] = React.useState("");
  const [data, setData] = React.useState([]);

   useEffect( () => {
try {
  var db =  SQLite.openDatabase({ name: 'Dictionary.db', createFromLocation: 1, location: 'Library' }, successCB, errorCB);

    db.transaction(function (tx) {
      tx.executeSql(`SELECT * FROM entries WHERE word LIKE '${vocab}%' LIMIT 0,100`, [], (tx, results) => {
        // console.log('results::', results.rows.raw());
        setData(results.rows.raw())   
      });
    })
} catch (error) {
  console.log('error',error);
}
    
  }, [vocab]);
  const renderItem = ({ item }) => (
    <View style={styles.item}>
    <Text style={styles.title}>{item.word}</Text>
  </View>
  );
  return (
    <View style={{ flex: 1, paddingVertical: 32  }}>
       <TextInput
        style={styles.input}
        onChangeText={onChangeVocab}
        value={vocab}
        placeholder="Search a word"
      />
       <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={data}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    color:'#000'
  },
});
export default HomeScreen;