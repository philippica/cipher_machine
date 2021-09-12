export class Point3D {
	constructor(x, y, z) {
		this.angleX = 0;
		this.angleY = 0;
		this.angleZ = 0;
		this.originX = x;
		this.originY = y;
		this.originZ = z;
		this.x = x;
		this.y = y;
		this.z = z;
		this.mat = [[1,0,0],[0,1,0],[0,0,1]];
	}
	multiply(mat1, mat2) {
		const ret = [[0,0,0],[0,0,0],[0,0,0]];
		for(let i = 0; i < 3; i++) {
			for(let j = 0; j < 3; j++) {
				for(let k = 0; k < 3; k++) {
					ret[i][j] += mat1[i][k]*mat2[k][j];
				}
			}
		}
		return ret;
	}

	rotateHelp(angleRad, axis) {
		let newX = this.originX, newY = this.originY, newZ = this.originZ;
		switch (axis)
		{
			case "x":
			{
			newY = this.originY * Math.cos(angleRad) - this.originZ * Math.sin(angleRad);
			newZ = this.originY * Math.sin(angleRad) + this.originZ * Math.cos(angleRad);
			break;
			} 
			case "y":
			{
			newX = this.originX * Math.cos(angleRad) + this.originZ * Math.sin(angleRad);
			newZ = -this.originX * Math.sin(angleRad) + this.originZ * Math.cos(angleRad);
			break;
			} 
			case "z":
			{
			newX = this.originX * Math.cos(angleRad) - this.originY * Math.sin(angleRad);
			newY = this.originX * Math.sin(angleRad) + this.originY * Math.cos(angleRad);
			break;
			}
		}
		this.originX = newX;
		this.originY = newY;
		this.originZ = newZ;

	}
	rotate(angle, axis, op) {
		const mat = [[1,0,0],[0,1,0],[0,0,1]];
		const angleRad = angle * Math.PI / 180;
		if(op === true) { 
			this.rotateHelp(angleRad, axis);
		}
		else 
		switch (axis)
		{
			case "x":
			{
			mat[1][1] = Math.cos(angleRad);
			mat[1][2] = -Math.sin(angleRad);
			mat[2][1] = Math.sin(angleRad);
			mat[2][2] = Math.cos(angleRad);
			this.angleX += angle;
			break;
			} 
			case "y":
			{
			mat[0][0] = Math.cos(angleRad);
			mat[2][0] = -Math.sin(angleRad);
			mat[0][2] = Math.sin(angleRad);
			mat[2][2] = Math.cos(angleRad);
			this.angleY += angle;
			break;
			} 
			case "z":
			{
			mat[0][0] = Math.cos(angleRad);
			mat[0][1] = -Math.sin(angleRad);
			mat[1][0] = Math.sin(angleRad);
			mat[1][1] = Math.cos(angleRad);
			this.angleZ += angle;
			break;
			}
		}
		this.mat = this.multiply(this.mat, mat);
		const xx = this.originX * this.mat[0][0] + this.originY * this.mat[0][1]+ this.originZ * this.mat[0][2];
		const yy = this.originX * this.mat[1][0] + this.originY * this.mat[1][1]+ this.originZ * this.mat[1][2];
		const zz = this.originX * this.mat[2][0] + this.originY * this.mat[2][1]+ this.originZ * this.mat[2][2];
		this.x = xx;
		this.y = yy;
		this.z = zz;
	}
	resetRotation() {
		this.mat = [[1,0,0],[0,1,0],[0,0,1]];
		this.rotate("x", 0);
	}
}
