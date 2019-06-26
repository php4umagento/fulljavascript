const axios = require('axios');

const s = require('./send-artifacts');
const mockedEvent = require('../fixtures/stripe-payment_intent.succeeded.json');
const mockedUrls = require('../fixtures/circleci-builds.json');
const mockedArtifacts = require('../fixtures/circleci-artifacts.json');

jest.mock('axios');

describe('Send Artifacts', () => {
  describe('#getEmail', () => {
    it('should get email', () => {
      expect(s.getEmail(mockedEvent)).toBe('john.doe+dsajs@fulljavascript.com');
    });

    xit('should handle other payment intent', () => {

    });
  });

  describe('#getArtifactsUrls', () => {
    it('should get all formats', async () => {
      axios.get
        .mockResolvedValue({ data: mockedUrls }) // default
        .mockResolvedValueOnce({ data: mockedUrls }) // first call
        .mockResolvedValueOnce({ data: mockedArtifacts }); // 2nd call

      const re = /dsajs.*-v.*\.(epub|mobi|pdf)/i;
      expect(await s.getArtifactsUrls(re)).toEqual(expect.arrayContaining([
        'https://circle-artifacts.com/0/book/dsajs-algorithms-javascript-book-v1.3.0.epub',
        'https://circle-artifacts.com/0/book/dsajs-algorithms-javascript-book-v1.3.0.mobi',
        'https://circle-artifacts.com/0/book/dsajs-algorithms-javascript-book-v1.3.0.pdf',
      ]));
    });
  });

  describe('#downloadFiles', () => {
    it('should download files with name, size, content', () => {
      expect(s.downloadFiles([file])).toEqual()
    });
  });
});

