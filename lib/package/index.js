import * as AssetFactory from '../factory';

const ASSET_PACKAGE_CONTENT_TYPE = 'asset_package';

/**
 * @typedef {object} AssetLoadInfo
 * @property {AssetPackage} assetPackage - Package the assets belong to.
 * @property {number} index - Current asset index being loaded.
 */

/**
 * Maintains a collection of assets that have been combined into a single package.
 * An asset may exist within multiple packages.
 */
export default class AssetPackage {
    constructor(uri) {
        this.uri = uri;

        this.errors = 0;
        this.isLoaded = false;
        this.isLoading = false;

        this.assetDefinitions = null;
        this.listeners = [];
        this.assets = [];
    }

    /**
     *
     * @param {IAssetListener} listener
     */
    load(listener) {
        if (!this.isLoaded) {
            this.listeners.push(listener);

            if (!this.isLoading) {
                this.isLoading = true;

                const loadInfo = {
                    assetPackage: this,
                    index: 0
                };

                fetch(this.uri).then(response => {
                    response.json().then(data => {
                        if (!data.metaData) {
                            throw new Error('No metaData found in asset package json.');
                        }

                        if (data.metaData.content !== ASSET_PACKAGE_CONTENT_TYPE) {
                            throw new Error('File did not contain asset package data.');
                        }

                        loadInfo.self.errors = 0;
                        loadInfo.self.assetDefinitions = data.assets;

                        AssetPackage._nextAsset(loadInfo);
                    });
                });
            }
        }
    }

    /**
     * Removes all assets from memory that belong to this package.
     * If the asset belongs to multiple packages, it will remain in memory until all packages that reference it have
     * been unloaded.
     */
    unload() {
        for (const asset of this.assets) {
            if (--asset.packageRefCount === 0) {
                AssetFactory.delete(asset.id);
            }
        }

        this.assets.length = 0;
    }

    /**
     * Private method invoked when an asset has finished loading.
     * @param progress
     * @private
     */
    _onProgress(progress) {
        for (const listener of this.listeners) {
            listener.onAssetProgress(progress);
        }
    }

    /**
     * Private method invoked when all assets have been processed during the loading phase.
     * @private
     */
    _onLoadComplete() {
        this.isLoading = false;
        this.isLoaded = true;

        for (const listener of this.listeners) {
            listener.onAssetLoadComplete(this);
        }

        this.listeners.length = 0;
    }

    /**
     * Internal method that processes each asset in-turn.
     * @param {AssetLoadInfo} loadInfo - Description of the package being loaded.
     */
    static _nextAsset = function(loadInfo) {
        if (loadInfo.assetPackage.assetDefinitions.length > 0) {
            loadInfo.assetPackage._onProgress(loadInfo.index / loadInfo.assetPackage.assetDefinitions.length);
        } else {
            loadInfo.assetPackage._onProgress(1);
        }

        if (loadInfo.index >=  loadInfo.assetPackage.assetDefinitions.length) {
            loadInfo.assetPackage._onLoadComplete();
        } else {
            const desc = loadInfo.assetPackage.assetDefinitions[loadInfo.index];
            AssetFactory.createAsset(desc, (err, asset) => {
                if (err) {
                    console.log('Failed to load asset \'' + desc.name + '\'.');
                    loadInfo.assetPackage.errors++;
                } else {
                    asset.packageRefCount++;
                    loadInfo.assetPackage.assets.push(asset);
                }

                loadInfo.index++;
                AssetPackage._nextAsset(loadInfo);
            });
        }
    };
}
