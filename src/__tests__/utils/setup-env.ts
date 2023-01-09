import axios from 'axios'

import {Route} from '../../types/routes'
import {createApiRoutes, createApi} from '../../core/typedApi'

interface ApiOptions {
  method: 'GET' | 'POST' | 'DELETE'
  uri?: string
}

type Model = {id: string}
type GetRequest<T extends Model> = Pick<T, 'id'>
type GetResponse<T extends Model> = T
type ListResponse<T extends Model> = T[]
type CreateRequest<T extends Model> = Omit<T, 'id'>
type CreateResponse<T extends Model> = T
type DeleteRequest<T extends Model> = Pick<T, 'id'>

type ModelRoutes<T extends Model> = {
  get: Route<{input: GetRequest<T>; output: GetResponse<T>}>
  list: Route<{output: ListResponse<T>}>
  create: Route<{input: CreateRequest<T>; output: CreateResponse<T>}>
  delete: Route<{input: DeleteRequest<T>}>
}

interface User {
  id: string
  username: string
}

interface Todo {
  id: string
  userId: string
  title: string
  completed: boolean
}

type UsersRoutes = ModelRoutes<User>
type TodosRoutes = ModelRoutes<Todo>

const usersRoutes = createApiRoutes<UsersRoutes, ApiOptions>({
  get: {method: 'GET', uri: '{id}'},
  list: {method: 'GET'},
  create: {method: 'POST'},
  delete: {method: 'DELETE', uri: '{id}'},
})

const todosRoutes = createApiRoutes<TodosRoutes, ApiOptions>({
  get: {method: 'GET', uri: '{id}'},
  list: {method: 'GET'},
  create: {method: 'POST'},
  delete: {method: 'DELETE', uri: '{id}'},
})

export const BASE_URL = 'http://test/'

function requestHandler<TInput, TOutput>(
  path: string[],
  options: ApiOptions,
  data?: TInput,
): Promise<TOutput> {
  const url = `${BASE_URL}${path.splice(0, path.length - 1).join('/')}${
    options.uri ? `/${options.uri}` : ''
  }`
  return axios.request({method: options.method, url, data})
}

type Api = {
  users: UsersRoutes
  todos: TodosRoutes
}

export const api = createApi<Api, ApiOptions>(requestHandler, {
  users: usersRoutes,
  todos: todosRoutes,
})
