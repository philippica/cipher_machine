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
	constructor(ctx, width, height, blocks) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
		this.rotationAngle = {x: 20,y:20, z:20};
		const len = 150;
        const materials = this.makeMaterials(blocks);
		this.cube = new RubikCube(new Point3D(-len/2,-len/2,-len/2), len, 3, materials);
		this.rotate(this.rotationAngle);
		this.draw(this.rotationAngle);
        this.register();
	}

    makeMaterials(blocks) {
        const blockIndexMap = [
            {index: 0, arr: [6, 18, 11]},
            {index: 1, arr: [21, 14]},
            {index: 2, arr: [36, 24, 17]},
            {index: 3, arr: [7, 19]},
            {index: 4, arr: [22]},
            {index: 5, arr: [37, 25]},
            {index: 6, arr: [8, 20, 27]},
            {index: 7, arr: [23, 30]},
            {index: 8, arr: [38, 26, 33]},
            {index: 9, arr: [3, 10]},
            {index: 10, arr: [13]},
            {index: 11, arr: [39, 16]},
            {index: 12, arr: [4]},
            {index: 13, arr: [40]},
            {index: 14, arr: [5, 28]},
            {index: 15, arr: [31]},
            {index: 16, arr: [41, 34]},
            {index: 17, arr: [0, 51,9]},
            {index: 18, arr: [48, 12]},
            {index: 19, arr: [45, 42,15]},

            {index: 20, arr: [1, 52]},
            {index: 21, arr: [49]},
            {index: 22, arr: [46,43]},
            {index: 23, arr: [2, 53, 29]},
            {index: 24, arr: [50,32]},
            {index: 25, arr: [47,44,35]},
        ];
        const ret = [];
        for(let blockIndexs of blockIndexMap) {
            ret[blockIndexs.index] = [];
            for(let blockIndex of blockIndexs.arr) {
                ret[blockIndexs.index].push(blocks[blockIndex]);
            }
        }
        return ret;
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

        $('#rubik-cube').off("mousedown");
        $('#rubik-cube').off("touchstart");
        $('#rubik-cube').off("touchend");
        $('#rubik-cube').off("touchmove");
        $('.cube-block').off("mousedown");
        $('body').off("mouseup");
        $('body').off("mousemove");
        $(window).off("mouseup");

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
            e.preventDefault();
        
        });
        
        $('#rubik-cube').on("touchend", function(e) {
            if(ppMousePressed === true) {
                ppMousePressed = false;
                rubicCubeStage.resetRotation();
                const rotationAngle = {x: 20,y:20, z:20};
                rubicCubeStage.rotate(rotationAngle);
                rubicCubeStage.draw();
                e.preventDefault();
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
                rotationAngle.z = -diffX;
                rotationAngle.y = diffY;
                rubicCubeStage.rotate(rotationAngle);
                rubicCubeStage.draw();
                console.info(diffX);
                originCoordinate.x = mouseX;
                originCoordinate.y = mouseY;
            }
        });


        var ppPoint = function(x, y)
        {
            this.x = x;
            this.y = y;
        }
        let blockMousePressed = false;
        let ppPointArray = new Array();
        $('.cube-block').mousedown(function(e)
        {
            if(e.which == 1)// 如果是左键
            {
                blockMousePressed = true;
                var mouseX = e.pageX - this.offsetLeft;
                var mouseY = e.pageY - this.offsetTop;
                ppPointArray.push(new ppPoint(mouseX, mouseY));

                $(e.target).mousemove(function(eve)
                {
                    if(blockMousePressed)
                    {
                        var mouseX = eve.pageX - this.offsetLeft;
                        var mouseY = eve.pageY - this.offsetTop;
                        ppDrawLine(mouseX, mouseY, eve.currentTarget.getContext("2d"));
                    }
                });

                $(window).mouseup(function(e){
                    blockMousePressed = false;
                    rubicCubeStage.draw();
                    $(e.target).off("mousemove");
                });
            }
        });

        $('.cube-block').on("touchstart",function(e)
        {
            var mouseX = e.originalEvent.changedTouches[0].pageX - this.offsetLeft;
            var mouseY = e.originalEvent.changedTouches[0].pageY - this.offsetTop;
            blockMousePressed = true;
            ppPointArray.push(new ppPoint(mouseX, mouseY));
            e.preventDefault();
            $(e.target).on("touchmove",function(eve)
            {
                if(blockMousePressed)
                {
                    var mouseX = eve.originalEvent.changedTouches[0].pageX- this.offsetLeft;
                    var mouseY = eve.originalEvent.changedTouches[0].pageY - this.offsetTop;
                    ppDrawLine(mouseX, mouseY, eve.currentTarget.getContext("2d"));
                }
            });

            $(window).mouseup(function(e){
                blockMousePressed = false;
                rubicCubeStage.draw();
                $(e.target).off("touchmove");
            });

        });

        
        
        function ppDrawLine(curX, curY, context)
        {
            const color = $('#penColor').val();
            context.strokeStyle = color;
            const width = $('#penWidth').val();
            context.lineWidth = parseInt(width);
            context.beginPath();
            var ppLastPoint = ppPointArray[ppPointArray.length - 1];
            context.moveTo(ppLastPoint.x, ppLastPoint.y);
            context.lineTo(curX, curY);
            context.closePath();
            context.stroke();
            ppPointArray.push(new ppPoint(curX, curY));
        }
    }
}

