const blacklist = new Set();

exports.blacklist = blacklist;

exports.addToBlacklist = (token) => {
    blacklist.add(token);
};

exports.isBlacklisted = (token) => {
    return blacklist.has(token);
};
