interface responseType {
  statusCode: number;
  error?: boolean;
  message?: string;
  data?: object;
}

export { responseType };
