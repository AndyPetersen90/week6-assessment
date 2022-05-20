const {shuffleArray} = require('./utils')
const {bots} = require('./data')

describe('shuffleArray should', () => {
    test("ShuffleArray to be a function", () => {
        expect(typeof shuffleArray).toBe('function');
      })

    test('Array response length is 5', () => {
        expect(shuffleArray(bots)).toHaveLength(10)
    })
})
