import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';

const styles = {
  container: {
    overflow: 'hidden',
  },
};

class ButtonGroup extends Component {
  render() {
    const { tintColor, datas, onClick } = this.props;
    return (
      <div style={styles.container}>
        {
          datas.map((item, index) => {
            return (
              <Button
                tintColor={tintColor}
                onClick={onClick.bind(null, item)}
                key={`button${index}`} isFirst={index === 0}
                isLast={index + 1 === datas.length} {...item}
              />
            );
          })
        }
      </div>
    );
  }
}
ButtonGroup.propTypes = {
  tintColor: PropTypes.string,
  datas: PropTypes.array,
  onClick: PropTypes.func,
};

const buttonStyles = {
  container: {
    float: 'left',
    width: '14.28%',
    textAlign: 'center',
    borderLeft: '1px solid rgba(0,0,0,0.06)',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    borderRight: 'none',
    padding: '0.14rem 0',
    fontSize: '0.26rem',
    color: 'rgb(121, 121, 121)',
    boxSizing: 'border-box',
  },
  active: {
    backgroundColor: '#00a2ff',
    color: '#fff',
    borderLeft: '1px solid #00a2ff',
    borderTop: '1px solid #00a2ff',
    borderBottom: '1px solid #00a2ff',
    borderRight: '1px solid rgba(0,0,0,0.06)',
  },
  firstButton: {
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
  },
  lastButton: {
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    borderRight: '1px solid rgba(0,0,0,0.06)',
  },
  activeStyle: {
    borderLeft: '1px solid rgba(0,0,0,0.06)',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    borderRight: '1px solid rgba(0,0,0,0.06)',
  },
};

class Button extends Component {
  render() {
    const { active, text, isLast, isFirst, tintColor, onClick } = this.props;
    const activeStyle = {
      backgroundColor: tintColor,
      color: '#fff',
    };
    return (
      <div
        onClick={onClick}
        style={Object.assign({},
          buttonStyles.container,
          buttonStyles.activeStyle,
          active ? activeStyle : {},
          isFirst ? buttonStyles.firstButton : {},
          isLast ? buttonStyles.lastButton : {},
        )
        }
      >
        <FormattedMessage id={text} />
      </div>
    );
  }
}

Button.propTypes = {
  tintColor: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  text: PropTypes.string,
  isLast: PropTypes.bool,
  isFirst: PropTypes.bool,
};

export default ButtonGroup;
