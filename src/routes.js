import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { search } = request.query

      const users = database.select('tasks', search ? {
        name: search,
        email: search
      } : null)

      return response.setHeader('Content-type', 'application/json').writeHead(200).end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body

    if (!title || !description) {
      return response.writeHead(400).end(JSON.stringify({
        'error': 'Verify if title and description is within the request'
      }))
    }

    const task = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date(),
      updated_at: null
    }

    database.insert('tasks', task)

    return response.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params

      const result = database.delete('tasks', id)

      if (result === true) {
        return response.writeHead(204).end()
      }

      return response.writeHead(400).end(JSON.stringify(result))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params

      const result = database.update('tasks', id, {
        completed_at: new Date(),
        updated_at: new Date()
      })

      if (result === true) {
        return response.writeHead(204).end()
      }

      return response.writeHead(400).end(JSON.stringify(result))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const { title = null, description = null } = request.body || {} 

      if (!title && !description) {
        return response.writeHead(400).end(JSON.stringify({
          'error': 'Verify if title or description is within the request'
        }))
      }

      const  dataToProcess = {}

      if (title !== null) {
        dataToProcess.title = title
      }

      if (description !== null) {
        dataToProcess.description = description
      }

      const result = database.update('tasks', id, {
        ...dataToProcess,
        updated_at: new Date()
      })

      if (result === true) {
        return response.writeHead(204).end()
      }

      return response.writeHead(400).end(JSON.stringify(result))
    }
  }
]