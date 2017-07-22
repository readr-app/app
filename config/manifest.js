const icon = size => ({
    src: `/readr_android-chrome-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png',
});

exports.name = 'Readr';

exports.short_name = 'Readr';

exports.start_url = '/?homescreen=1';

exports.lang = 'de-DE';

exports.dir = 'auto';

exports.orientation = 'portrait';

exports.display = 'standalone';

exports.background_color = '#fff';

exports.theme_color = '#3f51b5';

exports.description = "Save articles now, read them later when you're offline.";

exports.related_applications = [
    {
        platform: 'web',
    },
];

exports.icons = [
    icon(36),
    icon(48),
    icon(72),
    icon(96),
    icon(144),
    icon(192),
    icon(256),
    icon(384),
    icon(512),
];
