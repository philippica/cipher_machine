import { Rectangle } from './rectangle';
import { Point3D } from './point3D';

export class Cube {
	constructor(position, len, colors, index) {
		this.index = index;
		if(!colors) {
			colors = [];
		}
		const points = [];
		for(let i = 0; i < 8; i++) {
			points.push(new Point3D(
				position.x + ((i)&1)*len,
				position.y + ((i>>1)&1)*len,
				position.z + ((i>>2)&1)*len,
			));
		}
		//up, back, bottom, front, "right", left
		//white, orange, yellow, red, blue, green
		const faceIndex = [[2,0,1,3],[5,7,3,1],[4,6,7,5],[6,4,0,2],[7,6,2,3],[4,5,1,0]];
		this.faces = [];
		const faceIndexCount = faceIndex.length;
		const isPointUsed = [];
		let faceIndexNum = 0;
		for(let i = 0; i < faceIndexCount; i++) {
			if(colors[i] === null) {
				continue;
			}
			isPointUsed[faceIndex[i][0]] = true;
			isPointUsed[faceIndex[i][1]] = true;
			isPointUsed[faceIndex[i][2]] = true;
			isPointUsed[faceIndex[i][3]] = true;
			const face = new Rectangle(
				points[faceIndex[i][0]],
				points[faceIndex[i][1]],
				points[faceIndex[i][2]],
				points[faceIndex[i][3]],
				len,
				colors[i],
				faceIndexNum++
			);
			this.faces.push(face);
		}
		this.points = [];
		for(let i = 0; i < 8; i++) {
			if(isPointUsed[i] === true) {
				this.points.push(points[i]);
			}

		}
	}
	render(ctx, materials) {
		for(let face of this.faces) {
			let material = materials?materials[face.index]:null;
			face.render(ctx, this.index, material);
		}
	}
	rotate(angle, axis, op) {
		for(let point of this.points) {
			point.rotate(angle, axis, op);
		}
	}
	resetRotation() {
		for(let point of this.points) {
			point.resetRotation();
		}
	}
}