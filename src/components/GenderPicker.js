import React, { PropTypes } from 'react';
import { List, Picker } from 'antd-mobile';
import { createForm } from 'rc-form';

const genders = [
  { value: 0, label: '男' },
  { value: 1, label: '女' },
];

function GenderPicker(props) {
  return (
    <Picker
      data={genders}
      cols={1}
      title="选择性别"
      extra="可选"
      className="forss"
      {...props.fieldProps}
    >
      <List.Item arrow="horizontal">性别</List.Item>
    </Picker>
  );
}

GenderPicker.propTypes = {
  fieldProps: PropTypes.any,
};

const GenderPickerForm = createForm()(GenderPicker);
export default GenderPickerForm;
