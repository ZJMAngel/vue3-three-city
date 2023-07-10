interface IInfo {
  number: number
  name: string
  unit: string
}

export interface IDataInfo {
  iot: IInfo
  event: IInfo
  power: IInfo
  test: IInfo
}
