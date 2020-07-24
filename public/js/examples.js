'use strict';
const log = console.log

const uploadedImg = [];
//createInputBox();

const ex1 = new SlideStyleGenerator();
ex1.imgs = uploadedImg;
const uploadEx = document.querySelector('#by-user');
const canvas = ex1.createCanvas(320, 200, "canvas1", "canvas");
const block = ex1.createCanvas(320, 200, "part1", "part");
uploadEx.append(canvas);
uploadEx.append(block);


const defaultImg = [];
setDefaultImgs();

const ex2 = new SlideStyleGenerator();
ex2.srcs = defaultImg;
const defaultEx = document.querySelector('#by-developer');
const canvas2 = ex2.createCanvas(320, 200, "canvas2", "canvas");
const block2 = ex2.createCanvas(320, 200, "part2", "part");
defaultEx.append(canvas2);
defaultEx.append(block2);
ex2.makeJigsaw(0, 0, 320, 200, 50, "src");


function saveImages(){
		log("saveImage");
		const files = document.querySelector("input[type=file]").files;

		Array.prototype.forEach.call(files, (file) => {
		   uploadedImg.push(file);
		});
		

		ex1.pastX = 0;
		ex1.makeJigsaw(0, 0, 320, 200, 50, "file");

		const h4 = document.createElement("h4");
		h4.className = "h4"
		h4.append(document.createTextNode("Now please select the jigsaw block on the left and drag it to the correct position of the background."));
		uploadEx.append(h4);
}

function setDefaultImgs(){
	const imga = document.querySelector('#imga');
	//const imgb = document.querySelector('#imgb');
	//const imgc = document.querySelector('#imgc');

	defaultImg.push(imga.src);
	//defaultImg.push(imgb.src);
	//defaultImg.push(imgc.src);
}