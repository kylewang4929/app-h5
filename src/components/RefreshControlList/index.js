import React, { Component, PropTypes } from 'react';
import { ListView } from 'antd-mobile';
import RefreshControl from './RefreshControl';

require('./styles.less');

// let index = 0;
// let pageIndex = 0;

const styles = {
  listContainer: {
    boxSizing: 'border-box',
    height: '100%',
    width: '100%',
  },
};

class RefreshControlList extends Component {

  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.mac !== row2.mac,
    });

    this.state = {
      dataSource: this.dataSource.cloneWithRows(props.data),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.dataSource.cloneWithRows(nextProps.data),
    });
  }

  onRefresh = () => {
    if (!this.manuallyRefresh) {
      this.props.onRefresh();
    } else {
      this.manuallyRefresh = false;
    }
  };

  render() {
    const { refreshing, data, NonePage, createRow } = this.props;
    return (
      <div style={styles.listContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={createRow}
          renderSeparator={null}
          initialListSize={15}
          pageSize={15}
          scrollRenderAheadDistance={200}
          scrollEventThrottle={20}
          scrollerOptions={{ scrollbars: true }}
          refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={this.onRefresh}
          />}
        >
          {
            data.length === 0 ? NonePage : null
          }
        </ListView>
      </div>
    );
  }
}
RefreshControlList.propTypes = {
  data: PropTypes.array,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  NonePage: PropTypes.element,
  createRow: PropTypes.func,
};

export default RefreshControlList;
