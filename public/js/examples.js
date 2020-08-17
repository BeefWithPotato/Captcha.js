'use strict';
const log = console.log

// default
const defaultImg = [];
setDefaultImgs();
const ex1 = new SlideStyleGenerator();
ex1.srcs = defaultImg;
ex1.Yerror = 200;
const defaultEx = document.querySelector('#by-developer');
const canvas = ex1.createCanvas(320, 200, "canvas1", "background");
const block = ex1.createCanvas(320, 200, "part1", "jigsaw");
defaultEx.append(canvas);
defaultEx.append(block);
//ex1.makeJigsaw(0, 0, 320, 200, 50, "src");


//by user
const uploadedImg = [];
const ex2 = new SlideStyleGenerator();
ex2.imgs = uploadedImg;
ex2.Yerror = 534;
const uploadEx = document.querySelector('#upload');
const canvas2 = ex2.createCanvas(320, 200, "canvas2", "background");
const block2 = ex2.createCanvas(320, 200, "part2", "jigsaw");
uploadEx.append(canvas2);
uploadEx.append(block2);

// Text style
const ex3 = new TextEnterGenerator();
const textEx = document.querySelector('#text');
const canvas3 = ex3.createCanvas(300, 120, "canvas3");
const canvasA = ex3.createCanvas(300, 120, "canvasA");
ex3.canvasA = canvasA;
textEx.append(canvas3);
textEx.append(canvasA);
ex3.createCode(canvas3, 4);
ex3.drawRandomLines(canvas3, 20, 1);
ex3.addDots(20, 2, 1);
ex3.drawRandomDotsWithAnimation(canvasA);

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
		ex2.pastX = 0;
		ex2.pastY = 0;
		ex2.makeJigsaw(0, 0, 320, 200, 50, "file");
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

	canvas.height = canvas.height;
	block.height = block.height;
	ex1.pastX = 0;
	ex1.makeJigsaw(0, 0, 320, 200, 50, "src");

}

function resetUpload(){

	if(uploadedImg.length === 0){
		alert("Please upload images first!");
	}
	else{
		
		canvas2.height = canvas2.height;
		block2.height = block2.height;

		ex2.pastX = 0;
		ex2.makeJigsaw(0, 0, 320, 200, 50, "file");
	}
}

function resetText(){

	canvas.height = canvas.height;
	block.height = block.height;
	ex1.pastX = 0;
	//ex1.makeJigsaw(0, 0, 320, 200, 50, "src");

}