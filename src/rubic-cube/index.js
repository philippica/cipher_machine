import { Point3D } from './point3D';
import { RubikCube } from './rubikCube';


class Scene {
	constructor(ctx) {
		this.objList = [];
		this.ctx = ctx;
	}
	add(obj) {
		this.objList.push(obj);
	}
	render() {
		for(let obj of this.objList) {
			obj.render(this.ctx);
		}
	}
}




export class RubikCubeStage {
	constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
		this.rotationAngle = {x: 20,y:20, z:20};
		const len = 90;
		this.cube = new RubikCube(new Point3D(-len/2,-len/2,-len/2), len);
		this.rotate(this.rotationAngle);
		this.draw(this.rotationAngle);
        this.register();
	}
	rotate(rotationAngle) {
		this.rotationAngle =  {
			x: (this.rotationAngle.x+rotationAngle.x),
			y: (this.rotationAngle.y+rotationAngle.y),
			z: (this.rotationAngle.z+rotationAngle.z),
		};
		const cube = this.cube;
		cube.rotate(rotationAngle.x, 'x');
		cube.rotate(rotationAngle.y, 'y');
		cube.rotate(rotationAngle.z, 'z');
	}
	draw() {
		const cube = this.cube;
		this.ctx.clearRect(0,0,this.width,this.height);
		const scene = new Scene(this.ctx);
		scene.add(cube);
		scene.render();
	}
	resetRotation() {
		this.cube.resetRotation();
	}
	front(inverse) {
		if(!inverse)inverse = 1;
		this.cube.front(inverse);
		this.draw();
	}
	up(inverse) {
		if(!inverse)inverse = 1;
		this.cube.up(inverse);
		this.draw();
	}
	back(inverse) {
		if(!inverse)inverse = 1;
		this.cube.back(inverse);
		this.draw();
	}
	bottom(inverse) {
		if(!inverse)inverse = 1;
		this.cube.bottom(inverse);
		this.draw();
	}
	left(inverse) {
		if(!inverse)inverse = 1;
		this.cube.left(inverse);
		this.draw();
	}
	right(inverse) {
		if(!inverse)inverse = 1;
		this.cube.right(inverse);
		this.draw();
	}
    register() {
        const rubicCubeStage = this;
		let originCoordinate = {};
		let ppMousePressed = false;
        $('#rubik-cube').mousedown((e) => {
            if(e.which === 1) // left click
            {
                var mouseX = e.pageX;
                var mouseY = e.pageY;
                if(ppMousePressed === false) {
                    originCoordinate.x = mouseX;
                    originCoordinate.y = mouseY;
                }
                ppMousePressed = true;
            }
        });
        
        $('body').mouseup((e) => {
            if(ppMousePressed === true) {
                ppMousePressed = false;
                rubicCubeStage.resetRotation();
                const rotationAngle = {x: 20,y:20, z:20};
                rubicCubeStage.rotate(rotationAngle);
                rubicCubeStage.draw();
            }
        });
        
        $('body').mousemove((e) => {
            if(ppMousePressed === true)
            {
                const rotationAngle = {x:0, y:0, z:0};
                let mouseX = e.pageX;
                let mouseY = e.pageY;
                let diffX = (mouseX - originCoordinate.x);
                let diffY = (mouseY - originCoordinate.y);
                rotationAngle.z = -diffX;
                rotationAngle.y = diffY;
                rubicCubeStage.rotate(rotationAngle);
                rubicCubeStage.draw();
                originCoordinate.x = mouseX;
                originCoordinate.y = mouseY;
            }
        });
        
        $('#rubik-cube').on("touchstart", function(e) {
            var mouseX = e.originalEvent.changedTouches[0].pageX;
            var mouseY = e.originalEvent.changedTouches[0].pageY;
            if(ppMousePressed === false) {
                originCoordinate.x = mouseX;
                originCoordinate.y = mouseY;
            }
            ppMousePressed = true;
        
        });
        
        $('#rubik-cube').on("touchend", function(e) {
            if(ppMousePressed === true) {
                ppMousePressed = false;
                rubicCubeStage.resetRotation();
                const rotationAngle = {x: 20,y:20, z:20};
                rubicCubeStage.rotate(rotationAngle);
                rubicCubeStage.draw();
            }
        });
        $('#rubik-cube').on("touchmove", function(e) {
            if(ppMousePressed === true)
            {
				const rotationAngle = {x:0, y:0, z:0};
                var mouseX = e.originalEvent.changedTouches[0].pageX;
                var mouseY = e.originalEvent.changedTouches[0].pageY;
                let diffX = (mouseX - originCoordinate.x);
                let diffY = (mouseY - originCoordinate.y);
                rotationAngle.z -= diffX;
                rotationAngle.y -= diffY;
                rubicCubeStage.rotate(rotationAngle);
                rubicCubeStage.draw();
                console.info(diffX);
                originCoordinate.x = mouseX;
                originCoordinate.y = mouseY;
            }
        });
    }
}

