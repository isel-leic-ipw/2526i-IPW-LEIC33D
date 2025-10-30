import { INTERNAL_ERROR_CODES } from '../../commons/internal-errors.mjs';

// Constructor function for an Http-response error object.
function HttpResponseError(status, e) {
    this.status = status;
    this.body = {
        code: e.internalError, // internal code error
        error: e.description
    };
}

// Input: an error object:
//      Error {internalError: <numberValue>, description: <stringValue>}
// Output: an HTTP status response object:
//      HttpResponse {
//          status: <numberValue>, 
//          body: {code: <numberValue>, error: <stringValue>}
//      }
export function errorToHttp(e) {
    switch(e.internalError) {
        case INTERNAL_ERROR_CODES.INVALID_BODY: return new HttpResponseError(400, e);
        case INTERNAL_ERROR_CODES.INVALID_QUERY: return new HttpResponseError(400, e);
        case INTERNAL_ERROR_CODES.INVALID_PARAMETER: return new HttpResponseError(400, e);
        case INTERNAL_ERROR_CODES.MISSING_PARAMETER: return new HttpResponseError(400, e);
        case INTERNAL_ERROR_CODES.TASK_NOT_FOUND: return new HttpResponseError(404, e);
        case INTERNAL_ERROR_CODES.USER_NOT_FOUND: return new HttpResponseError(404, e);
        case INTERNAL_ERROR_CODES.MISSING_TOKEN: return new HttpResponseError(401, e)
        case INTERNAL_ERROR_CODES.NOT_AUTHORIZED: return new HttpResponseError(401, e);
        case INTERNAL_ERROR_CODES.USER_ALREADY_EXISTS: return new HttpResponseError(400, e);
        default: return new HttpResponseError(500, {
          internalError: 0,
          description: "Internal server error. Contact your professor!"
        });
    }
}