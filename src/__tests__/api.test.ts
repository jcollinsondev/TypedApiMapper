import axios from 'axios'
import {api, BASE_URL} from './utils/setup-env'

const mockRequest = jest.fn()

test('should fetch users', async () => {
  const users = [{id: '1', username: 'Bob'}]
  mockRequest.mockResolvedValueOnce(users)
  axios.request = mockRequest

  const response = await api.users.list()

  expect(mockRequest).toBeCalledWith({
    method: 'GET',
    url: `${BASE_URL}users`,
    data: undefined,
  })
  expect(response).toEqual(users)
})

// eslint-disable-next-line jest/no-export
export {}
