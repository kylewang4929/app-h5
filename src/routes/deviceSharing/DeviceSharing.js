import React from 'react';
import { Modal, List, SwipeAction } from 'antd-mobile';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';

import router from '../../utils/router';
import BackButton from '../../containers/MenuButton/BackButton';
import CommonButton from '../../containers/MenuButton/CommonButton';

import { getLanguageString } from '../../utils/getLanguage';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';

const QRCode = require('qrcode.react');


const itemStyles = {
  at: {
    fontSize: '.2rem',
  },
  dl: {
    backgroundColor: '#da5f5a',
    color: 'white',
    width: '1rem',
  },
};

const styles = {
  list: {
    marginTop: '0.2rem',
  },
  tab: {
    position: 'absolute',
    bottom: '0px',
    width: '100%',
    backgroundColor: 'rgb(2, 196, 177)',
    textAlign: 'center',
    color: '#fff',
    fontSize: '0.26rem',
  },
  icon: {

  },
  tabText: {
    position: 'relative',
    top: '-0.2rem',
  },
  tabButton: {
    width: '0.8rem',
    height: '0.8rem',
    lineHeight: '0.8rem',
    borderRadius: '50%',
    backgroundColor: '#fff',
    color: 'rgb(2, 196, 177)',
    textAlign: 'center',
    fontSize: '0.5rem',
    position: 'relative',
    left: '50%',
    marginLeft: '-0.4rem',
    top: '-0.4rem',
  },
  noneContent: {
    padding: '3rem 0',
    textAlign: 'center',
  },
  noneTips: {
    fontSize: '0.28rem',
    color: '#757575',
  },
};

class DeviceSharing extends React.Component {
  state = {
    modal: false,
    qrcode: '',
  }
  onClose = () => {
    this.setState({
      modal: false,
    });
  }
  componentWillMount() {
    this.button = (
      <CommonButton
        onClick={this.shareDevice}
      >
        <div style={{ fontSize: '0.38rem' }}>
          <span className="mdi mdi-plus" />
        </div>
      </CommonButton>
    );
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'shareState/getShareUsers',
      payload: {
        sharing_type: 0,
        limit: 100,
      },
    });
  }

  shareDevice = () => {
    const { dispatch, params } = this.props;
    const uid = localStorage.getItem('uid');
    dispatch({
      type: 'shareState/shareDevice',
      payload: {
        body: {
          type: 1,
          did: params.did,
          uid,
        },
        success: (data) => {
          this.setState({
            qrcode: data.qr_content.split('&')[1].split('=')[1],
            modal: true,
          });
        },
      },
    });
  }

  onDelete = (item) => {
    Modal.alert('取消分享', '确定取消分享吗?', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '取消分享', onPress: () => {
        // 删除分享
        const { dispatch } = this.props;
        dispatch({
          type: 'shareState/cancelShareDevice',
          payload: {
            shareId: item.id,
            success: () => {
              // 刷新
              dispatch({
                type: 'shareState/getShareUsers',
                payload: {
                  sharing_type: 0,
                  limit: 100,
                },
              });
            },
          },
        });
      } },
    ]);
  }

  render() {
    console.log(this.props.deviceList);
    const { qrcode } = this.state;
    const { shareToSend } = this.props.shareState;
    return (
      <div>
        <NavBar
          title="SHARE_DEVICE"
          leftButton={<BackButton />}
          rightButton={shareToSend.objects.length > 0 ? this.button : null}
        />
        <MenuPage>
          <Modal
            transparent
            platform="ios"
            visible={this.state.modal}
            onClose={this.onClose}
            footer={[{ text: '确定', onPress: this.onClose, style: { color: 'rgb(2, 196, 177)' } }]}
          >
            <div className="qr-code">
              <QRCode value={qrcode} size={300} />
            </div>
            <br />
            分享设备二维码
          </Modal>
          {
            shareToSend.objects.length > 0 ? (
              <List style={styles.list}>
                {
                  shareToSend.objects.map((item) => {
                    return (
                      <SwipeAction
                        autoClose
                        right={[
                          {
                            text: <div style={itemStyles.at}>删除</div>,
                            onPress: this.onDelete.bind(null, item),
                            style: itemStyles.dl,
                          },
                        ]}
                      >
                        <List.Item>{item.phone}</List.Item>
                      </SwipeAction>
                    );
                  })
                }
              </List>
            ) : (
              <div>
                <div style={styles.noneContent}>
                  <span style={styles.noneTips}>该设备未分享给任何好友</span>
                </div>
                <div style={styles.tab}>
                  <div style={styles.tabButton} onClick={this.shareDevice}>
                    <span className="mdi mdi-plus" style={styles.icon} />
                  </div>
                  <span style={styles.tabText}><FormattedMessage id="SHARE_DEVICE" /></span>
                </div>
              </div>
            )
          }
        </MenuPage>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    shareState: state.shareState,
    language: state.language,
    deviceList: state.deviceList,
  };
}

export default connect(mapStateToProps)(DeviceSharing);
