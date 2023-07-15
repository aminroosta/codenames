import { expect, test, describe } from "bun:test";
import request from 'supertest';
import { getApp } from "../app";
import supertest from "supertest";

const config = { dbFile: ":memory:" };

describe('user route', () => {
  const app = getApp(config);

  test('get returns null', done =>
    request(app)
      .get('/api/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual(null);
        done();
      })
  );

  test('post creates a user', done => {
    request(app)
      .post('/api/user')
      .send({ nickname: 'Jon' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body.nickname).toBe('Jon');
        expect(res.body.user_id).not.toBe(null);
        done();
      });
  });
});

