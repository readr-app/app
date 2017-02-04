
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import mdlLayout from 'material-design-lite/src/layout/_layout.scss';
import Header from '../../components/header/header';
import styles from './main.sass';

const layoutClassname = classnames(mdlLayout['mdl-layout'], styles.main);

const Main = ({ location, params, children }) => {
    const { pathname } = location;
    return (<div className={layoutClassname}>
        <Header
            isIndex={pathname === '/'}
            isArticle={pathname.includes('/article/')}
            articleId={params.id}
        />
        {children}
    </div>);
};

Main.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    params: PropTypes.shape({
        id: PropTypes.string,
    }),
    children: PropTypes.element.isRequired,
};

export default Main;
