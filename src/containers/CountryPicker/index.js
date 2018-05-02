import React, { Component, PropTypes } from 'react';
import { List } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import { getLanguageString } from '../../utils/getLanguage';

import { Modal } from '../../components/Modal';
import Scroll from '../../components/Scroll';

import Popup from '../../utils/Popup';

const Item = List.Item;

const locationObj = require('./location.json');

const styles = {
  container: {
    borderBottom: '0.02rem solid rgba(224, 224, 224, 0.055)',
  },
  item: {
    borderRadius: '0.1rem',
    overflow: 'hidden',
  },
  itemText: {
    padding: '0.16rem 0',
  },
};

class CountryPicker extends Component {

  constructor(props) {
    super(props);
    const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
    this.maskProps = {};
    if (isIPhone) {
      // Note: the popup content will not scroll.
      this.maskProps = {
        onTouchStart: e => e.preventDefault(),
      };
    }
  }

  componentWillMount() {
    // 从本地读取phoneCode
    const { dispatch, language } = this.props;
    this.languageJson = locationObj;

    let defaultPhoneCode = this.languageJson[0].value;
    switch (language.key) {
      case 'zh': {
        defaultPhoneCode = '+86';
        break;
      }
      case 'zh-cn': {
        defaultPhoneCode = '+86';
        break;
      }
      case 'zh-hk': {
        defaultPhoneCode = '+86';
        break;
      }
      case 'zh-mo': {
        defaultPhoneCode = '+86';
        break;
      }
      case 'zh-tw': {
        defaultPhoneCode = '+86';
        break;
      }
      case 'ja': {
        defaultPhoneCode = '+81';
        break;
      }
      default : {
        defaultPhoneCode = '+1';
        break;
      }
    }

    const phoneCode = defaultPhoneCode;
    dispatch({
      type: 'loginState/update',
      payload: {
        phoneCode,
      },
    });
  }

  onChange = (item) => {
    const { dispatch, loginState } = this.props;
    dispatch({
      type: 'loginState/update',
      payload: {
        phoneCode: item.value,
      },
    });
  }

  showList = () => {
    const { language } = this.props;
    const { properties } = this.context;
    Popup.show(
      <ModalContainer properties={properties} language={language.key} data={this.languageJson} onChange={this.onChange} />,
      { animationType: 'slide-up', maskProps: this.maskProps, maskClosable: true, wrapClassName: 'full-modal' },
    );
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { phoneCode } = this.props.loginState;
    return (
      <div style={styles.container}>
        <List className="no-border-list">
          <Item arrow="horizontal" onClick={this.showList} extra={phoneCode}><FormattedMessage id="COUNTRIES_AND_REGION" /></Item>
        </List>
      </div>
    );
  }
}

class ModalContainer extends Component {
  onChange = (item) => {
    Popup.hide();
    this.props.onChange(item);
  }
  onClose = () => {
    Popup.hide();
  }
  render() {
    const { data, language, properties } = this.props;
    return (
      <Modal properties={properties} title={getLanguageString(language, 'SELECT_REGION')} onClose={this.onClose} closeIcon="close">
        <Scroll bounce>
          {/* {
            data.map((item, index) => {
              return (
                <List renderHeader={item.key} key={index} className="my-list address-list">
                  {
                    item.data.map((subItem, subIndex) => {
                      return (
                        <Item
                          key={subIndex}
                          arrow="horizontal"
                          extra={`${subItem.value}`}
                          style={styles.item}
                          onClick={this.onChange.bind(null, subItem)}>
                          {subItem.label}
                        </Item>);
                    })
                  }
                </List>
              );
            })
          } */}
          <List>
            {
              data.map((subItem, subIndex) => {
                const text = getLanguageString(language, subItem.label);
                return (
                  <Item
                    key={subIndex}
                    arrow="horizontal"
                    extra={`${subItem.value}`}
                    onClick={this.onChange.bind(null, subItem)}
                  >
                    <div style={styles.itemText}>{text}</div>
                  </Item>);
              })
            }
          </List>
        </Scroll>
      </Modal>
    );
  }
}

CountryPicker.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    loginState: state.loginState,
    language: state.language,
  };
}

const CountryPickerForm = createForm()(CountryPicker);

export default connect(mapStateToProps)(CountryPickerForm);
