import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';
import BackButton from '../../containers/MenuButton/BackButton';
import EchoContent from '../../containers/EchoContent';
import Scroll from '../../components/Scroll';

import config from '../../config/template';

const tipsData = config.voiceTips.echo;

class Echo extends Component {
  render() {
    return (
      <div>
        <NavBar
          title="AMAZON_ECHO"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <Scroll bounce>
            <EchoContent data={tipsData.data} />
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

Echo.propTypes = {
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Echo);
