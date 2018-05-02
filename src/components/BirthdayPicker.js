import React, { PropTypes } from 'react';
import moment from 'moment';
import { DatePicker, List } from 'antd-mobile';
import { createForm } from 'rc-form';

function BirthdayPicker(props) {
  const minDate = moment('1960-01-01', 'YYYY-MM-DD');
  const maxDate = moment();

  return (
    <DatePicker
      mode="date"
      title="选择生日"
      extra="可选"
      minDate={minDate}
      maxDate={maxDate}
      {...props.fieldProps}
    >
      <List.Item arrow="horizontal">生日</List.Item>
    </DatePicker>
  );
}

BirthdayPicker.propTypes = {
  fieldProps: PropTypes.any,
};

const BirthdayPickerForm = createForm()(BirthdayPicker);
export default BirthdayPickerForm;
