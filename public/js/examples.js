'use strict';
const log = console.log

const uploadedImg = [];
const ex1 = new SlideStyleGenerator();
ex1.imgs = uploadedImg;
const uploadEx = document.querySelector('#by-user');
const canvas = ex1.createCanvas(320, 200, "canvas1", "background");
const block = ex1.createCanvas(320, 200, "part1", "jigsaw");
uploadEx.append(canvas);
uploadEx.append(block);


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
// const button = document.createElement("button");
// button.type = "button";
// button.onclick = resetDefault();
// button.append(document.createTextNode("Reset"));
// defaultEx.append(button);


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
	//const canvas = canvas2.getContext("2d");
	//canvas.clearRect(0,0,320, 200);
	//const block = block2.getContext("2d");
	//block.clearRect(0,0,320, 200);
	ex2.pastX = 0;
	ex2.makeJigsaw(0, 0, 320, 200, 50, "src");

}

function resetUpload(){

	if(uploadedImg.length === 0){
		alert("Please upload images first!");
	}
	else{
		//const canvas1 = canvas.getContext("2d");
		//canvas1.clearRect(0,0,320, 200);
		canvas.height = canvas.height;
		block.height = block.height;
		//const block1 = block.getContext("2d");
		//block1.clearRect(0,0,320, 200);

		ex1.pastX = 0;
		ex1.makeJigsaw(0, 0, 320, 200, 50, "file");
	}
}