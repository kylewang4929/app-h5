import React, { Component } from 'react';
import { PickerView } from 'antd-mobile';

class TimePick extends Component {
  constructor(props) {
    super(props);
    this.pickValue = [];

    const hour = [];
    const min = [];
    for (let j = 0; j <= 23; j++) {
      hour.push({ label: this.formattingNum(j), value: j });
    }
    for (let y = 0; y <= 59; y++) {
      min.push({ label: this.formattingNum(y), value: y });
    }
    this.pickValue.push(hour);
    this.pickValue.push(min);

    this.state = {
      value: this.props.value || [0, 0],
    };
  }

  componentDidMount() {
    this.dom.addEventListener('touchstart', this.onTouchStart);
  }

  onTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }

  // 格式化数组，加个0
  formattingNum = (num) => {
    return (Array(2).join(0) + num).slice(-2);
  }
  onChange = (v) => {
    const { onChange } = this.props;
    const { value } = this.state;
    const arr = value.concat();
    if (v[0] !== arr[0]) arr[0] = v[0];
    if (v[1] !== arr[1]) arr[1] = v[1];
    this.setState({ value: arr });
    onChange(arr);
  }

  render() {
    const { value } = this.state;
    return (
      <div ref={e => this.dom = e}>
        <PickerView
          onChange={v => this.onChange(v)}
          value={value}
          data={this.pickValue}
          cascade={false}
        />
      </div>
    );
  }
}

export default TimePick;

