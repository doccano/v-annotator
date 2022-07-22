interface Config {
  radius: number;
  lineWidth: number;
  labelMargin: number;
  diameter: number;
  maxLabelLength: number;
}

const defaultConfig: Config = Object.freeze({
  radius: 3,
  lineWidth: 5,
  maxLabelLength: 12,
  get labelMargin(): number {
    return 5 + this.radius;
  },
  get diameter(): number {
    return this.radius * 2;
  },
});

export default defaultConfig;
