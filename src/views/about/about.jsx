
/* eslint "react/no-danger": 0, "camelcase": 0 */

import React from 'react';
import { theme_color } from '../../../config/manifest';
import ThemeColor from '../../components/theme-color/theme-color';
import styles from './about.sass';
import content from './about.md';

const About = () => (
    <ThemeColor color={theme_color}>
        <main
            className={styles.main}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    </ThemeColor>
);

export default About;
