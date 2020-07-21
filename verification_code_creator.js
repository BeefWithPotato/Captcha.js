"use strict";
const log = console.log
console.log('SlideStyleGenerator');

function SlideStyleGenerator(){
	this.curr_file = "";
	this.canvas = "";
	this.part = "";
	this.canvasWidth = "";
	this.canvasHeight = "";
	this.imgs = [];
	this.x="";
	this.y="";
	this.length="";
	this.imgData = "";
	this.pastX=0;
	this.pastY="";
}

SlideStyleGenerator.prototype = {

	createCanvas: function(width, height, type){


		const canvas = document.createElement("canvas");
		canvas.width = width;
		this.canvasWidth = width;
		canvas.height = height;
		this.canvasHeight = height;
		canvas.id = type;
		
		if(type === "canvas"){
			this.canvas = canvas;
		}
		else if(type === "part"){
			this.part = canvas;
			//canvas.style = "display: none";
			canvas.className = "part";
			this.initMouseEvent(canvas);
		}
		
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
		button.onclick = this.saveImage.bind(this);
		button.append(document.createTextNode("Upload"));

		form.append(button);
		return form;
	},

	saveImage: function(){
		log("saveImage");
		const file = document.querySelector("input[type=file]").files[0];
		this.imgs.push(file);
		this.curr_file = file;
	
		this.makeJigsaw(0, 0, 320, 200, 50);
		this.createBackground(0, 0, 320, 200);
	},

	getRandomNumber: function(x){
		return Math.round(Math.random() * (x / 2));
	},

	makeJigsaw: function(x, y, width, height, length){
		
		log("drawImageOnCanvas");
		const file = this.curr_file;
		const reader = new FileReader();
		reader.readAsDataURL(file);

		const partContext = this.part.getContext("2d");
		reader.onload = (event) =>{
			const img = new Image();
			img.onload = () => {
				
				const partX = this.getRandomNumber(this.canvasWidth) + (this.canvasWidth / 2) - length;
				const partY = this.getRandomNumber(this.canvasHeight) + (this.canvasHeight / 2) - length;

				this.x = partX;
				this.y = partY;
				this.length = length;
				
				partContext.rect(partX, partY, length, length);
				partContext.clip();
				partContext.drawImage(img, x, y, width, height);
				partContext.strokeStyle = "#FFFFF";
				partContext.stroke();
			};
  			img.src = event.target.result;
		}
	},

	createBackground: function(x, y, width, height, data){

		const file = this.curr_file;
		const reader = new FileReader();
		reader.readAsDataURL(file);

		const canvasContext = this.canvas.getContext("2d");
		const partContext = this.part.getContext("2d");
		reader.onload = (event) =>{
			const img = new Image();
			img.onload = () => {
				canvasContext.drawImage(img, x, y, width, height);
				canvasContext.clearRect(this.x, this.y, this.length, this.length);
				const imgData = partContext.getImageData(this.x, this.y, this.length, this.length);
				partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
				partContext.putImageData(imgData, 0, this.y);
				//partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

			};
  			img.src = event.target.result;
		}

	},

	initMouseEvent: function(canvas){
 
		

		canvas.onmousedown = (e) => {
			const partContext = canvas.getContext("2d");
			
			let imgData = partContext.getImageData(this.pastX, this.y, this.length, this.length);
			log(e.clientX)
			canvas.onmousemove = (e) => {
				let x = e.clientX;

				//clear the canvas(I don't know why clearRect() doesn't work here, so I change the height of
				//the canvas to force it to clear.)
				canvas.height = canvas.height;
				
				if(x + 25 > this.canvasWidth){
					x = this.canvasWidth - 25;
				}
				else if(x - 25 < 0){
					x = 0 + 25;
				}

            	partContext.putImageData(imgData, x-25, this.y);
            	this.pastX = x-25;
            	imgData = partContext.getImageData(this.pastX, this.y, this.length, this.length);
			};

			canvas.onmouseup = function(e){

            	canvas.onmousemove = null;
            	canvas.onmouseup = null;
        	};
		}

	}
		

};

var ex = new SlideStyleGenerator();
const body = document.querySelector('body');
const canvas = ex.createCanvas(320, 200, "canvas");
const block = ex.createCanvas(320, 200, "part");
body.append(ex.createInputBox());
body.append(canvas);
body.append(block);
