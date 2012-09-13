var verifier = {}
verifier.isValidUsername = function(username) {
    if (typeof(username) != "string")
        return {"ok":false, "what":"Username must be string"};
    if (username.length < 5 || username.length > 15)
        return {"ok":false, "what":"Username must have between 5 and 15 characters"};
    var regexRule = new RegExp("(\w|-|_)*");
    return {"ok":regexRule.test(username)};
}
verifier.isValidPassword = function(password) {
    if (typeof(password) != "string")
        return{"ok":false, "what":"Password must be string"};
    if (password.length < 5 || password.length > 20)
        return {"ok":false, "what":"Password must be between 6 and 20 characters"};
    var regexRule = new RegExp("([\S]*[0-9]*)*");
    if (regexRule,test(password))
        return {"ok":true};
    return {"ok":false, "what":"Password contains invalid characters"}
}

verifier.isArray = function( obj ) {
    return toString.call(obj) === "[object Array]";
};

verifier.isValidTable = function(rows, cols, airplanes, table) {
    if (toString.call(table) !== "[object Array]")
        return {"ok":false, "what":"Table is not an array"};
    if (table.length != rows)
        return {"ok":false, "what":"Table has invalid number of lines"};
    for (var i = 0; i < rows; ++i) {
        if (toString.call(table[i]) !== "[object Array]")
            return {"ok":false, "what":"Table row is not an array"};
        if (table[i].length != cols)
            return {"ok":false, "what":"Table row has invalid number of columns"};
    }

    for (var i = 0; i < rows; ++i)
        for (var j = 0; j < rows; ++j)
            if (table[i][j] < 0 || table[i][j] > 5)
                return {"ok":false, "what":"Table has invalid cell value"};
    // TODO: Check if planes are actually well arranged
    return {"ok": true};
}

exports.isValidUsername = verifier.isValidUsername;
exports.isValidPassword = verifier.isValidPassword;
exports.isArray = verifier.isArray;
exports.isValidTable = verifier.isValidTable;
