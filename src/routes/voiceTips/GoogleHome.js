import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';
import BackButton from '../../containers/MenuButton/BackButton';
import GoogleHomeContent from '../../containers/GoogleHomeContent';
import Scroll from '../../components/Scroll';

import config from '../../config/template';

const tipsData = config.voiceTips.googleHome;

class GoogleHome extends Component {

  goEcho() {
    router.go('#/menu/echo');
  }

  render() {
    return (
      <div>
        <NavBar
          title="GOOGLE_HOME"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <Scroll bounce>
            <GoogleHomeContent data={tipsData.data} />
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

GoogleHome.propTypes = {
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(GoogleHome);
