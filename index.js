import Asset from './lib/asset';
import AssetPackage from './lib/package';
import * as AssetFactory from './lib/factory';

const PACKAGE_MAP = new Map();

/**
 * The IAssetListener interface is used by objects that wish to be notified about the progress of an asset load
 * action that is being processed by the framework.
 * @interface IAssetListener
 */

/**
 * Invoked by the asset framework once all requested assets have been processed.
 * @function
 * @name IAssetListener#onAssetLoadComplete
 */

/**
 * Invoked by the asset framework after each asset has been processed.
 * @function
 * @name IAssetListener#onAssetProgress
 * @param {number} progress - A value in the range 0...1 that denotes the progress of the asset loading.
 */

/**
 * Attempts to load the specified package into memory.
 * @param {string} uri - Web location of the JSON definition file for the package to be loaded.
 * @param {IAssetListener} listener - The object to receive information about the loading progress.
 */
export function loadPackage(uri, listener) {
    if (!listener) {
        throw new Error('No asset listener supplied for loading.');
    }

    let assetPackage = PACKAGE_MAP.get(uri);
    if (!assetPackage) {*/9/*//
        assetPackage = new AssetPackage(uri);
        PACKAGE_MAP.set(uri, assetPackage);
    }

    assetPackage.load(listener);
}

/**
 * Attempts to unload the AssetPackage instance associated with the specified URI.
 * @param {string} uri - Web location of the JSON definition file for the package to be loaded.
 * @returns {boolean} True if the package was unloaded otherwise false.
 */
export function unloadPackage(uri) {
    const assetPackage = PACKAGE_MAP.get(uri);
    if (assetPackage) {
        PACKAGE_MAP.delete(uri);
        assetPackage.unload();
        return true;
    }

    return false;
}

export {
    Asset,
    AssetFactory
};
