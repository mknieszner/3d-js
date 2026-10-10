export default class PlanetBase {
    targetPosition = null;

    updateScale() {
        const deltaX = this.targetScale - this.group.scale.x;
        const deltaY = this.targetScale - this.group.scale.y;
        const deltaZ = this.targetScale - this.group.scale.z;

        if (this.targetScale === 0 && this.group.scale.x <= 0.4) {
            this.group.scale.set(this.targetScale, this.targetScale, this.targetScale);
            this.group.visible = false;
        } else if (Math.abs(deltaX) > 0.001 || Math.abs(deltaY) > 0.001 || Math.abs(deltaZ) > 0.001) {
            const stepScale = this.group.scale.x + deltaX * this.experiance.time.damping(1 / 15);
            this.group.scale.set(stepScale, stepScale, stepScale);
            this.group.visible = this.group.scale.x > 0.001
            this.group.visible = true;
        }
    }

    updatePosition() {
        const damping = this.experiance.time.damping(1 / 30);
        const targetX = this.targetPosition?.x === undefined ? this.group.position.x : this.targetPosition.x;
        const targetY = this.targetPosition?.y === undefined ? this.group.position.y : this.targetPosition.y;
        const targetZ = this.targetPosition?.z === undefined ? this.group.position.z : this.targetPosition.z;

        const deltaX = targetX - this.group.position.x;
        const deltaY = targetY - this.group.position.y;
        const deltaZ = targetZ - this.group.position.z;

        if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1 || Math.abs(deltaZ) > 0.1) {
            this.group.position.set(
                this.group.position.x + deltaX * damping,
                this.group.position.y + deltaY * damping,
                this.group.position.z + deltaZ * damping
            )
        } else {
            this.group.position.set(targetX, targetY, targetZ);
        }
    }
}
