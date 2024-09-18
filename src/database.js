import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile('db.json', JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }
    return data
  }

  delete(table, id) {
    try {
      const rowIndex = this.#database[table].findIndex(row => row.id === id)

      if (rowIndex > -1){
        this.#database[table].splice(rowIndex, 1)
        this.#persist()
        return true
      }

      throw new Error('id not found')
    } catch(e) {
      return {
        error: e.message
      }
    }
  }

  update(table, id, data) {
    try {
      const rowIndex = this.#database[table].findIndex(row => row.id === id)

      if (rowIndex > -1) {
        this.#database[table][rowIndex] = { id, ...this.#database[table][rowIndex], ...data }
        this.#persist()
        return true
      }

      throw new Error('id not found')
    } catch(e) {
      return {
        error: e.message
      }
    }
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
  }
}