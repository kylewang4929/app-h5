import React, { Component } from 'react';
import { connect } from 'dva';
import MenuPage from '../components/MenuPage';

const styles = {
  container: {
  },
};
class Launch extends Component {

  render() {
    return (
      <MenuPage key="1" style={styles.container}>
        {this.props.children}
      </MenuPage>
    );
  }
}

Launch.propTypes = {
};

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps)(Launch);
