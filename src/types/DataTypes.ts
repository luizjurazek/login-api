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
  data?: object | null | boolean;
}

interface userToken {
  id: number;
  email: string;
  role: string;
}
export { responseType, controllerResponse, userToken };
