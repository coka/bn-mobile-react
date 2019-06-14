import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import SharedStyles from '../styles/shared/sharedStyles';

const styles = SharedStyles.createStyles()

const ContactList = ({ contacts, selectContact }) => (
  <FlatList
    keyExtractor={(item) => item.id}
    style={[styles.container, styles.marginVertical, styles.marginHorizontal]}
    data={contacts}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
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
)

export default ContactList;