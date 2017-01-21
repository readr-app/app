
/* eslint "camelcase": 0 */

import React, { PureComponent, PropTypes } from 'react';
import { trackEvent } from '../../modules/tracking/';
import { get } from '../../modules/storage/';
import ThemeColor from '../../components/theme-color/theme-color';
import FallbackText from '../../components/fallback-text/fallback-text';
import TimeAgo from '../../components/time-ago/time-ago';
import styles from './detail.sass';

class Detail extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            article: null,
        };
    }

    componentWillMount() {
        get(this.props.params.id).then(article =>
            this.setState({ article }));
    }

    render() {
        /* eslint "react/no-danger": 0 */
        if (this.state.article === null) {
            return (<FallbackText
                className={styles.loading}
                text="Loading &hellip;"
            />);
        }

        const { id } = this.props.params;
        const { url, title, intro, content, color, created_at } = this.state.article;

        trackEvent('View article', { id, url, title, created_at });

        return (<ThemeColor color={color}>
            <article className={styles.article}>
                <h1>{title}</h1>
                <div className={styles.time}>
                    Saved <TimeAgo timestamp={created_at} /> ago
                </div>
                <p>
                    <em>{intro}</em>
                </p>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </article>
        </ThemeColor>);
    }

}

Detail.propTypes = {
    params: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
};

export default Detail;
