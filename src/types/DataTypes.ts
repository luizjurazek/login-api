interface responseType {
  statusCode: number;
  error?: boolean;
  message?: string;
  data?: object;
}

interface controllerResponse {
  error: boolean;
  statusCode: number;
  message: string;
  data?: object;
}

export { responseType, controllerResponse };
