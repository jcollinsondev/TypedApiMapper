import {Routes, RouteHandler} from './routes'

export type RequestHandler<TOptions = {}> = <TInput, TOutput>(
  path: string[],
  options: TOptions,
  data?: TInput,
) => Promise<TOutput>

export type ApiRoutes<TRoutes extends Routes, TOptions = {}> = {
  [RouteName in Extract<keyof TRoutes, string>]: (
    requestHandler: RequestHandler<TOptions>,
    path: string[],
  ) => RouteHandler<TRoutes[RouteName]['input'], TRoutes[RouteName]['output']>
}

export type ComposedApiRoutes<
  TRoutes extends {[RouteName: string]: Routes},
  TOptions = {},
> = {
  [RouteName in Extract<keyof TRoutes, string>]: ApiRoutes<
    TRoutes[RouteName],
    TOptions
  >
}

export type Api<TRoutes extends {[RouteName: string]: Routes}> = {
  [RouteName in Extract<keyof TRoutes, string>]: {
    [SubRouteName in Extract<keyof TRoutes[RouteName], string>]: RouteHandler<
      TRoutes[RouteName][SubRouteName]['input'],
      TRoutes[RouteName][SubRouteName]['output']
    >
  }
}
