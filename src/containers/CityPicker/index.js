import React, { PropTypes } from 'react';
import { createForm } from 'rc-form';
import { List, Picker } from 'antd-mobile';

import cityData from './provinces.json';

function CityPicker(props) {
  return (
    <List style={{ backgroundColor: 'white' }}>
      <Picker
        extra="请选择(可选)"
        data={cityData}
        title="选择地区"
        cols={2}
        {...props.fieldProps}
        onOk={e => console.log('ok', e)}
        onDismiss={e => console.log('dismiss', e)}
      >
        <List.Item arrow="horizontal">省市</List.Item>
      </Picker>
    </List>
  );
}

CityPicker.propTypes = {
  fieldProps: PropTypes.any,
};

const CityPickerForm = createForm()(CityPicker);
export default CityPickerForm;
