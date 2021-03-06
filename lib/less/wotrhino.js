function loadStyleSheet(sheet, callback, reload, remaining) {
    var sheetName = sheet.entryPath + sheet.href,
        contents = sheet.contents || {},
        input = readFile(sheetName);
        
    contents[sheetName] = input;
        
    var parser = new less.Parser({
        paths: [sheet.href.replace(/[\w\.-]+$/, '')],
        contents: contents
    });
    parser.parse(input, function (e, root) {
        if (e) {
            return error(e, sheetName);
        }
        try {
            callback(e, root, input, sheet, { local: false, lastModified: 0, remaining: remaining }, sheetName);
        } catch(e) {
            error(e, sheetName);
        }
    });
}

function compile(input, basePath, compress) {
    var parser = new less.Parser({
        entryPath: basePath
    });
    var result = null;
    parser.parse(input, function(e, root) {
        if(e) {
            throw e;
        }
        else {
            result = root.toCSS({compress: compress || false});
        }
    });
    return result;
}