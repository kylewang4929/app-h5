import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { SwipeAction } from 'antd-mobile';
import { getLanguageString } from '../../utils/getLanguage';

const styles = {
  container: {
    overflow: 'hidden',
    width: '100%',
    height: '1.5rem',
    backgroundColor: '#fff',
    position: 'relative',
    borderBottom: '0.02rem solid rgba(0,0,0,0.04)',
  },
  leftBox: {
    float: 'left',
    width: '2rem',
    overflow: 'hidden',
    height: '1.5rem',
    lineHeight: '1.5rem',
    paddingLeft: '0.5rem',
    fontSize: '0.32rem',
    fontWeight: 'bold',
  },
};

class EditGroupItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchState: true,
    }

    this.delete = this.delete.bind(this);
  }

  delete(did) {
    const { onDelete } = this.props;
    onDelete(did);
  }

  render() {
    const { switchState } = this.state;
    const { deviceName, deviceStateName, deviceState, did, language } = this.props;
    return (
      <SwipeAction
        right={[
          {
            text: getLanguageString(language.key, "DELETE_THE_DEVICE"),
            onPress: this.delete.bind(null, did),
            style: { backgroundColor: '#FF8484', color: 'white' },
          },
        ]}
        autoClose
      >
        <div style={styles.container}>
          <div style={styles.leftBox}>
            {deviceName}
          </div>
        </div>
      </SwipeAction>
    );
  }
}

EditGroupItem.defaultProps = {

};

EditGroupItem.propTypes = {
  deviceName: PropTypes.string,
  deviceStateName: PropTypes.string,
  deviceState: PropTypes.string,
};

export default EditGroupItem;
