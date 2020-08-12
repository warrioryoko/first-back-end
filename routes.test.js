const request = require('supertest');
const { app } = require('./routes.js');

test('/location should return the correct response', (done) => {
    request(app)
        .get('/location')
        .expect(200)
        .expect((response) => {
            expect(response.body).toEqual({
                'formatted_query': 'Portland, Multnomah County, Oregon, USA',
                'latitude': '45.5202471',
                'longitude': '-122.6741949',
            });

            done();
        })
        .end(function(err, res) {
            if (err) throw err;
        });
});