// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getConfig} from '@mm-redux/selectors/entities/general';
import {signup} from '@actions/views/user';
import {isLandscape} from '@selectors/device';

import Signup from './signup';

function mapStateToProps(state) {
    const config = getConfig(state);
    return {
        config,
        isLandscape: isLandscape(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            signup,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
