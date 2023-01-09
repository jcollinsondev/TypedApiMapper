export type Input<T> = {input: T}
export type Output<T> = {output: T}
export type UnknownInputOrOutput =
  | Input<unknown>
  | Output<unknown>
  | Partial<{input: unknown; output: unknown}>
  | undefined
export type Route<
  T1 extends UnknownInputOrOutput = undefined,
  T2 extends UnknownInputOrOutput = undefined,
> = (T1 extends undefined ? {} : T1) &
  (T2 extends undefined ? {} : T2) &
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  Omit<{input: never; output: void}, keyof (T1 & T2)>

export type Routes = {
  [RouteName: string]: Route<Input<unknown>, Output<unknown>>
}

export type RoutesOptions<TRoutes extends Routes, TOptions = {}> = {
  [RouteName in Extract<keyof TRoutes, string>]: TOptions
}

export type RouteHandler<TInput, TOutput> = [TInput] extends [never]
  ? // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    () => Promise<TOutput>
  : // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    (data: TInput) => Promise<TOutput>
