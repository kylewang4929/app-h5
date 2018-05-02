import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { getItemForPk } from '../../utils/configExpand';
import { getLanguageString } from '../../utils/getLanguage';
import { SwipeAction, Modal } from 'antd-mobile';
import GroupItem from '../../components/DeviceGroupList/GroupItem';
const alert = Modal.alert;

require('./defaultListStyles.less');

const styles = {
  itemContainer: {},
  groupListItemBox: {
    borderBottom: '0.02rem solid rgba(0,0,0,0.04)',
  },
};
class Item extends Component {

  state = {
  };

  onClick = () => {

  }

  render() {
    const { language, deleteGroup, item, goGroupControl } = this.props;
    const { product_key } = item.group;
    const data = getItemForPk(product_key);
    const productName = data[`${language.key}_name`] || data[`name`];
    return (
      <SwipeAction
        right={[
          {
            text: getLanguageString(language.key,'DELETE_THE_GROUP'),
            onPress: function(){
              alert(getLanguageString(language.key,'SURE_TO_DELETE_GROUP'), getLanguageString(language.key,"REMAIN_DEVICE"), [
                { text: getLanguageString(language.key,'CANCEL'), onPress: () => console.log('cancel') },
                { text: getLanguageString(language.key,'CONFIRM_DELETE_GROUP'), onPress: () => {deleteGroup(item.group.id)}, style:{color: "#FF8484"}},
              ])
            },
            style: { backgroundColor: '#FF8484', color: 'white', fontSize: '0.28rem'},
          },
        ]}
        autoClose
      >
        <div style={styles.groupListItemBox} onClick={goGroupControl.bind(null,item.group)}>
          <GroupItem tips={productName} iconImg={data.icon} title={item.group.group_name} isOffLine={item.groupIsOnline}/>
        </div>
      </SwipeAction>
    );
  }
}

Item.propTypes = {
};

Item.contextTypes = {
  // properties: PropTypes.object.isRequired,
};

export default Item;
