'use strict';
const log = console.log

//by user
const uploadedImg = [];
const ex1 = new SlideStyleGenerator();
ex1.imgs = uploadedImg;
const uploadEx = document.querySelector('#by-user');
const canvas = ex1.createCanvas(320, 200, "canvas1", "background");
const block = ex1.createCanvas(320, 200, "part1", "jigsaw");
uploadEx.append(canvas);
uploadEx.append(block);

// default
const defaultImg = [];
setDefaultImgs();
const ex2 = new SlideStyleGenerator();
ex2.srcs = defaultImg;
const defaultEx = document.querySelector('#by-developer');
const canvas2 = ex2.createCanvas(320, 200, "canvas2", "background");
const block2 = ex2.createCanvas(320, 200, "part2", "jigsaw");
defaultEx.append(canvas2);
defaultEx.append(block2);
ex2.makeJigsaw(0, 0, 320, 200, 50, "src");

// // Text style
// const ex3 = new TextEnterGenerator();
// const textEx = document.querySelector('#text');
// const canvas = ex3.createCanvas(300, 120, "canvas");
// const canvasA = ex3.createCanvas(300, 120, "canvasA");
// ex3.canvasA = canvasA;
// textEx.append(canvas);
// textEx.append(canvasA);
// ex3.createCode(canvas, 4);
// ex3.drawRandomLines(canvas, 20, 1);
// ex3.addDots(20, 2, 1);
// ex3.drawRandomDotsWithAnimation(canvasA);

function saveImages(){
		log("saveImage");
		const files = document.querySelector("input[type=file]").files;

		Array.prototype.forEach.call(files, (file) => {
		   uploadedImg.push(file);
		});
		
		canvas.height = canvas.height;
		block.height = block.height;
		// const canvasContext = canvas.getContext("2d");
		// canvasContext.clearRect(0,0,320, 200);
		// const blockContext = block.getContext("2d");
		// blockContext.clearRect(0,0,320, 200);
		ex1.pastX = 0;
		ex1.pastY = 0;
		ex1.makeJigsaw(0, 0, 320, 200, 50, "file");
}

function setDefaultImgs(){
	const imga = document.querySelector('#imga');
	const imgb = document.querySelector('#imgb');
	const imgc = document.querySelector('#imgc');

	defaultImg.push(imga.src);
	defaultImg.push(imgb.src);
	defaultImg.push(imgc.src);
}

function resetDefault(){

	canvas2.height = canvas2.height;
	block2.height = block2.height;
	ex2.pastX = 0;
	ex2.makeJigsaw(0, 0, 320, 200, 50, "src");

}

function resetUpload(){

	if(uploadedImg.length === 0){
		alert("Please upload images first!");
	}
	else{
		
		canvas.height = canvas.height;
		block.height = block.height;

		ex1.pastX = 0;
		ex1.makeJigsaw(0, 0, 320, 200, 50, "file");
	}
}