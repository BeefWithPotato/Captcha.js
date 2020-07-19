"use strict";
const log = console.log
console.log('SlideStyleGenerator');

function SlideStyleGenerator(){
	this.curr_img = new Image();
	this.imgWidth = 220;
	this.imgHeight = 200;
	this.imgs = [];
}

SlideStyleGenerator.prototype = {

	createCanvas: function(width, height){
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		return canvas;
		
	},

	createInputBox: function(){
		const form = document.createElement("form");
		form.id = "uploadImage";
		const input = document.createElement("input");
		input.className = "slide-input";
		input.id = "img-upload";
		input.type = "file";
		input.accept = "image/*";
		input.multiple = "multiple";
		form.append(input);

		const button = document.createElement("button");
		button.type = "button";
		button.onclick = this.drawImageOnCanvas.bind(this);
		button.append(document.createTextNode("Upload"));

		form.append(button);
		return form;
	},

	drawImageOnCanvas: function(){
		
		log("drawImageOnCanvas");
		const file = document.querySelector("input[type=file]").files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (event) =>{
			const img = new Image();
			img.onload = ()=>{
				const canvasContext = canvas.getContext("2d");
				canvasContext.drawImage(img, 0, 0, 320, 200);
			}
  			img.src = event.target.result;
			this.curr_img = img;
			this.imgs.push(img);
		}
	}



};

var ex = new SlideStyleGenerator();
const body = document.querySelector('body');
const canvas = ex.createCanvas(700, 300);
body.append(ex.createInputBox(canvas));
body.append(canvas);


//ex.drawImageOnCanvas(ex.curr_img);