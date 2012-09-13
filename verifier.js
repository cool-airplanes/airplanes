var verifier = {}
verifier.isValidUsername = function(username) {
    if (typeof(username) != "string")
        return {"ok":false, "what":"Username must be string"};
    if (username.length < 4 || username.length > 15)
        return {"ok":false, "what":"Username must have between 5 and 15 characters"};
    var regexRule = new RegExp("\w|-|_)*");    
    return {"ok":regexRule.test(username)};
}
verifier.isValidPassword = function(password) {
    if (typeof(password) != "string")
        return{"ok":false, "what":"Password must be string"};
    if (password.length < 5 || password.length > 20)
        return {"ok":false, "what":"Password must be between 6 and 20 characters"};
    var regexRule = new RegexRule("([\S]*[0-9]*)*");
    return {"ok":regexRule.test(password)};
}

