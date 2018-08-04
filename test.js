const Queue = require('./index')

const wait = () => {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (Math.random() > 0.5) return resolve('Success!!!')
      return reject('Error!!!')
    }, 1000)
  )
}

// test queue
const test = async id => {
  try {
    const queueResult = await Queue(id, async () => {
      try {
        const waitResult = await wait()
        return Promise.resolve(waitResult)
      } catch (e) {
        return Promise.reject(e)
      }
    })
    console.log(id, queueResult)
  } catch (e) {
    console.log(id, e)
  }
}

// Start
test('1')
test('1')
test('1')

test('2')
test('2')
test('2')

// for (var i = 0; i < 100; i++)
// 	for (var j = 0; j < 100; j++)
//     test('Test ID ' + i)
