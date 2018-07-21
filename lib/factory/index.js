
const PROVIDER_MAP = new Map();
const ASSET_MAP = new Map();

/**
 * Implemented by objects that provide support for loading assets into the application.
 * @interface IAssetProvider
 */

/**
 * @callback AssetCreateCallback
 * @param {string|null} err - The error that occurred during loading or null if there was no error.
 * @param {Asset|null} asset - The asset instance that was loaded or null if there was an error.
 */

/**
 * Creates an asset from the supplied description.
 * @function
 * @name IAssetProvider#createAsset
 * @param assetDesc
 * @param {AssetCreateCallback} cb
 */

/**
 * Retrieves the asset associated with the specified globally unique identifier.
 * @param {string} id - The globally unique identifier associated with the aseet.
 * @returns {Asset|null} Reference to the asset associated with the specified identifier or null if one could not be found.
 */
export function getAsset(id) {
    return ASSET_MAP.get(id);
}

/**
 *
 * @param {AssetDesc} desc - Description of the Asset to be created.
 * @param {function} cb - Method to be invoked once the asset has been processed.
 */
export function createAsset(desc, cb) {
    if (!desc) {
        throw new Error('No asset description was supplied.');
    }

    if (!cb) {
        throw new Error('No callback function was specified when creating an asset.');
    }

    if (!desc.id) {
        throw new Error('No asset identifier found in asset description.');
    }

    let asset = ASSET_MAP.get(desc.id);
    if (asset) {
        cb(null, asset);
    } else {
        const provider = PROVIDER_MAP.get(desc.type);
        if (!provider) {
            cb('No asset provider for asset type \'' + desc.type + '\'.', null);
        } else {
            // TODO: Need to account for multiple packages being loaded that reference the same asset. We should
            // TODO: create a placeholder asset instance here so a second load will attach itself to the one in progress.
            provider.createAsset(desc, (err, asset) => {
                if (err) {
                    cb(err, null);
                } else {
                    ASSET_MAP.set(asset.id, asset);
                    cb(null, asset);
                }
            });
        }
    }
}

/**
 * Retrieves the instance data for the asset associated with the supplied identifier.
 * @param {string} id - Globally unique identifier associated with the asset instance to be retrieved.
 * @returns {object}
 */
export function getAssetInstance(id) {
    const asset = ASSET_MAP.get(id);
    return asset ? asset.instance : null;
}

/**
 * Retrieves the AssetProvider instance associated with the specified asset type.
 * @param {string} assetType - The asset type whose provider is to be retrieved.
 * @returns {IAssetProvider} The AssetProvider associated with the specified asset type/
 */
export function getProvider(assetType) {
    return PROVIDER_MAP.get(assetType);
}

/**
 * Adds an asset provider to the factory that is responsible for managing assets of a particular type.
 * @param {string} assetType - Identifier associated with the asset type the provider supports.
 * @param {IAssetProvider} provider - Instance of the provider that manages the asset type.
 * @returns {object} Reference to the asset factory instance to allow for call chaining.
 */
export function registerProvider(assetType, provider) {
    if (!assetType) {
        throw new Error('AssetFactory.registerProvider - No asset type was specified.');
    }

    if (!provider) {
        throw new Error('AssetFactory.registerProvider - No provider was supplied.');
    }

    if (PROVIDER_MAP.has(assetType)) {
        throw new Error('AssetFactory.registerProvider - Asset type has already been registered.');
    }

    PROVIDER_MAP.set(assetType, provider);
}
