import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import router from '../../utils/router';
import RefreshControlList from '../../components/RefreshControlList';

import DefaultList from '../../components/TimingList/DefaultList';
import NonePage from '../../components/TimingList/NonePage';
import Item from '../../components/TimingList/Item';
import { getLanguageString } from '../../utils/getLanguage';
import InfoAlert from '../../components/InfoAlert';
import { collatingData } from '../../utils/groupTimingFilter';

const styles = {
  container: {
    height: '100%',
  },
};

class TimingListContainer extends Component {

  constructor(props) {
    super(props);
    const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
    this.maskProps = {};
    if (isIPhone) {
      // Note: the popup content will not scroll.
      this.maskProps = {
        onTouchStart: e => e.preventDefault(),
      };
    }
  }

  componentWillMount() {
    const { dispatch, did } = this.props;
    dispatch({
      type: 'scheduler/resetData',
    });
    dispatch({
      backgroundLoad: true,
      type: 'scheduler/query',
      payload: {
        did,
        backgroundLoad: true,
      },
    });
  }

  onDelete = (data) => {
    const { dispatch, did, language } = this.props;
    const DELETE_TIMING_FAILURE = getLanguageString(language.key, 'DELETE_TIMING_FAILURE');
    data.data.map((item) => {
      dispatch({
        type: 'scheduler/delete',
        payload: {
          id: item.id,
          did,
          success: () => {
            // Toast.hide();
          },
          error: () => {
            InfoAlert.show(DELETE_TIMING_FAILURE, 'error', 3000);
          },
        },
      });
    });
  }

  onSwitch = (data, value) => {
    const { dispatch, did, language } = this.props;
    const EDIT_TIMING_FAILURE = getLanguageString(language.key, 'EDIT_TIMING_FAILURE');
    data.data.map((item) => {
      const { attrs, id, repeat, remark } = item.originalData;
      const time = { hour: item.time.hours, min: item.time.min };
      dispatch({
        type: 'scheduler/edit',
        payload: {
          did,
          attrs,
          date: item.date,
          id,
          repeat,
          time,
          enabled: value,
          remark,
          success: () => {
            // Toast.hide();
          },
          error: () => {
            InfoAlert.show(EDIT_TIMING_FAILURE, 'error', 3000);
          },
        },
      });
    });
  }

  onEdit = (data) => {
    const { did, productKey, dispatch } = this.props;
    // 更新到modal
    dispatch({
      type: 'groupScheduler/updateActiveItem',
      payload: data,
    });
    router.go(`#/menu/groupTiming/${productKey}/${did}/detail/${data.id}/edit`);
  }

  onRefresh = () => {
    const { dispatch, did } = this.props;
    dispatch({
      type: 'scheduler/query',
      payload: { did },
    });
  }

  createRow = (rowData, sectionID, rowID) => {
    const { language } = this.props;
    const EDIT = getLanguageString(language.key, 'EDIT');
    const DELETE = getLanguageString(language.key, 'DELETE');
    return (
      <Item
        hidePowerTips
        editText={EDIT}
        deleteText={DELETE}
        onClick={this.onEdit}
        onSwitch={this.onSwitch}
        onEdit={this.onEdit}
        onDelete={this.onDelete}
        key={rowData.id}
        data={rowData}
      />
    );
  };

  addTiming = () => {
    const { did, productKey } = this.props;
    // router.go(`#/menu/timing/${productKey}/${did}/detail/create`);
  }


  render() {
    const { data, loading, isDefault } = this.props.scheduler;

    const groupTiming = collatingData(data);
    return (
      <div style={styles.container}>
        <div style={{ display: isDefault ? 'block' : 'none' }}>
          <DefaultList />
        </div>
        <div style={{ display: !isDefault ? 'block' : 'none', height: '100%' }}>
          <RefreshControlList
            NonePage={<NonePage text={<FormattedMessage id="TIMING_LIST_IS_NONE" />} onClick={this.addTiming} />}
            onClick={this.onEdit}
            refreshing={loading}
            createRow={this.createRow}
            data={groupTiming}
            onRefresh={this.onRefresh}
          />
        </div>
      </div>
    );
  }
}

TimingListContainer.propTypes = {
  scheduler: PropTypes.object,
  did: PropTypes.string,
  dispatch: PropTypes.any,
  productKey: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    scheduler: state.scheduler,
    gizwitsSdk: state.gizwitsSdk,
    language: state.language,
  };
}

export default connect(mapStateToProps)(TimingListContainer);
