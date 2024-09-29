export interface IAppleErrorResponse {
  errors: {
    code: number; // The code for this error. For possible values, see HTTP Status Codes.
    detail?: string; // A long, possibly localized, description of the problem.
    id: string; // A unique identifier for this occurrence of the error.
    source?: {
      // An object containing references to the source of the error. For possible members, see Source object.
      parameter?: string; // The URI query parameter that caused the error.
      pointer?: string; // A pointer to the associated entry in the request document.
    };
    status: string; // The HTTP status code for this problem.
    title: string; // A short, possibly localized, description of the problem.
  }[];
}
