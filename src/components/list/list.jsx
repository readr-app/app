
import React, { PureComponent, PropTypes } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import mdlList from 'material-design-lite/src/list/_list.scss';
import ListItem from '../../components/list-item/list-item';

const sort = list => list.sort((a, b) => {
    if (a.created_at === b.created_at) {
        return 0;
    }
    return a.created_at > b.created_at ? -1 : 1;
});

class List extends PureComponent {
    constructor(props) {
        super(props);
        this.shouldAnimate = false;
        this.animationSetting = {
            stiffness: 400,
            damping: 40,
        };
        this.getXValue = this.getXValue.bind(this);
        this.willLeave = this.willLeave.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.shouldAnimate = this.props.articles.length !== nextProps.articles.length;
    }

    getXValue(value) {
        return this.shouldAnimate ?
            spring(value, this.animationSetting) : value;
    }

    willLeave() {
        return {
            x: this.getXValue(0),
        };
    }

    willEnter() {
        /* eslint "class-methods-use-this": 0 */
        return { x: 0 };
    }

    toStyles(style) {
        /* eslint "class-methods-use-this": 0 */
        return article => ({
            key: article.id,
            data: article,
            style,
        });
    }

    render() {
        const { articles, deleteArticle } = this.props;
        return (<TransitionMotion
            willLeave={this.willLeave}
            willEnter={this.willEnter}
            defaultStyles={sort(articles).map(this.toStyles(this.willEnter()))}
            styles={sort(articles).map(this.toStyles({ x: this.getXValue(1) }))}
        >
            {interpolatedStyles => (
                <ul className={mdlList['mdl-list']} id="article-list">
                    {interpolatedStyles.map(({ key, data, style }) => (
                        <ListItem
                            key={key}
                            id={data.id}
                            url={data.url}
                            title={data.title}
                            created_at={data.created_at}
                            deleteArticle={deleteArticle}
                            style={style}
                        />
                    ))}
                </ul>
            )}
        </TransitionMotion>);
    }
}

List.propTypes = {
    articles: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        created_at: PropTypes.number.isRequired,
    })).isRequired,
    deleteArticle: PropTypes.func.isRequired,
};

export default List;
