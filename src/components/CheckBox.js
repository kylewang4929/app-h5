import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Checkbox } from 'antd-mobile';

const styles = {
  container: {
    display: 'inline-block',
		width: '0.42rem',
    height: '0.42rem',
    position: 'relative',
  },
  checkIcon: {
    position: 'absolute',
    top: '0',
    left: '0',
    display: 'inline-block',
    width: '0.42rem',
    height: '0.42rem',
    boxSizing: 'border-box',
    borderRadius: '0.1rem',
    lineHeight: '0.30rem',
    textAlign: 'center',
    color: '#fff',
  }
};

const CheckboxItem = Checkbox.CheckboxItem;

class CheckBox extends Component {
  constructor(props){
    super(props);
  }

  onChange() {

  }

  render() {
    const { isChecked } = this.props;
    return (
      <span style={styles.container}>
        <i className="mdi mdi-check" style={{...styles.checkIcon,...(isChecked ? {backgroundColor: '#00C3FF', border: '0.05rem solid #00C3FF'} : {border: '0.05rem solid #757575'})}}></i>
      </span>
    );
  }
}
CheckBox.propTypes = {
  
};

export default CheckBox;
