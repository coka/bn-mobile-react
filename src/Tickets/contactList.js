import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types'
import {View, Text, TextInput, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import SharedStyles from '../styles/shared/sharedStyles';
import FormStyles from '../styles/shared/formStyles'

const styles = SharedStyles.createStyles()
const formStyles = FormStyles.createStyles()

class ContactList extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            filteredContacts: this.props.contacts
        }
    }

    searchList = (keyword) => {
        const {contacts} = this.props;
        let {filteredContacts} = this.state;
        filteredContacts = contacts.filter(item => item.name.toUpperCase().includes(keyword.toUpperCase()))
        this.setState({filteredContacts})
    }

    _renderItem = ({item, separators}) => {
        const {selectContact} = this.props;

        if (!item.name || !item.phoneNumbers) return null

        return (
            <TouchableOpacity
                style={[styles.rowContainer, {marginBottom: 2, width: '100%'}]}
                onPress={() => selectContact(item)}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}
            >
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.bodyText}>{item.name}</Text>
                        <Text style={styles.helpText}>{item.phoneNumbers[0].number}</Text>
                    </View>
                    <Icon style={styles.rightIcon} name='chevron-right'/>
                </View>
            </TouchableOpacity>
        )
    }

    emptyListComponent = () => (
        <View style={[styles.flex1, styles.flexRowCenter]}>
            <Text style={styles.bodyTextLight}>
                Contact List is Empty
            </Text>
        </View>
    )

    render() {
        const {filteredContacts} = this.state;
        return (
            <View style={[styles.flex1, styles.container]}>
                <TextInput
                    style={[formStyles.input, styles.marginBottomTiny]}
                    placeholder="Type here"
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => this.searchList(text)}
                />
                <FlatList
                    keyExtractor={(item) => item.id}
                    style={{marginBottom: 15}}
                    data={filteredContacts}
                    ItemSeparatorComponent={() => <View style={styles.separator}/>}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this.emptyListComponent}
                />
            </View>
        )
    }
}

ContactList.propTypes = {
    contacts: PropTypes.array.isRequired,
}

export default ContactList;
