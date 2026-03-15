import axios from 'axios'

export const http = axios.create({
  baseURL: 'https://api.crossref.org',
  headers: { 'Content-Type': 'Application/JSON' },
})
