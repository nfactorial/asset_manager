/**
 * @typedef {object} AssetDesc - JSON object that describes an asset to be loaded.
 * @property {string} name
 * @property {string} id
 * @property {string} uri
 * @property {string} type
 */

/**
 * Base class that represents an Asset within the application.
 * Applications should inherit this class when defining its own asset types.
 */
export default class Asset {
    constructor(assetDesc) {
        if (!assetDesc) {
            throw new Error('No asset description provided.');
        }

        this.name = assetDesc.name;
        this.id = assetDesc.id;
        this.uri = typeof assetDesc.uri === 'string' ? assetDesc.uri : null;
        this.type = assetDesc.type;
        this.instance = null;
        this.packageRefCount = 0;
    }

    dispose() {

    }
}
