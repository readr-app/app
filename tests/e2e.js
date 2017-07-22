import { Selector, ClientFunction } from 'testcafe';
import delay from 'delay';

fixture('Home')
    .page(`http://localhost:${process.env.PORT || 8090}`);

const input = Selector('#form-input');
const loader = Selector('#progress-loading');
const error = Selector('#progress-error');
const success = Selector('#progress-success');
const mainHeader = Selector('#main-header');
const hamburger = Selector('#hamburger');
const drawer = Selector('#drawer');
const headlineAbout = Selector('#about-readr');

const sourceOne = {
    url: 'http://www.volksstimme.de/lokal/schoenebeck/kreis-gegen-ameos-erster-streit-nun-beigelegt',
    color: 'rgb(63, 81, 181)',
    title: 'Erster Streit nun beigelegt',
};
const sourceTwo = {
    url: 'http://www.spiegel.de/politik/ausland/john-lewis-buergerrechtler-bezeichnet-trump-als-illegitimen-praesidenten-a-1130038.html',
    color: 'rgb(153, 0, 0)',
    title: 'John Lewis: Bürgerrechtler bezeichnet Trump als illegitimen Präsidenten',
};

const scrollToBottom = ClientFunction(() =>
    scrollTo(0, document.getElementById('readr').offsetHeight - window.innerHeight));

const addArticle = async (t, { url, title }) => {
    await t
        .typeText(input, url)
        .pressKey('enter');

    await loader.with({ visibilityCheck: true })();
    await success.with({ visibilityCheck: true })();
    await delay(500);

    const listItem = Selector('#article-list li').nth(0);

    await t
        .expect(listItem.exists)
        .ok()
        .expect(listItem.textContent)
        .contains(title);
};

test('No articles', async (t) => {
    const text = 'No articles saved yet.';
    const elem = Selector('#index-fallback-text');

    await t.expect(elem.textContent).eql(text);
});

test('Unsuccessfully add article', async (t) => {
    const url = 'http://foobarrrrrrrrrrr.de';

    await t
        .typeText(input, url)
        .pressKey('enter');

    await loader.with({ visibilityCheck: true })();
    await error.with({ visibilityCheck: true })();
});

test('Successfully add article', async t =>
    addArticle(t, sourceOne));

test('Successfully add another article', async t =>
    addArticle(t, sourceTwo));

test('About page', async (t) => {
    await t.click(hamburger());
    await drawer.with({ visibilityCheck: true })();
    await t.click(drawer.find('a[href^="/about"]'));
    await headlineAbout.with({ visibilityCheck: true })();
    await t.expect(headlineAbout.textContent).eql('About Readr');
});

test('Detail page', async (t) => {
    const articleTwo = Selector('article').nth(0);
    const articleOne = Selector('article').nth(1);

    await t
        .click(Selector('main ul a')())
        .expect(articleTwo.find('h1').textContent)
        .eql(sourceTwo.title)
        .expect(mainHeader().getStyleProperty('background-color'))
        .eql(sourceTwo.color);

    await scrollToBottom();
    await articleOne.with({ visibilityCheck: true })();
    await scrollToBottom();
    await t
        .expect(articleOne.find('h1').textContent)
        .eql(sourceOne.title)
        .expect(mainHeader().getStyleProperty('background-color'))
        .eql(sourceOne.color);
});

test('Delete article', async (t) => {
    await t.click(Selector('#article-list li button').nth(0));
    await delay(1200);

    const listItemCount = await t.eval(() =>
        document.querySelectorAll('#article-list li').length);

    await t.expect(listItemCount).eql(1);
});
