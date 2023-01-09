import {Api, ApiRoutes, ComposedApiRoutes, RequestHandler} from 'types/api'
import {Routes, RoutesOptions, RouteHandler} from 'types/routes'

import {transformProperties} from 'utils/transformProperties'

function createRouteHandler<TRoutes extends Routes, TOptions = {}>(
  route: Extract<keyof TRoutes, string>,
  options: TOptions,
): (
  requestHandler: RequestHandler<TOptions>,
  path: string[],
) => RouteHandler<
  TRoutes[typeof route]['input'],
  TRoutes[typeof route]['output']
> {
  return (requestHandler: RequestHandler<TOptions>, path: string[]) =>
    (data?: TRoutes[typeof route]['input']) =>
      requestHandler<
        TRoutes[typeof route]['input'],
        TRoutes[typeof route]['output']
      >(path, options, data)
}

export function createApiRoutes<TRoutes extends Routes, TOptions = {}>(
  routes: RoutesOptions<TRoutes, TOptions>,
): ApiRoutes<TRoutes, TOptions> {
  return transformProperties<
    ApiRoutes<TRoutes, TOptions>,
    RoutesOptions<TRoutes, TOptions>
  >(routes, createRouteHandler)
}

export function createApi<
  TRoutes extends {[RouteName: string]: Routes},
  TOptions = {},
>(
  requestHandler: RequestHandler<TOptions>,
  routes: ComposedApiRoutes<TRoutes, TOptions>,
): Api<TRoutes> {
  return transformProperties<
    Api<TRoutes>,
    ComposedApiRoutes<TRoutes, TOptions>
  >(routes, (route, children) =>
    transformProperties<
      Api<TRoutes>[typeof route],
      ApiRoutes<TRoutes[typeof route], TOptions>
    >(children, (action, routeHandler) =>
      routeHandler(requestHandler, [route, action]),
    ),
  )
}
