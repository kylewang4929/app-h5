import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { InputItem, List } from 'antd-mobile';

const styles = {
  container: {
		overflow: 'hidden',
		width: '100%',
		height: '1.8rem',
		backgroundColor: '#fff',
  },
  iconBox: {
    float: 'left',
    position: 'relative',
    height: '1.8rem',
    width: '1.8rem',
  },
  deviceIcon: {
    position: 'absolute',
    height: '1.2rem',
    width: '1.2rem',
    left: '50%',
    top: '50%',
    marginTop: '-0.6rem',
    marginLeft: '-0.6rem',
  },
  titleBox: {
    float: 'left',
    height: '1.8rem',
    paddingTop: '0.2rem',
  },
  title: {
    fontSize: '0.32rem',
    color: '#121212',
    margin: '0',
    padding: '0',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: '0.28rem',
    color: '#909090',
    height: '0.75rem',
    margin: '0',
    padding: '0',
    paddingLeft: '0.3rem',
  },
};

class EditGroupHead extends Component {
  constructor(props){
    super(props);
    this.state = {
      switchState: true, 
    }

    this.onGroupNameChange = this.onGroupNameChange.bind(this);
  }

  componentWillMount() {
    const { groupName } = this.props;
    this.setState({
      groupName,
    })
  }

  onGroupNameChange(value) {
    const { onChange } = this.props;
    this.setState({
      groupName: value,
    })
    onChange(value);
  }

  render() {
    const { iconImg, productName } = this.props;
    const { switchState, groupName } = this.state;
    return (
      <div style={styles.container}>
        <div style={styles.iconBox}>
          <img style={styles.deviceIcon} src={iconImg} />
        </div>
        <div style={styles.titleBox}>
          
          <p style={styles.title}>
            <List>
              <InputItem
                placeholder="请输入分组名称"
                value={groupName}
                autoFocus
                onChange={this.onGroupNameChange}
                maxLength={10}
              ></InputItem>
            </List>
          </p>
          <p style={styles.subTitle}>
            {productName}
          </p>          
        </div>
      </div>
    );
  }
}
EditGroupHead.propTypes = {
  
};

export default EditGroupHead;
