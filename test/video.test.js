const request = require('supertest');
const app = require('../app');

describe('GET /video', () => {
  test('responds with 206 status code and correct headers when requesting partial content', (done) => {
    const fileSize = 20092628;
    const start = 100;
    const end = 10000;

    request(app)
      .get('/video')
      .set('Range', `bytes=${start}-${end}`)
      .expect('Content-Type', 'video/mp4')
      .expect('Content-Length', `${end - start + 1}`)
      .expect('Content-Range', `bytes ${start}-${end}/${fileSize}`)
      .expect('Accept-Ranges', 'bytes')
      .expect(206, done);
  });

  test('responds with 200 status code and correct headers when requesting full content', (done) => {
    const fileSize = 20092628;

    request(app)
      .get('/video')
      .expect('Content-Type', 'video/mp4')
      .expect('Content-Length', `${fileSize}`)
      .expect('Accept-Ranges', 'bytes')
      .expect(200, done);
  });

  test('responds with 500 status code and error message when file cannot be read', (done) => {
    jest.spyOn(require('fs'), 'statSync').mockImplementationOnce(() => {
      throw new Error('file not found');
    });

    request(app)
      .get('/video')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(res => {
        const contentLength = res.headers['content-length'];
        if (contentLength !== '21') {
          throw new Error(`Expected content length to be 21, but got ${contentLength}`);
        }
      })
      .expect('Internal server error')
      .expect(500, done);
  });

});
