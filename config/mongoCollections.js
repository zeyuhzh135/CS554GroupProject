const dbConnection = require("./mongoConnection");

const getCollectionFn = collection => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

module.exports = {
    users: getCollectionFn("users"),
    classes: getCollectionFn("classes"),
    privateMsg: getCollectionFn("privateMsg"),
    groupMsg: getCollectionFn("groupMsg"),
    image: getCollectionFn("image")
};