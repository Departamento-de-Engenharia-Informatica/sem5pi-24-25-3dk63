export function merge(object, ...sources) {
    return _.mergeWith(object, ...sources, (objValue, srcValue, key, object, source) => {
        if (_.isArray(objValue)) { // Arrays must be concatenated
            return objValue.concat(srcValue);
        }
        else {
            const descriptor = Object.getOwnPropertyDescriptor(object, key);
            if (descriptor !== undefined && !descriptor.writable) { // It must be taken into account that there are properties in three.js (such as position and scale) that are read-only
                descriptor.value = srcValue;
                descriptor.writable = true; // Set the property temporarily writable
                Object.defineProperty(object, key, descriptor);
                descriptor.writable = false; // Set the property back to read-only
                Object.defineProperty(object, key, descriptor);
            }
        }
    });
}