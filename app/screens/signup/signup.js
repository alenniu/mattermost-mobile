// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {intlShape} from 'react-intl';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Button from 'react-native-button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import {GlobalStyles} from 'app/styles';
import ErrorText from '@components/error_text';
import StatusBar from '@components/status_bar';
import FormattedText from '@components/formatted_text';
import {paddingHorizontal as padding} from '@components/safe_area_view/iphone_x_spacing';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity} from '@utils/theme';
import {popTopScreen} from '@actions/navigation';

export default class Signup extends PureComponent {
    static propTypes = {
        config: PropTypes.object.isRequired,
        isLandscape: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            signup: PropTypes.func.isRequired,
        }).isRequired,
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    constructor(props) {
        super(props);

        this.emailRef = React.createRef();
        this.usernameRef = React.createRef();
        this.passwordRef = React.createRef();
        this.scrollRef = React.createRef();

        this.email = '';
        this.username = '';
        this.password = '';

        this.state = {
            error: null,
            isLoading: false,
        };
    }

    componentDidMount() {
        Dimensions.addEventListener('change', this.orientationDidChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.orientationDidChange);
    }

    orientationDidChange = () => {
        if (this.scroll.current) {
            this.scroll.current.scrollTo({x: 0, y: 0, animated: true});
        }
    };

    clear = () => {
        this.setState({isLoading: false, error: null});
        this.email = '';
        this.username = '';
        this.password = '';
        if (this.emailRef.current) {
            this.emailRef.current.clear();
        }

        if (this.usernameRef.current) {
            this.usernameRef.current.clear();
        }

        if (this.passwordRef.current) {
            this.passwordRef.current.clear();
        }
    }
    blur = () => {
        if (this.emailRef.current) {
            this.emailRef.current.blur();
        }

        if (this.usernameRef.current) {
            this.usernameRef.current.blur();
        }

        if (this.passwordRef.current) {
            this.passwordRef.current.blur();
        }

        Keyboard.dismiss();
    };

    handleEmailChange = (text) => {
        this.email = text;
    };

    handleUsernameChange = (text) => {
        this.username = text;
    };

    handlePasswordChange = (text) => {
        this.password = text;
    };

    usernameFocus = () => {
        if (this.usernameRef.current) {
            this.usernameRef.current.focus();
        }
    };

    passwordFocus = () => {
        if (this.passwordRef.current) {
            this.passwordRef.current.focus();
        }
    };

    handleSignup = preventDoubleTap(async () => {
        const {
            actions: {
                signup,
            },
        } = this.props;

        this.setState({error: null, isLoading: true});
        Keyboard.dismiss();
        try {
            const result = await signup(
                this.email.toLowerCase(),
                this.username.toLowerCase(),
                this.password,
            );

            if (result.error) {
                this.setState({isLoading: false, error: result.error});
                return;
            }

            this.clear();
            popTopScreen();
        } catch {
            this.setState({isLoading: false, error: 'An unexpected error occurred, please check your internet connection'});
        }
    });

    render() {
        const {formatMessage} = this.context.intl;
        const {isLoading} = this.state;

        let buttonArea;
        if (isLoading) {
            buttonArea = (
                <ActivityIndicator
                    animating={true}
                    size='small'
                />
            );
        } else {
            const additionalStyle = {};
            if (this.props.config.EmailLoginButtonColor) {
                additionalStyle.backgroundColor = this.props.config.EmailLoginButtonColor;
            }
            if (this.props.config.EmailLoginButtonBorderColor) {
                additionalStyle.borderColor = this.props.config.EmailLoginButtonBorderColor;
            }

            const additionalTextStyle = {};
            if (this.props.config.EmailLoginButtonTextColor) {
                additionalTextStyle.color = this.props.config.EmailLoginButtonTextColor;
            }

            buttonArea = (
                <Button
                    onPress={this.handleSignup}
                    containerStyle={[GlobalStyles.signupButton, additionalStyle]}
                >
                    <FormattedText
                        id='login.signUp'
                        defaultMessage='Sign Up'
                        style={[GlobalStyles.signupButtonText, additionalTextStyle]}
                    />
                </Button>
            );
        }
        return (
            <View style={style.container}>
                <StatusBar/>
                <TouchableWithoutFeedback
                    onPress={this.blur}
                    accessible={false}
                >
                    <KeyboardAwareScrollView
                        ref={this.scrollRef}
                        style={style.container}
                        contentContainerStyle={[style.innerContainer, padding(this.props.isLandscape)]}
                        keyboardShouldPersistTaps='handled'
                        enableOnAndroid={true}
                    >
                        <Image
                            source={require('@assets/images/logo.png')}
                        />
                        <View>
                            <Text style={GlobalStyles.header}>
                                {this.props.config.SiteName}
                            </Text>
                            <FormattedText
                                style={GlobalStyles.subheader}
                                id='web.root.signup_info'
                                defaultMessage='All team communication in one place, searchable and accessible anywhere'
                            />
                        </View>
                        <ErrorText error={this.state.error}/>

                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            blurOnSubmit={false}
                            disableFullscreenUI={true}
                            keyboardType='email-address'
                            onChangeText={this.handleEmailChange}
                            onSubmitEditing={this.usernameFocus}
                            placeholder={formatMessage({id: 'login.email', defaultMessage: 'Email'})}
                            placeholderTextColor={changeOpacity('#000', 0.5)}
                            ref={this.emailRef}
                            returnKeyType='next'
                            style={GlobalStyles.inputBox}
                            underlineColorAndroid='transparent'
                        />
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            blurOnSubmit={false}
                            disableFullscreenUI={true}
                            keyboardType='default'
                            onChangeText={this.handleUsernameChange}
                            onSubmitEditing={this.passwordFocus}
                            placeholder={formatMessage({id: 'login.username', defaultMessage: 'Username'})}
                            placeholderTextColor={changeOpacity('#000', 0.5)}
                            ref={this.usernameRef}
                            returnKeyType='next'
                            style={GlobalStyles.inputBox}
                            underlineColorAndroid='transparent'
                        />
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            disableFullscreenUI={true}
                            onChangeText={this.handlePasswordChange}
                            onSubmitEditing={this.handleSignup}
                            style={GlobalStyles.inputBox}
                            placeholder={formatMessage({id: 'login.password', defaultMessage: 'Password'})}
                            placeholderTextColor={changeOpacity('#000', 0.5)}
                            ref={this.passwordRef}
                            returnKeyType='go'
                            secureTextEntry={true}
                            underlineColorAndroid='transparent'
                        />

                        {buttonArea}
                    </KeyboardAwareScrollView>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 50,
    },
});
