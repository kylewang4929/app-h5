import React, { Component } from 'react';
import { connect } from 'dva';
import Page from '../components/Page';
import router from '../utils/router';

const styles = {
  container: {},
};

class Menu extends Component {

  back = () => {
    const { navState } = this.props;
    let { canBack } = navState;
    if (canBack) {
      router.goBack(-1);
    }
  }

  render() {
    const { location, navState, children } = this.props;
    let { canBack } = navState;
    return (
      <Page back={this.back} canBack={canBack}>
         {children} 
      </Page>
    );
  }
}

Menu.propTypes = {
};

function mapStateToProps(state) {
  return {
    navState: state.navState,
    language: state.language,
  };
}

export default connect(mapStateToProps)(Menu);
