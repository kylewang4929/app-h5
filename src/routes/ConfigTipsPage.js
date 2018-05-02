import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';

import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import BackButton from '../containers/MenuButton/BackButton';
import { getItemForPk } from '../utils/configExpand';
import Scroll from '../components/Scroll';

const styles = {
  container: {},
  list: {
    padding: '0 0.2rem',
  },
};
class ConfigTipsPage extends Component {
  componentWillMount() {
    const { params } = this.props;
    this.productItem = getItemForPk(params.productKey);
    this.content = this.productItem[params.type].content;
  }
  render() {
    const { productKey } = this.props.params;
    const { language } = this.props;
    return (
      <div style={styles.container}>
        <NavBar
          title="HELP"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <Scroll bounce>
            <div style={styles.list}>
              {
                this.content.map((item, index) => {
                  return <Item key={index} language={language.key} productKey={productKey} index={index} content={item} />
                })
              }
            </div>
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

const itemStyles = {
  container: {
    backgroundColor: '#fff',
    margin: '0.2rem 0',
    borderRadius: '0.1rem',
    padding: '0.4rem 0.2rem 0.36rem 0.2rem',
    textAlign: 'center',
  },
  step: {
    fontSize: '0.34rem',
    fontWeight: 'bold',
  },
  text: {
    fontSize: '0.3rem',
    margin: '0.1rem',
  },
  tips: {
    fontSize: '0.28rem',
    color: '#909090',
  },
  image: {
    display: 'block',
    width: '100%',
    marginTop: '0.4rem',
  },
};
class Item extends Component {
  render() {
    const { content, index, productKey, language } = this.props;
    // language.key = 'en';
    const text = content[`${language}_text`] || content['text'];
    const tips = content[`${language}_tips`] || content['tips'];

    return (
      <div style={itemStyles.container}>
        <div style={itemStyles.step}>
          <FormattedMessage
            id="STEP_TIPS"
            values={{ step: index + 1 }}
          />
        </div>
        {
          text ? <div style={itemStyles.text}>{text}</div> : null
        }
        {
          tips ? <div style={itemStyles.tips}>{tips}</div> : null
        }
        {
          content.imageName ? <img style={itemStyles.image} src={`./static/${productKey}/${content.imageName}`} /> : null
        }
      </div>
    );
  }
}

ConfigTipsPage.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}


export default connect(mapStateToProps)(ConfigTipsPage);
