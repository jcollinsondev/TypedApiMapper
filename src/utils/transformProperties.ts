export function transformProperties<
  TTransform extends {[K in keyof T]: unknown},
  T extends object,
>(
  obj: T,
  transform: (
    key: keyof T,
    value: T[keyof T],
  ) => TTransform[Extract<keyof T, string>],
): {[K in keyof T]: TTransform[K]} {
  const result: {[K in keyof T]: TTransform[K]} = {} as {
    [K in keyof T]: TTransform[K]
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = transform(key, obj[key])
    }
  }
  return result
}
