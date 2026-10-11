export const textGeometryKey = (kind, text, size) => JSON.stringify([kind, text, size]);

// Cached geometries belong to Resources, rather than an individual mesh.
export default class GeometryCache {
    items = new Map();

    get(key, create) {
        if (!this.items.has(key)) {
            const geometry = create();
            geometry.userData.resourceCache = true;
            this.items.set(key, geometry);
        }
        return this.items.get(key);
    }

    retain(keys) {
        for (const [key, geometry] of this.items) {
            if (!keys.has(key)) {
                geometry.dispose();
                this.items.delete(key);
            }
        }
    }

    dispose() {
        this.retain(new Set());
    }
}
