import React, { Component } from 'react';
import { connect } from 'dva';

class TimingListPage extends Component {

  componentWillMount() {
    
  }

  render() {
    return (
      <div>
        {this.props.children}
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
