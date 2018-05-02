import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import router from '../../utils/router';
import RefreshControlList from '../../components/RefreshControlList';

import Toast from '../../utils/Toast';
import DefaultList from '../../components/TimingList/DefaultList';
import NonePage from '../../components/TimingList/NonePage';
import Item from '../../components/TimingList/Item';
import { getLanguageString } from '../../utils/getLanguage';
import { getItemForPk } from '../../utils/configExpand';
import InfoAlert from '../../components/InfoAlert';

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
    const { productKey, dispatch, did } = this.props;
    const item = getItemForPk(productKey);
    this.powerAttr = item.powerAttr;

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

  onDelete = (item) => {
    const { dispatch, did, language } = this.props;
    const DELETE_TIMING_FAILURE = getLanguageString(language.key, 'DELETE_TIMING_FAILURE');
    const LOADING = getLanguageString(language.key, 'LOADING');
    Toast.loading(LOADING);
    dispatch({
      type: 'scheduler/delete',
      payload: {
        id: item.id,
        did,
        success: () => {
          Toast.hide();
        },
        error: () => {
          InfoAlert.show(DELETE_TIMING_FAILURE, 'error', 3000);
        },
      },
    });
  }

  onSwitch = (item, value) => {
    const { dispatch, did, language } = this.props;
    const { attrs, id, repeat } = item.originalData;
    const time = { hour: item.time.hours, min: item.time.min };

    const EDIT_TIMING_FAILURE = getLanguageString(language.key, 'EDIT_TIMING_FAILURE');
    const LOADING = getLanguageString(language.key, 'LOADING');

    Toast.loading(LOADING);

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
        success: () => {
          Toast.hide();
        },
        error: () => {
          InfoAlert.show(EDIT_TIMING_FAILURE, 'error', 3000);
        },
      },
    });
  }

  onEdit = (data) => {
    const { did, productKey } = this.props;
    router.go(`#/menu/timing/${productKey}/${did}/detail/${data.id}/edit`);
  }

  onRefresh = () => {
    const { dispatch, did } = this.props;
    dispatch({
      type: 'scheduler/query',
      payload: { did },
    });
  }

  createRow = (rowData, sectionID, rowID) => {
    const { language, scheduler } = this.props;

    let expand = null;

    // 获取配置文件，查看是否存在拓展
    const { productKey } = this.props;
    const item = getItemForPk(productKey);
    if (item.scheduler && item.scheduler.featureList && item.scheduler.featureList.length > 0) {
      const activeItem = item.scheduler.featureList[0];
      const attr = activeItem.attr;
      const attrText = getLanguageString(language.key, attr);
      expand = `${attrText}:${rowData.attrs[attr]}`;
    }

    const EDIT = getLanguageString(language.key, 'EDIT');
    const DELETE = getLanguageString(language.key, 'DELETE');
    return (
      <Item
        powerAttr={this.powerAttr}
        editText={EDIT}
        deleteText={DELETE}
        onClick={this.onEdit}
        onSwitch={this.onSwitch}
        onEdit={this.onEdit}
        onDelete={this.onDelete}
        expand={expand}
        key={rowData.id}
        data={rowData}
      />
    );
  };

  addTiming = () => {
    const { did, productKey } = this.props;
    router.go(`#/menu/timing/${productKey}/${did}/detail/create`);
  }


  render() {
    const { data, loading, isDefault } = this.props.scheduler;
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
            data={data}
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
