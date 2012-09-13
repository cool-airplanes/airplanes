var verifier = {}
verifier.isValidUsername = function(username) {
	if (typeof(username) != "string")
        return false;
    if (username.length < 4 || username.length > 14)
        return false;
    var regexRule = new RegExp("\w|-|_)*");    
    return regexRule.test(username);
}
verifier.isValidPassword = function(password) {
    if (typeof(password) != "string")
        return false;
    if (password.length < 6 || password.length > 16)
        return false;
    var regexRule = new RegexRule("([\S]*[0-9]*)*");
    return regexRule.test(password);  
}

