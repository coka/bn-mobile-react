import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import SharedStyles from '../styles/shared/sharedStyles';
import FormStyles from '../styles/shared/formStyles'

const styles = SharedStyles.createStyles()
const formStyles = FormStyles.createStyles()

class ContactList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      filteredContacts: this.props.contacts
    }
  }

  searchList = (keyword) => {
    const { contacts } = this.props;
    let { filteredContacts } = this.state;
    filteredContacts = contacts.filter(item => item.name.toUpperCase().includes(keyword.toUpperCase()))
    this.setState({ filteredContacts })
  }

  render() {
    const { selectContact } = this.props;
    const { filteredContacts } = this.state;
    return (
      <View style={{flex: 1}}>
        <TextInput
          style={[{ paddingTop: 20 }, formStyles.input]}
          placeholder="Search"
          searchIcon={{ size: 24 }}
          underlineColorAndroid="transparent"
          onChangeText={(text) => this.searchList(text)}
        />
        <View>
          <FlatList
            keyExtractor={(item) => item.id}
            style={[styles.container, styles.marginVertical, styles.marginHorizontal]}
            data={filteredContacts}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.rowContainer, styles.paddingVerticalSmall]}
                onPress={() => selectContact(item)}
              >
                <View>
                  <Text >{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    )
  }
}

export default ContactList;