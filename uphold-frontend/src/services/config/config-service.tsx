export class ConfigService {
  private env: ImportMetaEnv;

  constructor() {
    this.env = import.meta.env;
  }

  getProperty(key: string): string {
    const v = this.env['VITE_' + key];
    if (!v) throw new Error(`Missing env for ${key}`);
    return v;
  }
}
