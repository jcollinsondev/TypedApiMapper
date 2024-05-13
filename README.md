<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [TypedApiMapper](#typedapimapper)
  - [Installation](#installation)
    - [npm](#npm)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

[![npm version](https://badge.fury.io/js/typed-api-mapper.svg)](https://badge.fury.io/js/typed-api-mapper)

# TypedApiMapper

Type safe and organized client to map your API.

## Installation

### npm

```sh
npm install typed-api-mapper
```

### yarn

```sh
yarn add typed-api-mapper
```

## Usage

TypedApiMapper allow you to create an easy to use object which map all your API calls.

```typescript
import { Route, createApi } from 'typed-api-mapper';

// Create the API map
const api = createApi<{ todos: { get: Route<{input: { id: number }; output: Todo}> } }>(requestHandler, {
    todos: todosRoutes,
});

// Use the API map object
const todo = await api.todos.get({ id: 1 });
```

### Map your routes

Before creating the API map object you need to map the type of each route specifing the Input and the Output of the route.<br />
To do this you can use the `Route` type.

```typescript
type Todo = {
  id: number;
  title: string;
};

type TodosRoutes = {
  get: Route<{input: Pick<Todo, 'id'>; output: Todo}>
  list: Route<{output: Todo[]}>
  create: Route<{input: Omit<Todo, 'id'>; output: Todo}>
  delete: Route<{input: Pick<Todo, 'id'>}>
};
```

Then you have to group your routes using the `createApiRoutes` function which will return a `ApiRoutes` object.<br />
This function require as parameter an object with specified the options for each route.

```typescript
type ApiOptions = {
  method: 'GET' | 'POST' | 'DELETE'
  name: string
};

const todosRoutes = createApiRoutes<TodosRoutes, ApiOptions>({
  get: {method: 'GET', name: 'GetTodo'},
  list: {method: 'GET', name: 'ListTodos'},
  create: {method: 'POST', name: 'CreateTodo'},
  delete: {method: 'DELETE', name: 'DeleteTodo'},
});
```

### Request handler

The request handler is the action that will be executed on each route.</br>
The function has to be of type `RequestHandler`.</br></br>

The parameters are:</br>
`path`: it is the path of the route. for example if you call `api.todos.get()` the value of path will be `["todos", "get"]`.</br>
`options`: it contains the object specified when `createApiRoutes` was called.</br>
`data`: it is the input data of the route and it is of type specified in the `Route` type.</br>

```typescript
function requestHandler<TInput, TOutput>(
  path: string[],
  options: ApiOptions,
  data?: TInput,
): Promise<TOutput> {
  console.log(`Request: ${options.name}`);
  console.log(`Path: ${path}`);
  console.log(`Data: ${JSON.stringify(data)}`);
  return Promise.resolve({} as TOutput);
}
```

### Request handler

Finally we can create an API map object using the `createApi` function which will return a `Api` object.<br />

```typescript
import { Route, createApiRoutes, createApi } from 'typed-api-mapper';

type Todo = {
  id: number;
  title: string;
};

type TodosRoutes = {
  get: Route<{input: Pick<Todo, 'id'>; output: Todo}>
  list: Route<{output: Todo[]}>
  create: Route<{input: Omit<Todo, 'id'>; output: Todo}>
  delete: Route<{input: Pick<Todo, 'id'>}>
};

type ApiOptions = {
  method: 'GET' | 'POST' | 'DELETE'
  name: string
};

const todosRoutes = createApiRoutes<TodosRoutes, ApiOptions>({
  get: {method: 'GET', name: 'GetTodo'},
  list: {method: 'GET', name: 'ListTodos'},
  create: {method: 'POST', name: 'CreateTodo'},
  delete: {method: 'DELETE', name: 'DeleteTodo'},
});

function requestHandler<TInput, TOutput>(
  path: string[],
  options: ApiOptions,
  data?: TInput,
): Promise<TOutput> {
  console.log(`Request: ${options.name}`);
  console.log(`Path: ${path}`);
  console.log(`Data: ${JSON.stringify(data)}`);
  return Promise.resolve({} as TOutput);
}

type ApiMap = {
    todos: TodosRoutes
};
  
const api = createApi<ApiMap, ApiOptions>(requestHandler, {
    todos: todosRoutes,
})

api.todos.create({ title: 'Wash the dishes' })
.then(() => console.log('Todo created!'));

/*
  OUTPUT:

  Request: CreateTodo
  Path: todos,create
  Data: {"title":"Wash the dishes"}
  Todo created!
*/
```