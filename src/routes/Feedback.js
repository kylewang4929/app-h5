import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { List, InputItem, Button, TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import { FormattedMessage } from 'react-intl';
import BackButton from '../containers/MenuButton/BackButton';
import Radio from '../components/Radio';
import InfoAlert from '../components/InfoAlert';
import { getLanguageString } from '../utils/getLanguage';
import router from '../utils/router';
import { userFeedback } from '../services/gizwitsSdk';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';

const styles = {
  container: {},
  buttonBox: {
    margin: '0.1rem 0.5rem 0.4rem 0.5rem',
  },
  list: {
    marginTop: '0.2rem',
  },
  button: {
    height: '1rem',
    borderRadius: '0.1rem',
    lineHeight: '1rem',
  },
  radioBox: {
    padding: '0.1rem 0.2rem 0.2rem 0.16rem',
  },
};
class FeedBackPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: true,
    };
  }

  handleSubmit() {
    const { dispatch, language } = this.props;
    const { getFieldValue } = this.props.form;
    const { selected } = this.state;
    const contact = getFieldValue('contact');
    const content = getFieldValue('content');
    userFeedback({
      contactInfo: contact || '',
      feedbackInfo: content || '',
      sendLog: selected,
    });
    router.goBack(-1);
    const THANK_YOU_FEEDBACK = getLanguageString(language.key, 'THANK_YOU_FEEDBACK');
    InfoAlert.show(THANK_YOU_FEEDBACK, 'success', 3000);
  }

  onSelectChange = (value) => {
    this.setState({
      selected: value,
    });
  }

  render() {
    const { getFieldProps, getFieldValue } = this.props.form;
    const { language } = this.props;
    const ENTER_CONTACT = getLanguageString(language.key, 'ENTER_CONTACT');
    const SAY_SOMETHING = getLanguageString(language.key, 'SAY_SOMETHING');

    const { selected } = this.state;

    return (
      <div>
        <NavBar
          title="FEED_BACK"
          leftButton={<BackButton />}
        />
        <MenuPage style={styles.container}>
          <List style={styles.list} className="my-form">
            <InputItem
              {...getFieldProps('contact')}
              clear
              placeholder={ENTER_CONTACT}
              autoFocus
            ><span className="mdi mdi-phone" /></InputItem>
            <TextareaItem
              {...getFieldProps('content')}
              title={<span className="mdi mdi-content-paste" />}
              rows={3}
              placeholder={SAY_SOMETHING}
              count={200}
            />
          </List>

          <div style={styles.radioBox}>
            <Radio
              tips={<FormattedMessage id="SEND_THE_PROBLEM_LOG" />}
              value={selected}
              onChange={this.onSelectChange}
            />
          </div>

          <div style={styles.buttonBox}>
            <Button
              style={styles.button}
              className="btn"
              type="primary"
              onClick={this.handleSubmit.bind(this)}
            >
              <FormattedMessage id="SUBMIT" />
            </Button>
          </div>
        </MenuPage>
      </div>
    );
  }
}

FeedBackPage.propTypes = {};

FeedBackPage.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}

const FeedBackPageForm = createForm()(FeedBackPage);
export default connect(mapStateToProps)(FeedBackPageForm);
