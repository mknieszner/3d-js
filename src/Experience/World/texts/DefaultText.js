
export default class DefaultText {
    targetScale = 0;

    updateScale() {
        const damping = this.experiance.time.damping(1 / 20);
        const deltaX = this.targetScale - this.scaleMesh.scale.x;
        const deltaY = this.targetScale - this.scaleMesh.scale.y;
        const deltaZ = this.targetScale - this.scaleMesh.scale.z;

        if (Math.abs(deltaX) > 0.001 || Math.abs(deltaY) > 0.001 || Math.abs(deltaZ) > 0.001) {
            this.scaleMesh.scale.set(
                this.scaleMesh.scale.x + deltaX * damping,
                this.scaleMesh.scale.y + deltaY * damping,
                this.scaleMesh.scale.z + deltaZ * damping
            )
        } else {
            this.scaleMesh.scale.setScalar(this.targetScale);
            this.scaleMesh.visible = this.targetScale !== 0
        }
    }

    get scaleMesh() {
        throw new Error('scaleMesh')
    }
}
