
import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import tinycolor from 'tinycolor2';
import { get } from '../../modules/storage/';
import HeaderButton from '../header-button/header-button';
import Drawer from '../drawer/drawer';
import Navigation from '../navigation/navigation';
import Logo from '../logo/logo';
import styles from './header.sass';

import { theme_color as DEFAULT_COLOR } from '../../../config/manifest';

const getTextColor = (bgColor = DEFAULT_COLOR) => {
    if (tinycolor(bgColor).isLight()) {
        return '#000';
    }
    return '#fff';
};

class Header extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            color: DEFAULT_COLOR,
            drawerOpen: false,
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
    }

    componentDidMount() {
        this.setHeaderColor(this.props.articleId);
    }

    componentWillReceiveProps({ articleId }) {
        this.setHeaderColor(articleId);
    }

    setHeaderColor(articleId) {
        if (articleId) {
            return get(articleId).then(({ color }) =>
                this.setState({ color }));
        }
        return this.setState({ color: DEFAULT_COLOR });
    }

    toggleDrawer(val) {
        const { drawerOpen } = this.state;
        this.setState({
            drawerOpen: typeof val === 'boolean' ?
                val : !drawerOpen,
        });
    }

    render() {
        const { isIndex, isArticle } = this.props;
        const { color, drawerOpen } = this.state;
        const textColor = getTextColor(color);
        const headerClassName = classnames(styles.header, {
            [styles.fixed]: isArticle,
        });
        return (<div>
            <header
                className={headerClassName}
                style={{ backgroundColor: color }}
                id="main-header"
            >
                <div className={styles.inner}>
                    <HeaderButton
                        isIndex={isIndex}
                        color={textColor}
                        toggleDrawer={this.toggleDrawer}
                        drawerOpen={drawerOpen}
                    />
                    <Logo color={textColor} />
                </div>
            </header>
            <Drawer isVisible={drawerOpen} toggleDrawer={this.toggleDrawer}>
                <Navigation toggleDrawer={this.toggleDrawer} />
            </Drawer>
        </div>);
    }
}

Header.propTypes = {
    isIndex: PropTypes.bool.isRequired,
    isArticle: PropTypes.bool.isRequired,
    articleId: PropTypes.string,
};

export default Header;
