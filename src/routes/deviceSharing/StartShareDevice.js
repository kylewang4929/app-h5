import React from 'react';
import { connect } from 'dva';
import { List, Button, WhiteSpace, WingBlank, InputItem, Switch } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import { createForm } from 'rc-form';
import BackButton from '../../containers/MenuButton/BackButton';
import router from '../../utils/router';
import Scroll from '../../components/Scroll';
import NonePage from '../../components/StatePage/NonePage';
import { getLanguageString } from '../../utils/getLanguage';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';

const Item = List.Item;

const styles = {
  btn: {
    width: '100%',
    height: '1.1rem',
    lineHeight: '1.1rem',
    position: 'absolute',
    bottom: '0px',
    zIndex: 999,
    border: 'none',
    borderRadius: '0px',
  },
  defaultBtn: {

  },
};

/**
 * 业务：
 * <li>选择要分享的设备
 * <li>输入分享用户的账号
 * <li>执行分享
 *
 * @returns {XML}
 */
class StartShareDevice extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checkboxList: [
        // 'did1', 'did2'
      ],
      shouldSelectUser: false,
      userAccount: '',
      shareSuccessArray: [
        // 'did1', 'did2'
      ],
      shareErrorArray: [
        // 'did1', 'did2'
      ],
      title: 'INITIATING_DEVICE_SHARING',
    };
  }

  handleCheckbox(did) {
    let isExist = false;
    const didArray = [];
    for (const _did of this.state.checkboxList) {
      if (_did === did) {
        isExist = true;
      } else {
        didArray.push(_did);
      }
    }

    if (!isExist) {
      didArray.push(did);
    }

    this.setState({
      checkboxList: didArray,
    });
  }

  /**
   * 切换到“目标分享用户选择”
   * <li>更新state
   * <li>更新头部Bar
   */
  goUserSelector() {
    this.setState({
      shouldSelectUser: !this.state.shouldSelectUser,
      title: 'SHARE_TO_NEW_MEMBERS',
    });
  }

  /**
   * 确定分享设备
   *
   * 必填项：
   * type： 0（普通分享）、1（二维码分享）
   * did：string
   * 用户：uid/username/email/phone
   *
   * 选填：
   * duration：最小1分钟、最大1440(24小时)分钟，默认1440分钟
   */
  submit() {
    const that = this;
    const { dispatch } = this.props;
    const { getFieldValue } = this.props.form;

    const phoneOrEmail = getFieldValue('phoneOrEmail');
    let _dict = {};

    if (/^((\w-*\.*)+@(\w-?)+(\.\w{2,})+)$/.test(phoneOrEmail)) {
      _dict = { email: phoneOrEmail };
    } else {
      _dict = { phone: phoneOrEmail };
    }
    for (const did of this.state.checkboxList) {
      dispatch({
        type: 'shareState/shareDevice',
        payload: {
          body: {
            type: 0,
            did,
            ..._dict,
          },
          success: (did) => {
            const updateArray = that.state.shareSuccessArray;
            if (!updateArray.includes(did)) {
              that.setState({
                shareSuccessArray: [...updateArray, did],
              });
            }
            router.goBack(-1);
          },
          error: (did) => {
            const updateArray = that.state.shareErrorArray;
            if (!updateArray.includes(did)) {
              that.setState({
                shareErrorArray: [...updateArray, did],
              });
            }
          },
        },
      });
    }
  }

  render() {
    const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
    const accountError = getFieldError('phoneOrEmail');
    const account = getFieldValue('phoneOrEmail');

    const { data } = this.props.deviceList;
    const { shouldSelectUser } = this.state;

    const { language } = this.props;
    const PHONE_AND_EMAIL = getLanguageString(language.key, 'PHONE_AND_EMAIL');

    const that = this;

    const { title } = this.state;

    return (
      <div>
        <NavBar
          title={title}
          leftButton={<BackButton />}
        />
        {
          !shouldSelectUser ? (
            <MenuPage>
              <Scroll bounce={true}>
                <WhiteSpace />
                <List className="my-list">
                  {data.map((item, index) => {
                    // 如果是分享给我的设备则不显示
                    if (!item.isShare) {
                      return (
                        <Item
                          key={index}
                          extra={<Switch
                            checked={this.state.checkboxList.includes(item.did)}
                            onClick={() => that.handleCheckbox(item.did)} />}
                        >
                          {item.name}
                        </Item>
                      );
                    }
                  })}
                  <WhiteSpace style={{ height: '1.1rem' }} />
                </List>
                {
                  data.length === 0 ? (
                    <NonePage
                      icon="mdi mdi-chart-bubble"
                      text={
                        <span>
                          <FormattedMessage id="THERE_IS_NO_DEVICE_TO_SHARE" />
                          <br />
                          <FormattedMessage id="GO_AHEAD_AND_ADD_THE_DEVICE" />
                        </span>
                      }
                    />
                  ) : null
                }
              </Scroll>
              <Button
                style={styles.btn}
                className="btn"
                type="primary"
                disabled={!this.state.checkboxList.length}
                onClick={this.goUserSelector.bind(this)}
              >
                <FormattedMessage id="SHARE_TO_NEW_MEMBERS" />
              </Button>
            </MenuPage>
          ) : (
            <MenuPage>
              <Scroll bounce={true}>
                <WingBlank>
                  <WhiteSpace size="md" />
                  <List className="no-border-list list-radius">
                    <InputItem
                      placeholder={PHONE_AND_EMAIL}
                      {...getFieldProps(
                          'phoneOrEmail',
                        {
                          rules: [
                              { required: true },
                              { pattern: /^((\w-*\.*)+@(\w-?)+(\.\w{2,})+)|(\d)+$/ },
                          ],
                        },
                        )}
                    />
                  </List>
                  <WhiteSpace size="md" />
                  <Button
                    onClick={this.submit.bind(this)}
                    disabled={!(account && !accountError)}
                    className="btn"
                    type="primary"
                    style={styles.defaultBtn}
                  ><FormattedMessage id="SHARE" /></Button>
                </WingBlank>
              </Scroll>
            </MenuPage>
            )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deviceList: state.deviceList,
    loginState: state.loginState,
    language: state.language,
  };
}

const StartShareDeviceForm = createForm()(StartShareDevice);
export default connect(mapStateToProps)(StartShareDeviceForm);
