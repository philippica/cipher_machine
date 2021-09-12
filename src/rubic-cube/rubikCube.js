import { Point3D } from './point3D';
import { Cube } from './cube';

export class RubikCube {
	ontheEdge(index) {
		if(index===0)return true;
		if(index===this.degree-1)return true;
		return false;
	}
	constructor(position, len, degree) {
		if(!degree) {
			degree = 3;
		}
		this.degree = degree;
		this.blockSize = len / degree;
		this.cubes = [];
		const defaultColor = ["white", "orange", "yellow", "red", "blue", "green"];
		let index = 0;
		for(let i = 0; i < degree; i++) {
			for(let j = 0; j < degree; j++) {
				for(let k = 0; k < degree; k++) {
					if(!this.ontheEdge(i) && !this.ontheEdge(j) && !this.ontheEdge(k)) {
						continue;
					}
					const pos = new Point3D(position.x+i*this.blockSize, position.y+j*this.blockSize,position.z+k*this.blockSize);
					const colors = defaultColor.slice(0);
					if(k != 0) colors[0] = null;
					if(k != degree-1) colors[2] = null;
					if(i != degree-1) colors[1] = null;
					if(i != 0) colors[3] = null;
					if(j != degree-1) colors[4] = null;
					if(j != 0) colors[5] = null;
					const cube = new Cube(pos, this.blockSize, colors, index++);
					this.cubes.push(cube);
				}
			}
		}

	}
	render(ctx) {
		const cubes = this.cubes.slice(0);
		cubes.sort((a,b)=>b.points[0].x - a.points[0].x);
		for(let cube of cubes) {
			cube.render(ctx);
		}
	}
	rotate(angle, axis) {
		for(let cube of this.cubes) {
			cube.rotate(angle, axis);
		}
	}
	resetRotation() {
		for(let cube of this.cubes) {
			cube.resetRotation();
		}
	}
	permutation(permutationTable, inverse) {
		for(let item of permutationTable) {
			const len = item.length;
			if(inverse === 1) {
				for(let i = 0; i < len-1; i++) {
					const tmp = this.cubes[item[i]];
					this.cubes[item[i]] = this.cubes[item[i+1]];
					this.cubes[item[i+1]] = tmp;
				}
			} else {
				for(let i = len-1; i >= 1; i--) {
					const tmp = this.cubes[item[i]];
					this.cubes[item[i]] = this.cubes[item[i-1]];
					this.cubes[item[i-1]] = tmp;
				}
			}
		}
	}
	rotateLayer(permutationTable, inverse, axis) {
		for(let item of permutationTable) {
			const len = item.length;
			for(let i = 0; i < len; i++) {
				this.cubes[item[i]].rotate(90*inverse, axis, true);
			}
		}
	}
	front(inverse) {
		const permutationTable = [[2,8,6,0],[1,5,7,3],[4]];
		this.rotateLayer(permutationTable, inverse, "x");
		this.permutation(permutationTable, inverse);
	}
	up(inverse) {
		const permutationTable = [[0,6,23,17],[3,14,20,9],[12]];
		this.rotateLayer(permutationTable, inverse, "z");
		this.permutation(permutationTable, inverse);
	}
	back(inverse) {
		const permutationTable = [[22,24,20,18],[19,25,23,17],[21]];
		this.rotateLayer(permutationTable, inverse, "x");
		this.permutation(permutationTable, inverse);
	}
	bottom(inverse) {
		const permutationTable = [[11,5,16,22],[19,2,8,25],[13]];
		this.rotateLayer(permutationTable, inverse, "z");
		this.permutation(permutationTable, inverse);
	}
	left(inverse) {
		const permutationTable = [[0,17,19,2],[1,9,18,11],[10]];
		this.rotateLayer(permutationTable, inverse, "y");
		this.permutation(permutationTable, inverse);
	}
	right(inverse) {
		const permutationTable = [[8,6,23,25],[16,7,14,24],[15]];
		this.rotateLayer(permutationTable, inverse, "y");
		this.permutation(permutationTable, inverse);
	}
}


