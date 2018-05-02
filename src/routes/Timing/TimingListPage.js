import React, { Component } from 'react';
import { connect } from 'dva';

import router from '../../utils/router';
import TimingList from './TimingList';
import BackButton from '../../containers/MenuButton/BackButton';
import AddTiming from '../../containers/MenuButton/AddTiming';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';

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
    const { params } = this.props;
    const { did, productKey } = params;
    router.go(`#/menu/timing/${productKey}/${did}/detail/create`);
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
          <TimingList did={did} productKey={productKey} />
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
