var RC = {
    "code_200": {
        "code": 200,
        "message": "Ok",
        "success": true,
        "data": []
    },
    "code_201": {
        "code": 201,
        "message": "Created",
        "success": true,
        "data": []
    },
    "code_202": {
        "code": 202,
        "message": "Accepted",
        "success": true,
        "data": []
    },
    "code_301": {
        "code": 301,
        "message": "Moved Permanently",
        "success": true,
        "data": [],
        "new_url": '/v2/api',
        "info_url": '/docs/',
    },
    "code_302": {
        "code": 302,
        "message": "Redirection",
        "success": true,
        "data": [],
        "new_url": '/v2/api',
    },
    "code_303": {
        "code": 302,
        "message": "See other",
        "success": true,
        "data": [],
        "info_url": '/docs/',
    },
    "code_400": {
        "code": 400,
        "message": "Bad request",
        "success": false,
        "data": [],
    },
    "code_401": {
        "code": 401,
        "message": "Unauthorized",
        "success": false,
        "data": [],
    },
    "code_403": {
        "code": 403,
        "message": "Forbidden",
        "success": false,
        "data": [],
    },
    "code_404": {
        "code": 404,
        "message": "Not found",
        "success": false,
        "data": [],
    },
    "code_405": {
        "code": 405,
        "message": "Method not allowed",
        "success": false,
        "data": [],
        "allowed": [],
    },
    "code_415": {
        "code": 415,
        "message": "Unsupported media type",
        "success": false,
        "data": [],
    },
    "code_429": {
        "code": 429,
        "message": "Too many request",
        "success": false,
        "data": [],
    },
    "code_433": {
        "code": 433,
        "message": "Can not be created",
        "success": false,
        "data": [],
    },
    "code_434": {
        "code": 434,
        "message": "Can not be updated",
        "success": false,
        "data": [],
    },
    "code_435": {
        "code": 435,
        "message": "Insuficient data in body",
        "success": false,
        "data": [],
    },
    "code_436": {
        "code": 436,
        "message": "Can not be Updated or Created",
        "success": false,
        "data": [],
    },
    "code_437": {
        "code": 437,
        "message": "Can not be Uploaded",
        "success": false,
        "data": [],
    },
    "code_500": {
        "code": 500,
        "message": "Internal server error",
        "success": false,
        "data": [],
    },
    "code_501": {
        "code": 501,
        "message": "Not implemented",
        "success": false,
        "data": [],
    },
    "code_502": {
        "code": 502,
        "message": "Bad gateway",
        "success": false,
        "data": [],
    },
    "code_503": {
        "code": 503,
        "message": "Service unavailable",
        "success": false,
        "data": [],
    },
    "code_504": {
        "code": 504,
        "message": "Timeout",
        "success": false,
        "data": [],
    },
    "code_507": {
        "code": 507,
        "message": "Insufficient storage",
        "success": false,
        "data": [],
    },
    "code_509": {
        "code": 509,
        "message": "Bandwidth limit exceeded",
        "success": false,
        "data": [],
    },
    "code_550": {
        "code": 550,
        "message": "Permission denied",
        "success": false,
        "data": [],
    },
    "code_533": {
        "code": 550,
        "message": "App not defined",
        "success": false,
        "data": [],
    },

}


module.exports = {codes: RC};