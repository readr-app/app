
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import mdlLayout from 'material-design-lite/src/layout/_layout.scss';
import connectMain from '../../store/containers/main';
import Header from '../../components/header/header';
import styles from './main.sass';

const layoutClassname = classnames(mdlLayout['mdl-layout'], styles.main);

const Main = ({ pathname, id, children }) => (
    <div className={layoutClassname}>
        <Header
            isIndex={pathname === '/'}
            isArticle={pathname.includes('/article/')}
            articleId={id}
        />
        {children}
    </div>
);

Main.propTypes = {
    pathname: PropTypes.string.isRequired,
    id: PropTypes.string,
    children: PropTypes.element.isRequired,
};

export default connectMain(Main);
