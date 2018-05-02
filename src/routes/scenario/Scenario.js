import React, { Component } from 'react';
import { connect } from 'dva';

import ScenarioList from '../../containers/ScenarioList';
import CommonButton from '../../containers/MenuButton/CommonButton';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';
import router from '../../utils/router';

class Scenario extends Component {

  componentWillMount() {
    this.button = (<CommonButton
      onClick={this.add}
    >
      <div style={{ fontSize: '0.44rem' }}>
        <span className="mdi mdi-plus" />
      </div>
    </CommonButton>);

    const { dispatch } = this.props;
    dispatch({
      type: 'scenario/query',
      payload: {
        backgroundLoad: true,
      },
    });
  }

  add = () => {
    router.go('#/menu/scenarioDetail/new');
    const { dispatch } = this.props;
    dispatch({
      type: 'scenario/setActiveItem',
      payload: { id: 'new' },
    });
  }

  render() {
    return (
      <div>
        <NavBar
          title="SMART_SCENARIO"
          rightButton={this.button}
        />
        <MenuPage theme="dark" hasTab>
          <ScenarioList />
        </MenuPage>
      </div>
    );
  }
}

Scenario.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}


export default connect(mapStateToProps)(Scenario);
