const EventEmitter = require('events')

let queues = []

const Queue = (id, job) => {
  let Q = queues.find(item => (item || {}).id === id)
  if (!Q) {
    Q = { id, queue: [], ids: 0, working: false }
    queues.push(Q)
  }
  const task = { done: false, job, id: ++Q.ids, evt: new EventEmitter() }
  Q.queue.push(task)
  start(Q)
  return wait(Q, task)
}

const start = Q => {
  if (!Q || Q.working) return false
  Q.working = true
  work(Q)
  return true
}

// Job
const work = async Q => {
  const id = Q.id
  for (let i = 0; i < Q.ids; i++) {
    const task = next(Q.queue)
    try {
      task.result = await task.job()
    } catch (e) {
      task.error = e
    } finally {
      task.done = true
      task.evt.emit('done', task)
    }
  }

  try {
    Q.queue = []
    Q.working = false
    queues = queues.filter(queue => id !== queue.id)
  } catch (e) {
    console.log(e)
  }
  return true
}

// Promise Fires when task is done
const wait = (Q, task) =>
  new Promise((resolve, reject) => {
    task.evt.once('done', task => {
      if (task.error) {
        reject(task.error)
      } else {
        resolve(task.result)
      }
    })
    task = null
  })

// Next task
const next = (array = []) => {
  return array.find(item => !item.done)
}

module.exports = Queue
