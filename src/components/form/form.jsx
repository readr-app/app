
import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import mdlTextfield from 'material-design-lite/src/textfield/_textfield.scss';

const ID_INPUT = 'form-input';

const ENTER_KEY_CODE = 13;

const DEFAULT_STATE = {
    focus: false,
    dirty: false,
};

class Form extends PureComponent {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, DEFAULT_STATE);
        this.focus = this.focus.bind(this);
        this.blur = this.blur.bind(this);
        this.setDirty = this.setDirty.bind(this);
        this.addArticle = this.addArticle.bind(this);
    }

    setDirty({ target }) {
        const value = target.value.trim();
        if (value) {
            return this.setState({
                dirty: true,
            });
        }
        return this.setState({
            dirty: false,
        });
    }

    blur() {
        this.setState({ focus: false });
    }

    focus() {
        this.setState({ focus: true });
    }

    addArticle({ keyCode, target }) {
        /* eslint "no-param-reassign": 0 */
        if (keyCode !== ENTER_KEY_CODE) {
            return;
        }
        const articleUrl = target.value.trim();
        target.blur();
        target.value = '';
        this.setState(Object.assign({}, DEFAULT_STATE));
        this.props.startDownload(articleUrl);
    }

    render() {
        const stylesForm = classnames(mdlTextfield['mdl-textfield'],
            mdlTextfield['mdl-textfield--full-width'],
            mdlTextfield['mdl-textfield--floating-label'], {
                [mdlTextfield['is-focused']]: this.state.focus,
                [mdlTextfield['is-dirty']]: this.state.dirty,
            });
        const stylesInput = mdlTextfield['mdl-textfield__input'];
        const stylesLabel = mdlTextfield['mdl-textfield__label'];
        return (<div className={stylesForm}>
            <input
                className={stylesInput}
                type="url"
                onFocus={this.focus}
                onBlur={this.blur}
                onChange={this.setDirty}
                onKeyUp={this.addArticle}
                id={ID_INPUT}
            />
            <label className={stylesLabel} htmlFor="sample3">
                Insert URL &amp; hit Enter
            </label>
        </div>);
    }

}

Form.propTypes = {
    startDownload: PropTypes.func.isRequired,
};

export default Form;
