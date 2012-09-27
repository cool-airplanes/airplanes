var verifier = {}

verifier.isValidTable = function(rows, cols, table) {
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
            if (table[i][j] < 0 || table[i][j] > 2)
                return {"ok":false, "what":"Table has invalid cell value"};
    return {"ok": true, "what":"OK"};   
}

