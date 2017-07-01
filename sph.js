let users = {};
const pbkdf2Promise = (password, salt) => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 666, 22, 'sha512', (error, key) => {
            if (error) {
                reject(error);
            } else {
                resolve({ 'key': key, 'salt': salt });
            }
        });
    });
};
const storeUserPromise = (username, password) => {
    return new Promise((resolve, reject) => {
        if (Object.keys(users).indexOf(username) == -1) {
            pbkdf2Promise(password, crypto.randomBytes(22)).then((auth) => {
                users[username] = auth;
                resolve(`'${username}' stored.`);
            }).catch((error) => {
                reject(error);
            });
        } else {
            reject(`'${username}' exists.`);
        }
    });
};
const checkUserPasswordPromise = (username, password) => {
    return new Promise((resolve, reject) => {
        if (Object.keys(users).indexOf(username) != -1) {
            pbkdf2Promise(password, users[username].salt).then((auth) => {
                if (auth.key.equals(users[username].key)) {
                    resolve(`'${username}' passed auth.`);
                } else {
                    reject(`'${username}' failed auth.`);
                }
            }).catch((error) => {
                reject(error);
            });
        } else {
            reject(`'${username}' does not exist.`);
        }
    });
};
//test
storeUserPromise('coolguy', 'pw').then((confirmation) => {
    console.log(confirmation);
    return checkUserPasswordPromise('coolguy', 'pw');
}).then((confirmation) => {
    console.log(confirmation);
}).catch((error) => {
    console.log(error);
});
