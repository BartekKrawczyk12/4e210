function simpleHash(text) {
    let hash = 7;

    for (let i = 0; i < text.length; i++) {
        hash = hash * 31 + text.charCodeAt(i);
    }

    return Math.abs(hash).toString();
}

module.exports = { simpleHash };

//jakos jeeeest, słabo ale jest :)
