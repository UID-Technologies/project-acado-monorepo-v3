import MockAdapter from 'axios-mock-adapter'
import AxiosBase from '@services/http/AxiosBase'

export const mock = new MockAdapter(AxiosBase)
