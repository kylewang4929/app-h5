import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import { List, Slider, createTooltip } from 'antd-mobile';
import CommonButton from '../../containers/MenuButton/CommonButton';
import BackButton from '../../containers/MenuButton/BackButton';
import Scroll from '../../components/Scroll';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';
import router from '../../utils/router';
import { getItemForPk } from '../../utils/configExpand';

const SliderWithTooltip = createTooltip(Slider); // High Order Component

const Item = List.Item;

const styles = {
  list: {
    borderTop: '1px solid rgba(0,0,0,0.08)',
  },
  box: {
    backgroundColor: '#fff',
    padding: '0.3rem 0rem 0.6rem 0rem',
    marginTop: '0.2rem',
  },
  sliderBox: {
    padding: '0rem 0.54rem 0rem 0.54rem',
    position: 'relative',
  },
  title: {
    fontSize: '0.28rem',
    color: '#909090',
    padding: '0 0.3rem',
    marginBottom: '0.5rem',
  },
  sliderLeft: {
    fontSize: '0.28rem',
    color: '#909090',
    position: 'absolute',
    left: '0.3rem',
    top: '0px',
    marginTop: '-0.14rem',
  },
  sliderRight: {
    fontSize: '0.28rem',
    color: '#909090',
    position: 'absolute',
    right: '0.3rem',
    top: '0px',
    marginTop: '-0.14rem',
  },
};

/**
 * 目前数据点的类型支持Boolean Number Enumeration
 */

class ScenarioFeaturesDetail extends Component {

  state = {
    value: 0,
  };

  componentWillMount() {
    const { params, scenario } = this.props;
    const { productKey, dataPoint } = params;
    // 获取配置文件
    if (productKey !== '') {
      this.productConfig = getItemForPk(productKey);
      this.productConfig.scene.featureList.map((item) => {
        if (item.dataPoint === dataPoint) {
          this.dataPointConfig = item;
        }
      });
    }
    if (this.dataPointConfig.type === 'Number') {
      // 数值型
      let value = this.dataPointConfig.min;
      for(const key in scenario.activeTask.attrs) {
        value = scenario.activeTask.attrs[key];
      }
      this.setState({
        value,
      });

      this.button = (<CommonButton
        onClick={this.onSaveNumber}
      >
        <div style={{ fontSize: '0.32rem' }}>
          <FormattedMessage id="SAVE" />
        </div>
      </CommonButton>);
    }
    if (this.dataPointConfig.type === 'Enumeration') {
      let value = 0;
      for(const key in scenario.activeTask.attrs) {
        value = scenario.activeTask.attrs[key];
      }
      this.setState({
        value,
      });
    }
  }

  onSave = (item) => {
    const { params, dispatch } = this.props;
    const { taskId } = params;
    dispatch({
      type: 'scenario/updateTaskToActiveTask',
      payload: {
        data: item,
      },
    });
    router.goBack(-1);
  }

  onSaveNumber = () => {
    const { value } = this.state;
    this.onSave({
      dataPoint: this.dataPointConfig.dataPoint,
      value,
    });
  }

  onNumberChange = (value) => {
    this.setState({
      value,
    });
  }

  onBollenClick = (value) => {
    this.onSave({
      dataPoint: this.dataPointConfig.dataPoint,
      value,
    });
  }

  onEnumerationChange = (item) => {
    this.onSave({
      dataPoint: this.dataPointConfig.dataPoint,
      value: item.value,
    });
  }

  render() {
    const { value } = this.state;
    return (
      <div>
        <NavBar
          title="FEATURE_LIST"
          rightButton={this.button}
          leftButton={<BackButton />}
        />
        <MenuPage theme="dark" hasTab>
          <Scroll>
            {
              this.dataPointConfig.type === 'Boolean' ? <BooleanItem onClick={this.onBollenClick} /> : null
            }
            {
              this.dataPointConfig.type === 'Number' ? <NumberItem value={value} config={this.dataPointConfig} onChange={this.onNumberChange} /> : null
            }
            {
              this.dataPointConfig.type === 'Enumeration' ? <EnumerationItem value={value} config={this.dataPointConfig} onClick={this.onEnumerationChange} /> : null
            }
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

class BooleanItem extends Component {
  onClick = (type) => {
    this.props.onClick && this.props.onClick(type);
  }
  render() {
    const { data } = this.props;
    return (
      <List style={styles.list} className="my-list">
        <Item onClick={this.onClick.bind(null, true)}>
          <FormattedMessage id="ON" />
        </Item>
        <Item onClick={this.onClick.bind(null, false)}>
          <FormattedMessage id="OFF" />
        </Item>
      </List>
    );
  }
}

class NumberItem extends Component {
  onChange = (value) => {
    this.props.onChange && this.props.onChange(value);
  }
  render() {
    const { config, value } = this.props;
    return (
      <div style={styles.box}>
        <div style={styles.title}>
          <FormattedMessage id={config.label} />
        </div>
        <div style={styles.sliderBox}>
          <div style={styles.sliderLeft}>
            <FormattedMessage id={config.minLabel} />
          </div>
          <SliderWithTooltip onChange={this.onChange} value={value} min={config.min} max={config.max} />
          <div style={styles.sliderRight}>
            <FormattedMessage id={config.maxLabel} />
          </div>
        </div>
      </div>
    );
  }
}

class EnumerationItem extends Component {
  onClick = (item) => {
    const { onClick } = this.props;
    onClick && onClick(item);
  }
  render() {
    const { config } = this.props;
    return (
      <List style={styles.list} className="my-list">
        {
          config.value.map((item, index) => {
            return (
              <Item key={index} onClick={this.onClick.bind(null, item)}>
                <FormattedMessage id={item.label} />
              </Item>
            );
          })
        }
      </List>
    );
  }
}

ScenarioFeaturesDetail.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
    scenario: state.scenario,
  };
}


export default connect(mapStateToProps)(ScenarioFeaturesDetail);
