import { Selector } from 'testcafe';

const port = process.env.PORT || 8090;

fixture('About')
    .page(`http://localhost:${port}/about`);

test('It is present', async (t) => {
    const headline = Selector('h1');
    await headline.with({ visibilityCheck: true })();
    await t
        .expect(headline.textContent)
        .eql('About Readr', 'The headline is correct');
});
