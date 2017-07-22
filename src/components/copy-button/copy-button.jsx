import React, { PureComponent, PropTypes } from 'react';
import Clipboard, { isSupported } from 'clipboard';
import classnames from 'classnames';
import mdlTooltip from 'material-design-lite/src/tooltip/_tooltip.scss';
import { trackEvent } from '../../modules/tracking/';
import styles from './copy-button.sass';

class CopyButton extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            feedback: false,
        };
        this.showFeedback = this.showFeedback.bind(this);
    }

    componentDidMount() {
        this.clipboard = new Clipboard(this.btn);
        this.clipboard.on('success', this.showFeedback);
        this.tooltip = this.insertTooltip();
    }

    componentWillUnmount() {
        this.clipboard.destroy();
        this.tooltip.parentNode.removeChild(this.tooltip);
    }

    getTooltipOffset(visible) {
        if (!visible) {
            return { left: null, top: null };
        }
        const btnRect = this.btn.getBoundingClientRect();
        const left = btnRect.left + btnRect.width / 2 - this.tooltip.offsetWidth / 2;
        const top = btnRect.top - this.tooltip.offsetHeight - 10;
        return {
            left: `${left}px`,
            top: `${top}px`,
        };
    }

    setFeedback(visible) {
        this.tooltip.classList.toggle(mdlTooltip['is-active'], visible);
        Object.assign(this.tooltip.style, this.getTooltipOffset(visible));
        return {
            feedback: Boolean(visible),
        };
    }

    insertTooltip() {
        const elem = document.createElement('span');
        elem.textContent = 'Copied!';
        elem.className = classnames(styles.tooltip, mdlTooltip['mdl-tooltip']);
        requestAnimationFrame(() => this.btn.parentNode.insertBefore(elem, this.btn));
        return elem;
    }

    showFeedback() {
        trackEvent('Copy data', this.props.data);
        this.setState(this.setFeedback(true));
        setTimeout(() => this.setState(this.setFeedback(false)), 1000);
    }

    render() {
        const { data, caption, className = '' } = this.props;
        const { feedback } = this.state;
        return (
            <button
                className={classnames(className, {
                    [styles.button]: feedback,
                })}
                data-clipboard-text={data}
                ref={btn => (this.btn = btn)}
                type="button"
            >
                {caption}
            </button>
        );
    }
}

CopyButton.propTypes = {
    data: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export const hasClipboardSupport = () => isSupported();

export default CopyButton;
