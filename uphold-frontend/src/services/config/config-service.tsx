export class ConfigService {
    private env: ImportMetaEnv;

  constructor() {
    this.env = import.meta.env;
    console.log('this.env',this.env)
  }

  getProperty(
    key: string
  ): string {
      const v = this.env['VITE_'+key]
    console.log('v', v);
    if (!v) throw new Error(`Missing env for ${key}`);
    return v;
  }
}