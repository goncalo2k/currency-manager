export enum ResponseStatusMessage {
    OK = "OK",
    NOK = "NOK",
  }
  export interface APIResponse<T> {
    message: ResponseStatusMessage;
    result: T;
  }
  