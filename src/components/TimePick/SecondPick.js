import React, { Component } from 'react';
import { PickerView } from 'antd-mobile';

class SecondPick extends Component {
  constructor(props) {
    super(props);
    this.min = [];
    for (let y = 0; y <= 59; y++) {
      this.min.push({ label: this.formattingNum(y), value: y });
    }

    this.state = {
      value: this.props.value || [0],
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
    this.setState({ value: v });
    onChange(v);
  }

  render() {
    const { value } = this.state;
    return (
      <div ref={e => this.dom = e}>
        <PickerView
          onChange={v => this.onChange(v)}
          cols={1}
          value={value}
          data={this.min}
        />
      </div>
    );
  }
  }

export default SecondPick;
