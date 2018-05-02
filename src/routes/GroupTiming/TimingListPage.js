import React, { Component } from 'react';
import { connect } from 'dva';

import router from '../../utils/router';
import GroupTimingList from './TimingList';
import BackButton from '../../containers/MenuButton/BackButton';
import AddTiming from '../../containers/MenuButton/AddTiming';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';
import { getItemForPk } from '../../utils/configExpand';

const styles = {
  list: {
    marginTop: '0.3rem',
  },
  container: {
  },
  tipsText: {
    fontSize: '0.32rem',
    paddingRight: '0.1rem',
  },
};

class TimingListPage extends Component {
  onClick = () => {
    const { params, dispatch } = this.props;
    const { did, productKey } = params;
    const id = new Date().getTime();
    const config = getItemForPk(productKey);
    const attr = config.groupScheduler.featureList[0].attr;
    dispatch({
      type: 'groupScheduler/newItem',
      payload: {
        id,
        attr,
      },
    });
    router.go(`#/menu/groupTiming/${productKey}/${did}/detail/${id}/edit`);
  }

  render() {
    const { params } = this.props;
    const { did, productKey } = params;
    return (
      <div>
        <NavBar
          title="TIMING_LIST"
          leftButton={<BackButton />}
          rightButton={<AddTiming onClick={this.onClick} />}
        />
        <MenuPage style={styles.container}>
          <GroupTimingList did={did} productKey={productKey} />
        </MenuPage>
      </div>
    );
  }
}

TimingListPage.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}


export default connect(mapStateToProps)(TimingListPage);
