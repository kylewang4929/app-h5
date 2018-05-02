import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';

import { SwipeAction } from 'antd-mobile';

import router from '../utils/router';
import RefreshControlList from '../components/RefreshControlList';

import DefaultList from '../components/ScenarioList/DefaultList';
import NonePage from '../components/ScenarioList/NonePage';
import Item from '../components/ScenarioList/Item';
import InfoAlert from '../components/InfoAlert';

import { getLanguageString } from '../utils/getLanguage';

const styles = {
  container: {
    height: '100%',
  },
};

class ScenarioListContainer extends Component {

  constructor(props) {
    super(props);

    const { language } = props;
    this.DELETE = getLanguageString(language.key, 'DELETE');
    this.EXECUTE_SUCCESSFULLY = getLanguageString(language.key, 'EXECUTE_SUCCESSFULLY');

    this.createRow = (rowData, sectionID, rowID) => {
      if (rowData.isPreset) {
        return (
          <Item index={rowID} onAction={this.onExecution} onClick={this.onClick} key={rowID} data={rowData} />
        );
      } else {
        return (
          <SwipeAction
            autoClose
            key={rowID}
            right={[
              {
                text: this.DELETE,
                onPress: this.delete.bind(null, rowData),
                style: { backgroundColor: '#F4333C', color: 'white' },
              },
            ]}
          >
            <Item index={rowID} onAction={this.onExecution} onClick={this.onClick} data={rowData} />
          </SwipeAction>
        );
      }
    };
  }

  delete = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scenario/delete',
      payload: { id: item.id },
    });
  }

  onClick = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scenario/setActiveItem',
      payload: { id: item.id },
    });
    router.go(`#/menu/scenarioDetail/${item.id}`);
  }

  onExecution = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scenario/execution',
      payload: { 
        id: item.id,
        success: () => {
          InfoAlert.show(this.EXECUTE_SUCCESSFULLY, 'success', 2000);
        }
      },
    });
  }

  onRefresh = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scenario/query',
    });
  }

  addScenario = () => {

  }

  render() {
    const { data, loading, isDefault } = this.props.scenario;
    return (
      <div style={styles.container}>
        <div style={{ display: isDefault ? 'block' : 'none' }}>
          <DefaultList />
        </div>
        <div style={{ display: !isDefault ? 'block' : 'none', height: '100%' }}>
          <RefreshControlList
            NonePage={<NonePage onClick={this.addScenario} />}
            onClick={this.onClick}
            refreshing={loading}
            createRow={this.createRow}
            data={data}
            onRefresh={this.onRefresh}
          />
        </div>
      </div>
    );
  }
}

ScenarioListContainer.propTypes = {
  scenario: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    language: state.language,
    scenario: state.scenario,
  };
}

export default connect(mapStateToProps)(ScenarioListContainer);
