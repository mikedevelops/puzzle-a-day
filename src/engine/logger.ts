interface Transport {
  log: (s: string) => void;
}

export function createLogger(): Logger {
  return new Logger();
}

export class Logger {
  private readonly fmt = "[%s]: %s";
  private transport: Transport = console;

  public warn(msg: string): void {
    this.write(msg);
  }

  private write(msg: string): void {
    const now = new Date();
    this.transport.log(this.format(this.fmt, now.toISOString(), msg));
  }

  private format(str: string, ...values: string[]): string {
    let f = str;
    for (const v of values) {
      f = f.replace("%s", v);
    }
    return f;
  }
}
