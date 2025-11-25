export const INTERNAL_ERROR_CODES = {
    SERVER_ERROR: 1,
    INVALID_USER: 2,
    INVALID_TASK: 3,
    INVALID_QUERY: 4,
    INVALID_PARAMETER: 5,
    TASK_NOT_FOUND: 6,
    USER_NOT_FOUND: 7,
    USER_ALREADY_EXISTS: 8,
    MISSING_PARAMETER: 9,
    MISSING_TOKEN: 10,
    NOT_AUTHORIZED: 11,
    INVALID_JSON_PARSER: 12
};

// Constructor function for an Error
function Error(code, description) {
    this.internalError = code;
    this.description = description;
}

export const errors = {
    INVALID_USER: (who) => {
        return new Error(INTERNAL_ERROR_CODES.INVALID_USER, `Invalid username '${who}'.`);
    },
    INVALID_TASK: () => {
        return new Error(INTERNAL_ERROR_CODES.INVALID_TASK, `Invalid task. A task needs a title and description.`);
    },
    INVALID_QUERY: () => {
        return new Error(INTERNAL_ERROR_CODES.INVALID_QUERY, `Invalid query.`);
    },
    INVALID_PARAMETER: (what) => {
        return new Error(INTERNAL_ERROR_CODES.INVALID_PARAMETER, `Invalid parameter ${what}`);
    },
    TASK_NOT_FOUND: (what) => { 
        return new Error(INTERNAL_ERROR_CODES.TASK_NOT_FOUND,`Task ${what} not found`);
    },
    USER_NOT_FOUND: () => { 
        return new Error(INTERNAL_ERROR_CODES.USER_NOT_FOUND,`User not found`);
    },
    USER_ALREADY_EXISTS: (who) => {
        return new Error(INTERNAL_ERROR_CODES.USER_ALREADY_EXISTS, `User ${who} already exists. Try another username.`);
    },
    MISSING_PARAMETER: (what) => {
        return new Error(INTERNAL_ERROR_CODES.MISSING_PARAMETER, `Missing parameter ${what}`);
    },
    MISSING_TOKEN: () => { 
        return new Error(INTERNAL_ERROR_CODES.MISSING_TOKEN,`Missing token`);
    },
    NOT_AUTHORIZED: (who, what) => { 
        return new Error(INTERNAL_ERROR_CODES.NOT_AUTHORIZED,`${who} has no access to ${what}`);
    },
    INVALID_JSON_PARSER: () => {
        return new Error(INTERNAL_ERROR_CODES.INVALID_JSON_PARSER, `Invalid body. Cannot parser the body.`);
    }
}

