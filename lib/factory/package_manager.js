const PACKAGE_MAP = new Map();

export function getPackage(uri) {
    return PACKAGE_MAP.get(uri);
}