export class Circle {
  constructor(readonly radius: number = 3, readonly color: string = "grey") {}
}

export class Line {
  constructor(
    readonly width: number,
    readonly height: number = 5,
    readonly color: string = "grey"
  ) {}
}

export class EntityLabel {
  constructor(readonly text: string) {}
}
