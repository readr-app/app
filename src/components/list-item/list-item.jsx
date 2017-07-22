/* eslint "camelcase": 0 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import { parse } from 'url';
import mdlList from 'material-design-lite/src/list/_list.scss';
import TimeAgo from '../time-ago/time-ago';
import styles from './list-item.sass';

const stylesItem = classnames(mdlList['mdl-list__item'], styles.item);

const makeStyles = ({ x }) => ({
    transform: `scaleY(${x})`,
    opacity: x,
});

const ListItem = props => {
    const { id, url, title, created_at, deleteArticle, style } = props;
    const domain = parse(url).hostname;
    return (
        <li className={stylesItem} style={makeStyles(style)}>
            <Link className={styles.link} to={`/article/${id}`}>
                {title}
            </Link>
            <div className={styles.meta}>
                Saved <TimeAgo timestamp={created_at} /> ago &middot;&nbsp;
                <em>{domain}</em>
            </div>
            <button
                type="button"
                title="Delete item"
                className={styles.delete}
                onClick={() => deleteArticle(id)}
            >
                &times;
            </button>
        </li>
    );
};

ListItem.propTypes = {
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    created_at: PropTypes.number.isRequired,
    deleteArticle: PropTypes.func.isRequired,
    style: PropTypes.shape({
        x: PropTypes.number.isRequired,
    }).isRequired,
};

export default ListItem;
