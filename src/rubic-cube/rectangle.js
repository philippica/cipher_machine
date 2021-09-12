import { Point3D } from './point3D';

export class Rectangle {
	constructor(a, b, c, d, len, color) {
		this.points = [a,b,c,d];
		this.len = len;
		if(!color) {
			color = "red";
		}
		this.color = color;
	}
	render(ctx, index) {
		const v1 = new Point3D(this.points[1].x - this.points[0].x, this.points[1].y - this.points[0].y, this.points[1].z - this.points[0].z);
		const v2 = new Point3D(this.points[3].x - this.points[0].x, this.points[3].y - this.points[0].y, this.points[3].z - this.points[0].z);
		var normalP3D = new Point3D(v1.y*v2.z-v2.y*v1.z, v1.z*v2.x-v2.z*v1.x, v1.x*v2.y-v2.x*v1.y);
		if(normalP3D.x <= 0) {
			return;
		}
		const p1 = new Point3D(this.points[0].y+100, this.points[0].z+100);
		const p2 = new Point3D(this.points[1].y+100, this.points[1].z+100);
		const p3 = new Point3D(this.points[2].y+100, this.points[2].z+100);
		const p4 = new Point3D(this.points[3].y+100, this.points[3].z+100);
		ctx.beginPath();
		ctx.moveTo(this.points[0].y+100, this.points[0].z+100);
		ctx.lineTo(this.points[1].y+100, this.points[1].z+100);
		ctx.lineTo(this.points[2].y+100, this.points[2].z+100);
		ctx.lineTo(this.points[3].y+100, this.points[3].z+100);
		ctx.lineTo(this.points[0].y+100, this.points[0].z+100);
		ctx.lineWidth = 1;
		ctx.stroke();
		let u = Math.sqrt((p1.x-p4.x)*(p1.x-p4.x)+(p1.y-p4.y)*(p1.y-p4.y))/this.len;
		u = (p1.y-p4.y)/this.len;
		let v = (p2.x-p1.x)/this.len;
		let uu = (p2.y-p1.y)/(p2.x-p1.x);
		let vv = (p4.x-p1.x)/(p4.y-p1.y);
		if(Math.abs(p4.y-p1.y) < 0.0000001) {
			vv = 0;
		}
		ctx.setTransform(v,uu*v,vv*u,u,this.points[3].y+100,this.points[3].z+100);
		ctx.fillStyle=this.color;
		/*
		var img=document.getElementById("scream");
		ctx.drawImage(img,0,0, this.len,this.len);
		*/
		ctx.fillRect(0,0,this.len,this.len);
		ctx.fillStyle="black";
		ctx.fillText (index.toString(), 7,7);

		ctx.setTransform(1,0,0,1,0,0);

		//ctx.fillRect(0,0,this.len,this.len);
	}

}