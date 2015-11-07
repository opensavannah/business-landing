var controller = require('../../api/controllers/scoring-controller.js');

describe('Scoring Controller', function() {
    it('should give an error if no zip code is provided', function() {
        var mockRequest = {
            query: {}
        };

        var mockResponse = {
            send: function(data) {
                var jsonObj = JSON.parse(data);
                expect(jsonObj.hasOwnProperty('success')).toBe(true);
                expect(jsonObj.success).toBe(false);
            }
        };

        controller(mockRequest, mockResponse);
    });

    it('should give a perfect score of 1 with no paramters', function() {
        var mockRequest = {
            query: {
                zip: 23510
            }
        };

        var mockResponse = {
            send: function(data) {
                var jsonObj = JSON.parse(data);
                expect(jsonObj.hasOwnProperty('score')).toBe(true);
                expect(jsonObj.score).toBe(1);
            }
        };

        controller(mockRequest, mockResponse);
    })
})
