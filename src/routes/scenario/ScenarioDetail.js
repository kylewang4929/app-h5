import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import { List, Flex, SwipeAction } from 'antd-mobile';

import CommonButton from '../../containers/MenuButton/CommonButton';
import BackButton from '../../containers/MenuButton/BackButton';
import Scroll from '../../components/Scroll';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';
import InfoAlert from '../../components/InfoAlert';
import router from '../../utils/router';
import { getLanguageString } from '../../utils/getLanguage';

import { getItemForPk } from '../../utils/configExpand';


const Item = List.Item;
const FlexItem = Flex.Item;

class ScenarioDetail extends Component {

  componentWillMount() {
    this.button = (<CommonButton
      onClick={this.add}
    >
      <div style={{ fontSize: '0.32rem' }}>
        <FormattedMessage id="SAVE" />
      </div>
    </CommonButton>);

    this.getItem();

    const { language } = this.props;

    this.GROUPING_NAMES_ALREADY_EXITS = getLanguageString(language.key, 'GROUPING_NAMES_ALREADY_EXITS');
    this.THE_TASK_CANNOT_BE_EMPTY = getLanguageString(language.key, 'THE_TASK_CANNOT_BE_EMPTY');
  }

  getItem = () => {
    const { scenario, params } = this.props;
    const { data } = scenario;
    const obj = scenario.activeItem;
    // if (params.id === 'new') {
    //   obj = this.getDefault();
    // } else {
    //   obj = scenario.activeItem;
    //   data.map((item) => {
    //     if (item.id === params.id) {
    //       obj = item;
    //     }
    //   });
    // }
    // obj = scenario.activeItem;
    this.setState({
      data: obj,
    });
  }

  getDefault = () => {
    // 根据语言判断
    const { language } = this.props;
    const SCENE = getLanguageString(language.key, 'SCENE');
    return {
      icon: 'mdi mdi-view-dashboard',
      name: SCENE,
    };
  }

  add = () => {
    // 添加或者保存场景
    const { params, dispatch, scenario } = this.props;
    const { data } = this.state;
    const { name } = data;
    const { tasks } = scenario.activeItem;

    if (tasks.length === 0) {
      InfoAlert.show(this.THE_TASK_CANNOT_BE_EMPTY, 'error', 2000);
      return;
    }

    if (params.id === 'new') {
      dispatch({
        type: 'scenario/create',
        payload: {
          name,
          tasks,
          success: () => {
            router.goBack(-1);
          },
          error: (data) => {
            if (data.data.error_code === 9224) {
              InfoAlert.show(this.GROUPING_NAMES_ALREADY_EXITS, 'error', 2000);
            }
          },
        },
      });
    } else {

      /**
       * 这里有另一种可能，可能是预设的场景
       */
      if (scenario.activeItem.isPreset) {
        // 预设
        if (scenario.activeItem.isDefault) {
          // 创建
          dispatch({
            type: 'scenario/create',
            payload: {
              name,
              tasks,
              remark: scenario.activeItem.remark,
              success: () => {
                router.goBack(-1);
              },
              error: () => {
              },
            },
          });
          return;
        }
      }

      dispatch({
        type: 'scenario/update',
        payload: {
          ...scenario.activeItem,
          name,
          success: () => {
            router.goBack(-1);
          },
        },
      });
    }
  }

  onNameChange = (name) => {

    const { dispatch } = this.props;
    this.setState({
      data: {
        ...this.state.data,
        name,
      },
    });
    // 更新到modal中
    dispatch({
      type: 'scenario/updateNameToActiveItem',
      payload: name,
    });
  }

  render() {
    const { data } = this.state;
    const { params, dispatch, scenario, language } = this.props;
    return (
      <div>
        <NavBar
          title="SMART_SCENARIO"
          leftButton={<BackButton />}
          rightButton={this.button}
        />
        <MenuPage theme="dark">
          <Scroll>
            <Title
              language={language}
              isPreset={scenario.activeItem.isPreset}
              onNameChange={this.onNameChange}
              data={data}
            />
            <Action
              language={language}
              dispatch={dispatch}
              id={params.id}
              tasks={data.tasks}
            />
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

ScenarioDetail.propTypes = {
};

const titleStyles = {
  title: {
    margin: '0.3rem 0',
  },
  icon: {
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: '1rem',
    color: '#fff',
    fontSize: '0.5rem',
    margin: '0.2rem 0 0.2rem 0.2rem',
  },
  item: {},
  iconBox: {
    maxWidth: '1.2rem',
  },
  textBox: {
    paddingLeft: '0.2rem',
  },
  input: {
    fontSize: '0.32rem',
    height: '100%',
    padding: '0.2rem 0',
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0)',
  },
};

class Title extends Component {
  componentWillMount() {
    let { data, isPreset, language } = this.props;
    const newData = JSON.parse(JSON.stringify(data));
    this.PLEASE_ENTER_THE_SCENE_NAME = getLanguageString(language.key, 'PLEASE_ENTER_THE_SCENE_NAME');
    if (isPreset) {
      // 翻译
      newData.name = getLanguageString(language.key, newData.name);
    }
    this.setState({
      data: newData,
    });
  }

  onChange = (e) => {
    const value = e.nativeEvent.target.value;
    this.setState({
      data: { ...this.state.data, name: value },
    });
    this.props.onNameChange(value);
  }

  render() {
    const { data } = this.state;
    const { properties } = this.context;
    const { isPreset } = this.props;
    return (
      <Item style={titleStyles.title}>
        <Flex>
          <FlexItem style={{ ...titleStyles.item, ...titleStyles.iconBox }}>
            <span
              className={data.icon || 'mdi mdi-view-dashboard'}
              style={{ ...titleStyles.icon, backgroundColor: data.backgroundColor || properties.tintColor }}
            />
          </FlexItem>
          <FlexItem style={{ ...titleStyles.item, ...titleStyles.textBox }}>
            <input
              disabled={isPreset}
              onChange={this.onChange}
              placeholder={this.PLEASE_ENTER_THE_SCENE_NAME}
              style={titleStyles.input}
              value={data.name}
            />
          </FlexItem>
        </Flex>
      </Item>
    );
  }
}

Title.contextTypes = {
  properties: PropTypes.object.isRequired,
};

const actionStyle = {
  buttonBox: {
    maxWidth: '1rem',
    textAlign: 'right',
  },
  button: {
    width: '0.5rem',
    height: '0.5rem',
    border: '0.03rem solid #000',
    borderRadius: '50%',
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: '0.5rem',
    fontSize: '0.5rem',
    margin: '0.2rem 0',
  },
  title: {
    paddingLeft: '0.2rem',
  },
  itemBox: {
    padding: '0 0.2rem',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },
  actionItem: {
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },
  actionItemIcon: {
    width: '1rem',
    height: '1rem',
    margin: '0.24rem 0',
  },
};

class Action extends Component {

  componentWillMount() {
    const { language } = this.props;
    this.DELETE = getLanguageString(language.key, 'DELETE');
  }

  addAction = () => {
    const { id } = this.props;
    router.go(`#/menu/scenarioDeviceList/${id}`);
  }

  editAction = (item) => {
    const { id } = this.props;
    router.go(`#/menu/scenarioFeatures/${id}/${item.id}/${item.product_key}`);

    /**
     * 加入activeTask
     */
    const { dispatch } = this.props;
    dispatch({
      type: 'scenario/updateActiveTask',
      payload: item,
    });
  }

  delete = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scenario/deleteActiveItemTask',
      payload: item.id,
    });
  }

  render() {
    const { tasks } = this.props;
    const { tintColor } = this.context.properties;
    const button = {
      borderColor: tintColor,
      color: tintColor,
    };
    return (
      <div>
        <Item style={actionStyle.itemBox} onClick={this.addAction}>
          <Flex>
            <FlexItem style={{ ...actionStyle.item, ...actionStyle.title }}>
              <span style={actionStyle.text}>
                <FormattedMessage id="ADD_ACTION" />
              </span>
            </FlexItem>
            <FlexItem style={{ ...actionStyle.item, ...actionStyle.buttonBox }}>
              <span style={{ ...actionStyle.button, ...button }} className="mdi mdi-plus" />
            </FlexItem>
          </Flex>
        </Item>
        <List className="my-list">
          {
            tasks.map((item, index) => {
              // 获取设备的配置文件
              const deviceItem = getItemForPk(item.product_key);
              let valueText = '';
              let dataPointConfig = {};
              for(const key in item.attrs) {
                const value = item.attrs[key];
                deviceItem.scene.featureList.map((functionItem) => {
                  if (functionItem.dataPoint === key ) {
                    // 匹配
                    dataPointConfig = functionItem;
                    valueText = `${value}`;
                    if (dataPointConfig.type === 'Enumeration') {
                      // 如果是枚举型 要把文字显示出来
                      dataPointConfig.value.map((dataPointItem) => {
                        if (`${dataPointItem.value}` === valueText) {
                          valueText = dataPointItem.label;
                        }
                      });
                    }
                  }
                });
              }
              return (
                <SwipeAction
                  key={index}
                  style={{ backgroundColor: 'rgba(0,0,0,0)' }}
                  autoClose
                  right={[
                    {
                      text: this.DELETE,
                      onPress: this.delete.bind(null, item),
                      style: { backgroundColor: '#F4333C', color: 'white' },
                    },
                  ]}
                >
                  <Item
                    key={index}
                    style={actionStyle.actionItem}
                    thumb={<img style={actionStyle.actionItemIcon} src={deviceItem.icon} />}
                    extra={
                      <span>
                        <FormattedMessage id={dataPointConfig.label} />
                        <span> : </span>
                        <FormattedMessage id={valueText} />
                      </span>
                    }
                    arrow="horizontal"
                    onClick={this.editAction.bind(null, item)}
                  >
                    {item.dev_alias || item.group_name}
                  </Item>
                </SwipeAction>
              );
            })
          }
        </List>
      </div>
    );
  }
}
Action.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
};
Action.contextTypes = {
  properties: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return {
    language: state.language,
    scenario: state.scenario,
  };
}


export default connect(mapStateToProps)(ScenarioDetail);
