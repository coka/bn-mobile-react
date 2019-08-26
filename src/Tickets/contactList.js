import React, { PureComponent } from 'react'
import { PropTypes } from 'prop-types'
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles'
import FormStyles from '../styles/shared/formStyles'
import ModalStyles from '../styles/shared/modalStyles';
import TicketTransferStyles from '../styles/tickets/ticketTransferStyles';

const styles = SharedStyles.createStyles()
const formStyles = FormStyles.createStyles()
const modalStyles = ModalStyles.createStyles()
const ticketWalletStyles = TicketTransferStyles.createStyles()


const ContactModal = ({ open, contact, selectEmailOrPhone, handleClose }) => (
  <Modal
    visible={open}
    onRequestClose={handleClose}
  >
    <View style={modalStyles.modalContainer}>
      <View style={ticketWalletStyles.closeModalContainer}>
        <Icon
          style={styles.iconLinkCircle}
          name="close"
          onPress={handleClose}
        />
      </View>
      <View style={modalStyles.contentWrapper}>
        {
          contact.name ?
            <Text style={[styles.helpText, styles.paddingBottom]}>
              Chose number or email for {contact.name}
            </Text>
            : null
        }
        {
          contact.phoneNumbers ?
            contact.phoneNumbers.map(({ number }, index) => (
              <TouchableOpacity key={index} onPress={() => selectEmailOrPhone(number)}>
                <Text style={styles.bodyText}>{number}</Text>
              </TouchableOpacity>
            ))
            : null
        }
        {
          contact.emails ?
            contact.emails.map(({ email }, index) => (
              <TouchableOpacity key={index} onPress={() => selectEmailOrPhone(email)}>
                <Text style={styles.bodyText}>{email}</Text>
              </TouchableOpacity>
            ))
            : null
        }
      </View>
    </View>
  </Modal>
)

class ContactList extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      filteredContacts: this.props.contacts,
      selectedContact: null,
      openModal: false
    }
  }

  searchList = (keyword) => {
    const { contacts } = this.props;
    let { filteredContacts } = this.state;
    filteredContacts = contacts.filter(item => item.name.toUpperCase().includes(keyword.toUpperCase()))
    this.setState({ filteredContacts })
  }

  handleSelectContact = (contact) => {
    this.setState({
      selectedContact: contact
    })
  }

  _renderItem = ({ item, separators }) => (
    <TouchableOpacity
      style={[styles.rowContainer, { marginBottom: 2, width: '100%' }]}
      onPress={() => this.handleSelectContact(item)}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          {item.name ? <Text style={styles.bodyText}>{item.name}</Text> : null}
          {
            item.phoneNumbers ?
              item.phoneNumbers.map(({ number }, index) => (
                <Text key={index} style={styles.helpText}>{number}</Text>
              ))
              : null
          }
          {
            item.emails ?
              item.emails.map(({ email }, index) => (
                <Text key={index} style={styles.helpText}>{email}</Text>
              ))
              : null
          }
        </View>
        <Icon style={styles.rightIcon} name='chevron-right' />
      </View>
    </TouchableOpacity>
  )

  emptyListComponent = () => (
    <View style={[styles.flex1, styles.flexRowCenter]}>
      <Text style={styles.bodyTextLight}>
        Contact List is Empty
        </Text>
    </View>
  )

  render() {
    const { filteredContacts, selectedContact } = this.state;
    const { selectEmailOrPhone } = this.props;
    return (
      <View style={styles.flex1}>
        <TextInput
          style={[formStyles.input, { marginBottom: 0 }]}
          placeholder="Type here"
          underlineColorAndroid="transparent"
          onChangeText={(text) => this.searchList(text)}
        />
        <FlatList
          keyExtractor={(item) => item.id}
          style={{ marginBottom: 15 }}
          data={filteredContacts}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this._renderItem}
          ListEmptyComponent={this.emptyListComponent}
        />
        {
          !!selectedContact ?
            <ContactModal
              open={!!selectedContact}
              contact={selectedContact}
              selectEmailOrPhone={selectEmailOrPhone}
              handleClose={() => this.handleSelectContact(null)}
            />
            : null
        }
      </View>
    )
  }
}

ContactList.propTypes = {
  contacts: PropTypes.array.isRequired,
  selectEmailOrPhone: PropTypes.func.isRequired
}

export default ContactList;
