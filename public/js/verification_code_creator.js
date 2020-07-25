"use strict";
console.log('SlideStyleGenerator');

function SlideStyleGenerator(){
	this.curr_file = "";
	this.canvas = "";
	this.part = "";
	this.canvasWidth = "";
	this.canvasHeight = "";
	this.imgs = [];
	this.length = "";
	this.pastX = 0;
	this.trailY = [];
	this.srcs = [];
	this.curr_src = "";
	this.imgData="";
}

SlideStyleGenerator.prototype = {

	createCanvas: function(width, height, name, type){


		const canvas = document.createElement("canvas");
		canvas.width = width;
		this.canvasWidth = width;
		canvas.height = height;
		this.canvasHeight = height;
		canvas.id = name;
		
		if(type === "canvas"){
			this.canvas = canvas;
			canvas.className = name;
		}
		else if(type === "part"){
			this.part = canvas;
			//canvas.style = "display: none";
			canvas.className = name;
		}
		
		return canvas;
		
	},

	getRandomNumber: function(x){
		return Math.round(Math.random() * x);
	},

	makeJigsaw: function(x, y, width, height, length, type){
		
		log("drawImageOnCanvas");
		const partContext = this.part.getContext("2d");

		if(type === "file"){
			const file = this.imgs[this.getRandomNumber(this.imgs.length-1)];
			this.curr_file = file;
			const reader = new FileReader();
			reader.readAsDataURL(file);
			
			reader.onload = (event) =>{
				const img = new Image();
				img.onload = () => {
					
					const partX = this.getRandomNumber(this.canvasWidth / 2) + (this.canvasWidth / 2) - length;
					const partY = this.getRandomNumber(this.canvasHeight / 2) + (this.canvasHeight / 2) - length;

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
			this.createBackground(x, y, width, height, type);
		}
		else if(type === "src"){
			const src = this.srcs[this.getRandomNumber(this.srcs.length-1)];
			this.curr_src = src;
			
			const img = new Image();
			img.onload = () => {
					
				const partX = this.getRandomNumber(this.canvasWidth / 2) + (this.canvasWidth / 2) - length;
				const partY = this.getRandomNumber(this.canvasHeight / 2) + (this.canvasHeight / 2) - length;

				this.x = partX;
				this.y = partY;
				this.length = length;
					
				partContext.rect(partX, partY, length, length);
				partContext.clip();
				partContext.drawImage(img, x, y, width, height);
				partContext.strokeStyle = "#FFFFF";
				partContext.stroke();
				this.imgData = partContext.getImageData(this.x, this.y, this.length, this.length);
			};
	  		img.src = src;
			
			this.createBackground(x, y, width, height, type);
		}
	},

	createBackground: function(x, y, width, height, type){

		const canvasContext = this.canvas.getContext("2d");
		const partContext = this.part.getContext("2d");

		if(type === "file"){
			const file = this.curr_file;
			const reader = new FileReader();
			reader.readAsDataURL(file);

			
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
			this.initMouseEvent(this.part, type);
		}
		else if(type === "src"){

			//const canvasContext = this.canvas.getContext("2d");
			//const partContext = this.part.getContext("2d");
			
			const img = new Image();
			img.onload = () => {
				canvasContext.drawImage(img, x, y, width, height);
				canvasContext.clearRect(this.x, this.y, this.length, this.length);
				try{
					const imgData = partContext.getImageData(this.x, this.y, this.length, this.length);
					partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
					partContext.putImageData(imgData, 0, this.y);
					//partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
				}
				catch(e){
					partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
					partContext.putImageData(this.imgData, 0, this.y);
				}

			};
	  		img.src = this.curr_src;
			
			this.initMouseEvent(this.part, type);
		}

	},

	initMouseEvent: function(canvas, type){

		canvas.onmousedown = (e) => {
			const partContext = canvas.getContext("2d");
			//const backgroundContext = background.
			let imgData = partContext.getImageData(this.pastX, this.y, this.length, this.length);
			//log(e.clientX)

			canvas.onmousemove = (e) => {
				let x = e.clientX;
				const y = e.clientY;

				//records y-axis changes when moving and use the data to verify if user is a machine
				this.trailY.push(y);

				//clear the canvas (I don't know why clearRect() doesn't work here, so I change the height of
				//the canvas to force it to clear.)
				canvas.height = canvas.height;
				
				//x can only move in the canvas so does jigsaw part
				if(x + 25 > this.canvasWidth){
					x = this.canvasWidth - 25;
				}
				else if(x - 25 < 0){
					x = 0 + 25;
				}

            	partContext.putImageData(imgData, x-25, this.y);
            	this.pastX = x-25;
            	//this.verifyResult(this.pastX, canvas);
            	imgData = partContext.getImageData(this.pastX, this.y, this.length, this.length);

            	canvas.onmouseup = (e) => {
					canvas.onmousemove = null;
	            	canvas.onmouseup = null;
					if(Math.abs(e.clientX - 25 - this.x) <= 10){

						const sum = this.trailY.reduce((a, b) => {
						    return a + b;
						});

						const average = sum / this.trailY.length;

						const deviations = this.trailY.map((x) => {
							return (x - average) ^ 2;
						});

						const sumD = deviations.reduce((a, b) => {
						    return a + b;
						});

						const standardDeviation = Math.sqrt(sumD / (this.trailY.length - 1));
						log(standardDeviation);

						if(standardDeviation !== 0){
							alert("Success");
							canvas.onmousemove = null;
			            	canvas.onmouseup = null;
			            	canvas.onmousedown = null;
							return true;
						}
						else{
							alert("Failed");
							canvas.onmousemove = null;
			            	canvas.onmouseup = null;
			            	canvas.onmousedown = null;
							return false;
						}

					}
					else{
						alert("Failed. Please try again!");
						canvas.onmousemove = null;
			            canvas.onmouseup = null;
			            canvas.onmousedown = null;

			            const background = this.canvas.getContext("2d");
						background.clearRect(0,0,this.canvasWidth, this.canvasHeight);
						const part = canvas.getContext("2d");
						part.clearRect(0,0,this.canvasWidth, this.canvasHeight);

						this.pastX = 0;
						if(type === "file"){
							this.makeJigsaw(0, 0, 320, 200, 50, "file");
						}
						else if(type === "src"){
							this.makeJigsaw(0, 0, 320, 200, 50, "src");
						}
							
					}
				};
			};
		}
	},


};

// var ex = new SlideStyleGenerator();
// const body = document.querySelector('body');
// const canvas = ex.createCanvas(320, 200, "canvas");
// const block = ex.createCanvas(320, 200, "part");
//body.append(ex.createInputBox());
// body.append(canvas);
// body.append(block);
