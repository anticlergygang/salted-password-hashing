const hashFunc = require('argon2');
const hashPasswordPromise = (password) => {
    return new Promise((resolve, reject) => {
        var hashTimeout = setTimeout(() => {
            reject('hashTimeout');
        }, 10000);
        hashFunc.hash(password, {
            timeCost: 6,
            memoryCost: 21,
            parallelism: 3,
            type: hashFunc.argon2d
        }).then(hash => {
            clearTimeout(hashTimeout);
            resolve(hash);
        });
    });
};
const checkPasswordHashPromise = (password, hash) => {
    return new Promise((resolve, reject) => {
        hashFunc.verify(hash, password).then(match => {
            if (match) {
                resolve('match');
            } else {
                reject('no match');
            }
        }).catch(err => {
            reject(err);
        });
    });
};
const testHash = (password) => {
    hashPasswordPromise(password).then(hash => {
        console.log(hash);
        return checkPasswordHashPromise(password, hash);
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
}
