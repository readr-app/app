import { Selector } from 'testcafe';

fixture('Home')
    .page(`http://localhost:${process.env.PORT || 8090}`);

const loader = Selector('#progress-loading');
const error = Selector('#progress-error');
const success = Selector('#progress-success');
const listItem = Selector('#article-list li');

test('No articles', async (t) => {
    const text = 'No articles saved yet.';
    const elem = Selector('#index-fallback-text');

    await t.expect(elem.textContent).eql(text, 'the info is correct');
});

test('Unsuccessfully add article', async (t) => {
    const url = 'http://foobarrrrrrrrrrr.de';

    await t
        .typeText('#form-input', url)
        .pressKey('enter');

    await loader.with({ visibilityCheck: true })();
    await error.with({ visibilityCheck: true })();
});

test('Successfully add article', async (t) => {
    const url = 'http://www.volksstimme.de/lokal/schoenebeck/kreis-gegen-ameos-erster-streit-nun-beigelegt';

    await t
        .typeText('#form-input', url)
        .pressKey('enter');

    await loader.with({ visibilityCheck: true })();
    await success.with({ visibilityCheck: true })();
    await t
        .expect(listItem.exists)
        .ok()
        .expect(listItem.textContent).contains('Erster Streit nun beigelegt');
});
