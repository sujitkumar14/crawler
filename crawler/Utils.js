


class Utils { }

Utils.ERROR = "error";
Utils.LOG = "log";

/**
 * remove duplicates from an array
 * @param {array} array
 */
Utils.removeDuplicate = function (array) {

    let unique = array.filter((elem, pos) => {
        return array.indexOf(elem) == pos;
    });
    return unique;
}

/**
 * function returns the element of arrayA not in arrayB
 * @return {Array}
 */
Utils.getNotIntersectedElements = function (arrayA, arrayB) {
    let objB = {};
    arrayB.forEach(element => {
        objB[element] = 1;
    });

    let array = arrayA.filter((elem, pos) => {
        return !objB[elem];
    });

    return array;
}

/**
 * general function to register logs 
 */
Utils.registerLogs = function(type, log) {
    console.log(log);
}

module.exports = Utils;