import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import { List } from 'antd-mobile';

import BackButton from '../../containers/MenuButton/BackButton';
import CommonButton from '../../containers/MenuButton/CommonButton';
import Scroll from '../../components/Scroll';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';
import InfoAlert from '../../components/InfoAlert';

import router from '../../utils/router';
import { getItemForPk, getSceneDataPointConfig } from '../../utils/configExpand';
import { getLanguageString } from '../../utils/getLanguage';

const Item = List.Item;

const styles = {
  list: {
    borderTop: '1px solid rgba(0,0,0,0.08)',
  },
};

class ScenarioFeatures extends Component {

  componentWillMount() {
    const { params, scenario } = this.props;
    const { taskId, id, productKey } = params;
    const activeItem = scenario.activeItem;

    // 获取配置文件
    if (productKey !== '') {
      this.productConfig = getItemForPk(productKey);
    }
    this.activeTask = scenario.activeTask;

    this.button = (<CommonButton
      onClick={this.onSave}
    >
      <div style={{ fontSize: '0.32rem' }}>
        <FormattedMessage id="SAVE" />
      </div>
    </CommonButton>);
  }

  onClick = (item) => {
    const { params, scenario } = this.props;
    const { productKey, id, taskId } = params;
    router.go(`#menu/scenarioFeaturesDetail/${id}/${taskId}/${productKey}/${item.dataPoint}`);
  }

  getKeys = (obj) => {
    const keys = [];
    for (const key in obj) {
      keys.push(key);
    }
    return keys;
  }

  onSave = () => {
    // 保存task
    const { dispatch, scenario, params, language } = this.props;
    const { taskId } = params;
    const attrsKeys = this.getKeys(scenario.activeTask.attrs);
    if (attrsKeys.length === 0) {
      const PLEASE_SELECT_AT_LEAST_ONE_ACTION = getLanguageString(language.key, 'PLEASE_SELECT_AT_LEAST_ONE_ACTION');
      InfoAlert.show(PLEASE_SELECT_AT_LEAST_ONE_ACTION, 'error', 2000);
      return;
    }
    if (scenario.activeTask.id) {
      dispatch({
        type: 'scenario/updateTaskToActiveItem',
      });
    } else {
      dispatch({
        type: 'scenario/addTaskToActiveItem',
      });
    }
    if (taskId === 'new') {
      router.goBack(-2);
    } else {
      router.goBack(-1);
    }
  }

  render() {
    const { scenario } = this.props;
    return (
      <div>
        <NavBar
          title="FEATURE_LIST"
          rightButton={this.button}
          leftButton={<BackButton />}
        />
        <MenuPage theme="dark" hasTab>
          <Scroll>
            <List style={styles.list} className="my-list">
              {
                this.productConfig.scene.featureList.map((item, index) => {
                  let labelText = '';
                  for (const key in this.activeTask.attrs) {
                    if (key === item.dataPoint) {
                      const dataPointConfig = getSceneDataPointConfig(this.productConfig.productKey, key);
                      labelText = `${this.activeTask.attrs[key]}`;
                      if (dataPointConfig.type === 'Enumeration') {
                        // 如果是枚举型 要把文字显示出来
                        dataPointConfig.value.map((dataPointItem) => {
                          if (`${dataPointItem.value}` === labelText) {
                            labelText = dataPointItem.label;
                          }
                        });
                      }
                    }
                  }
                  return (
                    <Item
                      arrow="horizontal"
                      extra={
                        <FormattedMessage id={labelText || ' '} />
                      }
                      onClick={this.onClick.bind(null, item)}
                      key={index}
                    >
                      <FormattedMessage id={item.label || ' '} />
                    </Item>
                  );
                })
              }
            </List>
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

ScenarioFeatures.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
    scenario: state.scenario,
  };
}


export default connect(mapStateToProps)(ScenarioFeatures);
