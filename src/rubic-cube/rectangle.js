import { Point3D } from './point3D';

export class Rectangle {
	constructor(a, b, c, d, len, color, index) {
		this.points = [a,b,c,d];
		this.len = len;
		if(!color) {
			color = "red";
		}
		this.color = color;
		this.index = index;
	}
	render(ctx, index , material) {
		const v1 = new Point3D(this.points[1].x - this.points[0].x, this.points[1].y - this.points[0].y, this.points[1].z - this.points[0].z);
		const v2 = new Point3D(this.points[3].x - this.points[0].x, this.points[3].y - this.points[0].y, this.points[3].z - this.points[0].z);
		var normalP3D = new Point3D(v1.y*v2.z-v2.y*v1.z, v1.z*v2.x-v2.z*v1.x, v1.x*v2.y-v2.x*v1.y);
		if(normalP3D.x <= 0) {
			return;
		}
		const offset = 150;
		const p1 = new Point3D(this.points[0].y+offset, this.points[0].z+offset);
		const p2 = new Point3D(this.points[1].y+offset, this.points[1].z+offset);
		const p3 = new Point3D(this.points[2].y+offset, this.points[2].z+offset);
		const p4 = new Point3D(this.points[3].y+offset, this.points[3].z+offset);
		ctx.beginPath();
		ctx.moveTo(this.points[0].y+offset, this.points[0].z+offset);
		ctx.lineTo(this.points[1].y+offset, this.points[1].z+offset);
		ctx.lineTo(this.points[2].y+offset, this.points[2].z+offset);
		ctx.lineTo(this.points[3].y+offset, this.points[3].z+offset);
		ctx.lineTo(this.points[0].y+offset, this.points[0].z+offset);
		ctx.lineWidth = 1;
		ctx.stroke();
		let u = Math.sqrt((p1.x-p4.x)*(p1.x-p4.x)+(p1.y-p4.y)*(p1.y-p4.y))/this.len;
		u = (p1.y-p4.y)/this.len;
		let v = -(p2.x-p1.x)/this.len;
		let uu = (p2.y-p1.y)/(p2.x-p1.x);
		let vv = (p4.x-p1.x)/(p4.y-p1.y);
		if(Math.abs(p4.y-p1.y) < 0.0000001) {
			vv = 0;
		}
		ctx.setTransform(v,uu*v,vv*u,u,this.points[3].y+offset,this.points[3].z+offset);
		ctx.fillStyle=this.color;
		/*
		var img=document.getElementById("scream");
		ctx.drawImage(img,0,0, this.len,this.len);
		*/
		if(material) {
			ctx.drawImage(material, -this.len ,0, this.len,this.len);
		} else {
			ctx.fillRect(-this.len,0,this.len,this.len);
		}

		ctx.setTransform(1,0,0,1,0,0);

		//ctx.fillRect(0,0,this.len,this.len);
	}

}