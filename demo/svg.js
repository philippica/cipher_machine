class Pen {
    constructor(penId, stageId, svgId) {
        this.stageId = stageId?stageId:"#stage";
        svgId = svgId?svgId:"#stage-svg";
        this.pathId = penId;
        this.markIndex = 0;
        this.markList = [];
        this.path = [];
        this.isDrag = false;
        this.selectedMarkIndex = -1;
        this.deletedCound = 0;
        this.svg = svgId;
        this.bindStageEvent();

        g_keySubscription.push([46, this.deleteMark.bind(this)])
    }

    bindStageEvent() {
        $(this.stageId).on("mousedown", (e) => {
            if(e.which !== 1)return;
            this.onStageClick(e);
        });
    }

    onStageClick(e) {
        if(this.isDrag)return;
        e.stopPropagation();
        const x = e.clientX;
        const y = e.clientY;
        $("#stage").append(`<div class='mark' id="mark-${this.markIndex+this.deletedCound}" style='left: ${x-1.5}px; top: ${y-1.5}px;' data-index="${this.markIndex}""></div>`);
        $(`#mark-${this.markIndex+this.deletedCound}`).on("mousedown", (e)=>{e.stopPropagation();this.onMarkClick(e);});
        const ele = $(`#mark-${this.markIndex+this.deletedCound}`);

        this.markList.push(ele);
        this.selectedMark(this.markIndex);
        this.svgMoveTo(e.offsetX, e.offsetY, this.markIndex);
        this.markIndex++;
        this.refreshSvg();
    }

    onMarkClick(e) {
        e.stopPropagation();
        let index = $(e.target).index()-1;
        if(index >= this.markIndex)index=undefined;
        if(index !== undefined) {
            this.selectedMark(index);
            this.refreshSvg();
        }
        let mouseState = 0;
        this.isDrag = true;
        let isMoved = false;
        const mark = $(e.target);
        $(window).off("mouseup");
        $(window).off("mousemove");
        $(window).on("mouseup", (mouseEvent) => {
            this.isDrag = false;
            mouseState = 1;

            $(window).off("mousemove");
            $(window).off("mouseup");
            if(isMoved===false) {
                if(this.selectedMarkIndex !== 0) {
                    this.renderControlPoint();
                }
                return;
            }
            if(index !== undefined) {
                if(this.path[index][0] === 'C') {
                    this.path[index] = `L${mouseEvent.clientX+1.5} ${mouseEvent.clientY+1.5}`;
                } else {
                    this.path[index] = `${this.path[index][0]}${mouseEvent.clientX+1.5} ${mouseEvent.clientY+1.5}`;
                }
                // this.refreshSvg();
            } else {
                const x1 = parseInt($($(".round")[1]).offset().left);
                const y1 = parseInt($($(".round")[1]).offset().top);
                const x2 = parseInt($($(".round")[0]).offset().left);
                const y2 = parseInt($($(".round")[0]).offset().top);
                const end = this.path[this.selectedMarkIndex].substr(1).split(" ");
                const x3 = parseInt(end[end.length-2]);
                const y3 = parseInt(end[end.length-1]);
                this.path[this.selectedMarkIndex] = `C${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
            }
            this.refreshSvg();
        });

        $(window).on("mousemove", (mouseEvent) => {
            if(mouseState === 1)return;
            isMoved = true;
            const x = mouseEvent.clientX;
            const y = mouseEvent.clientY;
            mark.css("left", x);
            mark.css("top", y);
        });
    }

    svgMoveTo(x, y, index) {
        if(index === 0) {
            let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            $(this.svg).append(`<path id="path-${this.pathId}" d="M${x} ${y}" stroke="black" fill="transparent"/>`);
            this.path.push(`M${x} ${y}`);
            return;
        }
        this.path.push(`L${x} ${y}`);
    } 

    unSelectedMark(markIndex) {
        if(markIndex < 0)return;
        const ele = this.markList[markIndex];
        ele.css("border", "1px solid");
        ele.css("color", "black");
    }

    selectedMark(markIndex) {
        if(markIndex<0)return;
        this.unSelectedMark(this.selectedMarkIndex);
        this.selectedMarkIndex = markIndex;
        const ele = this.markList[markIndex];
        ele.css("border", "1.5px solid");
        ele.css("color", "blue");
    }

    refreshSvg() {
        this.addHelpLine();
        const path = $(`#path-${this.pathId}`);
        path.attr("d", this.path.join(" "));
        if(this.selectedMarkIndex !== 0) {
            this.renderControlPoint();
        }
        $("#stage-svg").parent().html($("#stage-svg").parent().html())
    }

    addHelpLine() {
        if(this.path.length === 0)return;
        $("#help-line").remove();
        if($(".round").length === 0)return;
        const cur = this.path[this.selectedMarkIndex];
        if(cur[0] != "C")return;
        const curList = this.path[this.selectedMarkIndex].substr(1).split(' ').map((x)=>parseInt(x));
        const lastList = this.path[this.selectedMarkIndex-1].substr(1).split(' ').map((x)=>parseInt(x));
        const len = lastList.length;

        const line = `M${curList[4]} ${curList[5]} L${curList[2]} ${curList[3]} L${curList[0]} ${curList[1]} L${lastList[len-2]} ${lastList[len-1]}`;
        $(this.svg).append(`<path id="help-line" d="${line}" stroke="black" fill="transparent" stroke-dasharray="10 5" opacity=".3"/>`);
    }

    renderControlPoint() {
        $('.round').remove();
        const list = this.path[this.selectedMarkIndex].substr(1).split(' ').map((x)=>parseInt(x));
        const lastList = this.path[this.selectedMarkIndex-1].substr(1).split(' ').map((x)=>parseInt(x));
        if(this.path[this.selectedMarkIndex][0] === 'L') {
            const cur = this.path[this.selectedMarkIndex].split(' ');
            const last = this.path[this.selectedMarkIndex-1].split(' ');
            let x = (list[0] + (lastList[lastList.length-2] - list[0])/3); 
            let y = (list[1] + (lastList[lastList.length-1] - list[1])/3);
            $("#stage").append(`<div class='mark round' style='left: ${x-2}px; top: ${y-2}px;'></div>`);
            x = (list[0] + 2*(lastList[lastList.length-2] - list[0])/3); 
            y = (list[1] + 2*(lastList[lastList.length-1] - list[1])/3);
            $("#stage").append(`<div class='mark round' style='left: ${x-2}px; top: ${y-2}px;'></div>`);
        } else {
            const list = this.path[this.selectedMarkIndex].substr(1).split(' ').map((x)=>parseInt(x));
            $("#stage").append(`<div class='mark round' style='left: ${list[2]-2}px; top: ${list[3]-2}px;'></div>`);
            $("#stage").append(`<div class='mark round' style='left: ${list[0]-2}px; top: ${list[1]-2}px;'></div>`);
            console.info(list);
        }
        $(".mark").off("mousedown");
        $(".mark").on("mousedown", (e)=>{e.stopPropagation();this.onMarkClick(e);});
    }

    disappearMarks() {
        $(".mark").css("display", none);
    }

    deleteMark(e) {
        if(this.selectedMarkIndex < 0)return;
        console.info(e);
        const lastSelected = this.selectedMarkIndex;
        this.markList[this.selectedMarkIndex].css("display", "none");
        this.path[this.selectedMarkIndex] = "";
        this.selectedMarkIndex = this.markIndex-1;
        this.refreshSvg();

        this.markList[lastSelected].remove();
        this.markList.splice(lastSelected, 1);
        this.path.splice(lastSelected, 1);
        this.selectedMarkIndex--;
        this.markIndex--;
        this.deletedCound++;
        this.selectedMark(this.selectedMarkIndex);
    }
    show() {

    }
    disappar() {

    }
    focus() {

    }
    unfocus() {
        $(this.stageId).off("mousedown");
        $(".mark").css("display", "none");
        this.selectedMarkIndex = 0;
        this.refreshSvg();
    }
}