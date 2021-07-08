export class LottieLoadings {
  constructor({path, speed}) {
    this.path = path
    this.speed = speed
  }

  static lavaPreloader() {
    return new LottieLoadings({path: 'https://assets6.lottiefiles.com/packages/lf20_mniampqn.json', speed: 2})
  }

  static holographicRadar() {
    return new LottieLoadings({path: 'https://assets7.lottiefiles.com/packages/lf20_cb7mlyhe.json', speed: 1})
  }

  static loadingDownFall() {
    return new LottieLoadings({path: 'https://assets7.lottiefiles.com/private_files/lf30_weidduaf.json', speed: 1})
  }

  static airplane() {
    return new LottieLoadings({path: 'https://assets8.lottiefiles.com/packages/lf20_89tq6c8d.json', speed: 2})
  }

  static heart() {
    return new LottieLoadings({path: 'https://assets8.lottiefiles.com/packages/lf20_bojn7fmw.json', speed: 2})
  }

  static cycleMan() {
    return new LottieLoadings({path: 'https://assets4.lottiefiles.com/packages/lf20_zelmdhdr.json', speed: 3})
  }

  static circle() {
    return new LottieLoadings({path: 'https://assets7.lottiefiles.com/private_files/lf30_r5qirj7i.json', speed: 2})
  }
}
