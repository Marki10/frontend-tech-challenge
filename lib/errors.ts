export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorType?: "network" | "server" | "client" | "unknown"
  ) {
    super(message);
    this.name = "ApiError";
    
    if (!this.errorType && this.statusCode) {
      if (this.statusCode >= 500) {
        this.errorType = "server";
      } else if (this.statusCode >= 400) {
        this.errorType = "client";
      } else {
        this.errorType = "unknown";
      }
    }
    
    Object.setPrototypeOf(this, ApiError.prototype);
  }
  
  static fromResponse(response: Response, message?: string): ApiError {
    const statusCode = response.status;
    let errorMessage = message;
    
    if (!errorMessage) {
      if (statusCode >= 500) {
        errorMessage = "Server error occurred";
      } else if (statusCode === 404) {
        errorMessage = "Resource not found";
      } else if (statusCode === 400) {
        errorMessage = "Invalid request";
      } else if (statusCode === 422) {
        errorMessage = "Validation error";
      } else {
        errorMessage = "Request failed";
      }
    }
    
    return new ApiError(errorMessage, statusCode);
  }
  
  static fromNetworkError(message: string = "Network error"): ApiError {
    return new ApiError(message, undefined, "network");
  }
}

