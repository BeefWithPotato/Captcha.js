"use strict";
console.log('VerifyCode.js');

//Browser compatibility setting
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
	        window.webkitRequestAnimationFrame ||
	        window.mozRequestAnimationFrame    ||
	        function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	        };
})();

(function(global){
	function SlideStyleGenerator(){
		this.curr_file = "";
		this.canvas = "";
		this.part = "";
		this.canvasWidth = "";
		this.canvasHeight = "";
		this.imgs = [];
		this.length = "";
		this.trailX = [];
		this.trailY = [];
		this.srcs = [];
		this.curr_src = "";
		this.verticalOrHorizontal = "";
		this.imgData = "";
		this.resultErrorRange = 5;
	}

	SlideStyleGenerator.prototype = {

		//Create canvas. It will return the canvas DOM element
		createCanvas: function(width, height, name, type){
			const canvas = document.createElement("canvas");
			canvas.width = width;
			this.canvasWidth = width;
			canvas.height = height;
			this.canvasHeight = height;
			canvas.id = name;
			
			if(type === "background"){
				this.canvas = canvas;
				canvas.className = name;
			}
			else if(type === "jigsaw"){
				this.part = canvas;
				canvas.className = name;
			}
			return canvas;
		},

		getRandomNumber: function(x){
			return Math.round(Math.random() * x);
		},

		//Set the slider direction
		setDirection: function(vOrH){
	    	this.verticalOrHorizontal = vOrH;
	    },

	    //Set the image urls list for default backgrounds' pool
	    setSrcs: function(list){
	    	this.srcs = list;	
	    },

	    //Set the image files' list for user-customize backgrounds' pool
	    setImgs: function(list){
	    	this.imgs = list;	
	    },

	    //Set the accuracy when verifying final jigsaw positions' coordinates
	    setResultError: function(x){
	    	this.resultErrorRange = x;
	    },

	    //Make the jigsaw by using given length in canvas
		makeJigsaw: function(length, type){
			
			//choose a direction of canvas if this.verticalOrHorizontal is empty
			let direction = null;
			if(this.verticalOrHorizontal === ""){
				const num = Math.floor(Math.random() * 2);
				direction = ["vertical", "horizontal"][num];
				console.log(direction)
			}
			else{
				direction = this.verticalOrHorizontal;
			}

			const partContext = this.part.getContext("2d");
			//if we use image file directly
			if(type === "file"){
				const file = this.imgs[this.getRandomNumber(this.imgs.length-1)];
				this.curr_file = file;
				const reader = new FileReader();
				reader.readAsDataURL(file);
				
				reader.onload = (event) =>{
					const img = new Image();
					img.onload = () => {
						
						let partX = null;
						let partY = null;
						if(direction === "horizontal"){
							this.verticalOrHorizontal = "horizontal";
							//get jigsaw x and y position
							//we don't want jigsaw's dimension is out of canvas margin, so -length
							//we want the jigsaw in the left half of canvas so +(this.canvasWidth / 2)
							partX = this.getRandomNumber(this.canvasWidth / 2) + (this.canvasWidth / 2) - length;
							partY = this.getRandomNumber(this.canvasHeight / 2) + (this.canvasHeight / 2) - length;
						}
						else{
							this.verticalOrHorizontal = "vertical";
							//get jigsaw x and y position
							//we don't want jigsaw's dimension is out of canvas margin, so -length
							partX = this.getRandomNumber(this.canvasWidth) - length;
							partY = this.getRandomNumber(this.canvasHeight / 2);
							if(partY + this.length > this.canvasHeight / 2){
								partY = this.canvasHeight / 2 - this.length;
							}
							if(partX < 0){
								partX = 0;
							}
						}
						this.x = partX;
						this.y = partY;
						this.length = length;
						//clear the rest of canvas except for jigsaw
						partContext.rect(partX, partY, length, length);
						partContext.clip();
						partContext.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
						partContext.strokeStyle = "#FFFFF";
						partContext.stroke();
					}
		  			img.src = event.target.result;
				}
			}
			//if we use urls to load images
			else if(type === "src"){
				const src = this.srcs[this.getRandomNumber(this.srcs.length-1)];
				this.curr_src = src;
				
				const img = new Image();
				img.onload = () => {
						
					let partX = null;
					let partY = null;
					if(direction === "horizontal"){
						this.verticalOrHorizontal = "horizontal";
						//get jigsaw x and y position
						//we don't want jigsaw's dimension is out of canvas margin, so -length
						//we want the jigsaw in the left half of canvas so +(this.canvasWidth / 2)
						partX = this.getRandomNumber(this.canvasWidth / 2) + (this.canvasWidth / 2) - length;
						partY = this.getRandomNumber(this.canvasHeight / 2) + (this.canvasHeight / 2) - length;
					}
					else{
						this.verticalOrHorizontal = "vertical";
						//get jigsaw x and y position
						//we don't want jigsaw's dimension is out of canvas margin, so -length
						partX = this.getRandomNumber(this.canvasWidth) - length;
						partY = this.getRandomNumber(this.canvasHeight / 2);
						if(partY + this.length > this.canvasHeight / 2){
							partY = this.canvasHeight / 2 - this.length;
						}
						if(partX < 0){
							partX = 0;
						}
					}
					this.x = partX;
					this.y = partY;
					this.length = length;
					//clear the rest of canvas except for jigsaw
					partContext.rect(partX, partY, length, length);
					partContext.clip();
					partContext.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
					partContext.strokeStyle = "#FFFFF";
					partContext.stroke();
				}
		  		img.src = src;
			}
		},

		createBackground: function(type){

			const canvasContext = this.canvas.getContext("2d");
			const partContext = this.part.getContext("2d");
			//if we use image file directly
			if(type === "file"){
				const file = this.curr_file;
				const reader = new FileReader();
				reader.readAsDataURL(file);

				reader.onload = (event) =>{
					const img = new Image();
					img.onload = () => {
						//draw the full image in canvas
						canvasContext.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
						canvasContext.clearRect(this.x, this.y, this.length, this.length);

						if(this.verticalOrHorizontal === "horizontal"){
							try{
								//put the jigsaw in the left of canvas
								//y will not change
								const imgData = partContext.getImageData(this.x, this.y, this.length, this.length);
								this.imgData = imgData;
								partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
								partContext.putImageData(imgData, 0, this.y);
							}
							catch(e){
								this.createBackground("file");
							}
						}
						else{
							try{
								//put the jigsaw in the bottom of canvas
								//x will not change
								const imgData = partContext.getImageData(this.x, this.y, this.length, this.length);
								this.imgData = imgData;
								partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
								partContext.putImageData(imgData, this.x, this.canvasHeight - this.length);
							}
							catch(e){
								this.createBackground("file");
							}
						}
					}
		  			img.src = event.target.result;
				}
				this.initMouseEvent(this.part, type);
				
			}
			//if we use urls to load images
			else if(type === "src"){
				
				const img = new Image();
				img.onload = () => {
					//draw the full image in canvas
					canvasContext.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
					canvasContext.clearRect(this.x, this.y, this.length, this.length);

					if(this.verticalOrHorizontal === "horizontal"){
						try{
							//put the jigsaw in the left of canvas
							//y will not change
							const imgData = partContext.getImageData(this.x, this.y, this.length, this.length);
							this.imgData = imgData;
							partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
							partContext.putImageData(imgData, 0, this.y);
						}
						catch(e){
							this.createBackground("src");
						}
					}
					else{
						try{
							//put the jigsaw in the bottom of canvas
							//x will not change
							const imgData = partContext.getImageData(this.x, this.y, this.length, this.length);
							this.imgData = imgData;
							partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
							partContext.putImageData(imgData, this.x, this.canvasHeight - this.length);
						}
						catch(e){
							this.createBackground("src");
						}
					}
				}
		  		img.src = this.curr_src;
				
				this.initMouseEvent(this.part, type);
			}
		},

		//calculate standard deviation of given data list
		//if the standard deviation = 0, then the user is a bot, return false
		//will return true if standard deviation != 0
		checkStandardDeviation: function(dataList){
			const sum = dataList.reduce((a, b) => {
				return a + b;
			});

			const average = sum / dataList.length;

			const deviations = dataList.map((x) => {
					return (x - average) ^ 2;
			});

			const sumD = deviations.reduce((a, b) => {
				return a + b;
			});

			const standardDeviation = Math.sqrt(sumD / dataList.length);

			if(standardDeviation !== 0){
				return true;
			}
			else{
				return false;
			}
		},

		initMouseEvent: function(canvas, type){

			canvas.onmousedown = (e) => {
				const partContext = canvas.getContext("2d");
				let imgData;
				canvas.onmousemove = (e) => {
					
					if(this.verticalOrHorizontal === "horizontal"){
						//make sure x, y is the position in canvas not in the whole web page
						let x = e.clientX - canvas.getBoundingClientRect().left;
						const y = e.clientY - canvas.getBoundingClientRect().top;
						imgData = this.imgData;
						//records y-axis changes when moving and use the data to verify if user is a machine
						this.trailY.push(y);

						//clear the canvas (I don't know why clearRect() doesn't work here, so I change the height of
						//the canvas to force it to clear.)
						canvas.height = canvas.height;
								
						//jigsaw can only move in the canvas
						if(x + this.length/2 > this.canvasWidth){
							x = this.canvasWidth - this.length/2;
						}
						else if(x - this.length/2 < 0){
							x = 0 + this.length/2;
						}
						//put jigsaw to the new mouse position
						partContext.putImageData(imgData, x - this.length/2, this.y);
					}
				        
				    else if(this.verticalOrHorizontal === "vertical"){
				    	//make sure x, y is the position in canvas not in the whole web page
				    	const x = e.clientX - canvas.getBoundingClientRect().left;
						let y = e.clientY - canvas.getBoundingClientRect().top;
				    	imgData = this.imgData;

				        //records y-axis changes when moving and use the data to verify if user is a machine
						this.trailX.push(x);

						//clear the canvas (I don't know why clearRect() doesn't work here, so I change the height of
						//the canvas to force it to clear.)
						canvas.height = canvas.height;

						//jigsaw can only move in the canvas
						if(y + this.length/2 > this.canvasHeight){
							y = this.canvasHeight - this.length/2;
						}
						else if(y - this.length/2 < 0){
							y = 0 + this.length/2;
						}
						//put jigsaw to the new mouse position
				        partContext.putImageData(imgData, this.x, y - this.length/2);
				    }	
				
					canvas.onmouseup = (e) => {
						canvas.onmousemove = null;
					    canvas.onmouseup = null;

					    //make sure x, y is the position in canvas not in the whole web page
					    const x = e.clientX - canvas.getBoundingClientRect().left;
						const y = e.clientY - canvas.getBoundingClientRect().top;

						if(this.verticalOrHorizontal === "horizontal"){
							//check if the jigsaw in the correct position
							//allow small error
							if(Math.abs(x - this.length/2 - this.x) <= this.resultErrorRange){
								if(this.checkStandardDeviation(this.trailY)){
									alert("Success!");
								}
								else{
									alert("You are a bot!");
								}
							}
							else{
								alert("Failed. Please try again!");
								canvas.onmousemove = null;
								canvas.onmouseup = null;
								canvas.onmousedown = null;

								//clear canvas
								const background = this.canvas.getContext("2d");
								background.clearRect(0,0,this.canvasWidth, this.canvasHeight);
								const part = canvas.getContext("2d");
								part.clearRect(0,0,this.canvasWidth, this.canvasHeight);

								// make jigsaw again using the current setting
								if(type === "file"){
									this.makeJigsaw(this.length, "file");
									this.createBackground("file");
								}
								else if(type === "src"){
									this.makeJigsaw(this.length, "src");
									this.createBackground("src");
								}			
							}
						}
						if(this.verticalOrHorizontal === "vertical"){
							//check if the jigsaw in the correct position
							//allow small error
							if(Math.abs(y - this.length/2 - this.y) <= this.resultErrorRange){
								if(this.checkStandardDeviation(this.trailX)){
									alert("Success!");
								}
								else{
									alert("You are a bot!");
								}
							}
							else{
								alert("Failed. Please try again!");
								canvas.onmousemove = null;
								canvas.onmouseup = null;
								canvas.onmousedown = null;

								//clear canvas
								const background = this.canvas.getContext("2d");
								background.clearRect(0,0,this.canvasWidth, this.canvasHeight);
								const part = canvas.getContext("2d");
								part.clearRect(0,0,this.canvasWidth, this.canvasHeight);

								// make jigsaw again using the current setting
								if(type === "file"){
									this.makeJigsaw(this.length, "file");
									this.createBackground("file");
								}
								else if(type === "src"){
									this.makeJigsaw(this.length, "src");
									this.createBackground("src");
								}			
							}
						}
					}
				}
			}
		},

	};

	//dot object
	function Dot(){
		this.x = "";
		this.y = "";
		this.color = "";
		this.speedX = "";
		this.speedY = "";
	}

	function TextEnterGenerator(){
		this.nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
		this.letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
		this.font = "bold 40pt serif";
		this.angle = 10;
		this.canvas = "";
		this.canvasWidth = "";
		this.canvasHeight = "";
		this.dots = [];
		this.dotSpeed = 2;
		this.blur = "no";
		this.code = [];
		this.lineWidth = 2;
		this.dotRadius = 3;
	}

	TextEnterGenerator.prototype = {

		//Create canvas. It will return the canvas DOM element
		createCanvas: function(width, height, name){
			const canvas = document.createElement("canvas");
			canvas.width = width;
			this.canvasWidth = width;
			canvas.height = height;
			this.canvasHeight = height;
			canvas.className = name;
			canvas.id = name;
			canvas.style = "border: 1px solid black";
			return canvas;
		},

		//set customize font in canvas.
		setFont: function(font){
			this.font = font;
		},

		//set maximum degree of code rotation angle.
		setAngle: function(angle){
			this.angle = angle;
		},

		//set dots' maximum speed.
		setDotSpeed: function(x){
			this.dotSpeed = x;
		},

		//set lines' width.
		setLineWidth: function(x){
			this.lineWidth = x;
		},

		//set dots' radius.
		setDotRadius: function(x){
			this.dotRadius = x;
		},

		//Set level of fuzziness
		setBlur: function(x){
			const blur = "blur(" + x + "px)";
			this.blur = blur;
		},

		//return the current correct code of the verification
		getCode: function(){
			return this.code;
		},

		getRandomNumber: function(){
			return this.nums[Math.floor(Math.random() * 10)];
		},

		//randomly decide the letter will be uppercase or lowercase
		upperOrLower: function(){
			const result = ["lower", "upper"];
			return result[Math.round(Math.random())];
		},

		//set a random speed to each dot from 1 to maximum speed
		getRandomSpeed: function(x){
			return Math.round(Math.random() * x);
		},

		//get random letter from letter list
		getRandomLetter: function(){
			if(this.upperOrLower() === "lower"){
				const index = Math.floor(Math.random() * 26);
				const result = this.letters[index];
				return result;
			}
			else{
				const index = Math.floor(Math.random() * 26);
				const result = this.letters[index].toUpperCase();
				return result;
			}
		},

		//get random color rgb value
		getRandomColor: function(){
	        const r = Math.round(Math.random() * 256);
	        const g = Math.round(Math.random() * 256);
	        const b = Math.round(Math.random() * 256);
	        return "rgb(" + r + "," + g + "," + b +")";
	    },

	    //randomly decide to choose a number or letter 
	    numberOrLetter: function(){
	    	const result = ["number", "letter"];
			return result[Math.floor(Math.random() * 2)];
	    },

	    //set the rotation angle of the code from 0 tp maximum
	    getRandomAngle: function(){
	    	const degree = Math.round(Math.random() * this.angle);
	    	return degree * Math.PI / 180;
	    },

	    //randomly decide wheter the angle is negative or positive
	    negOrPos: function(){
	    	const result = ["positive", "negative"];
	    	return result[Math.floor(Math.random() * 2)];
	    },

	    //randomly decide to fillStyle or stokeStyle in canvas
	    strokeOrfill: function(){
	    	const result = ["stroke", "fill"];
	    	return result[Math.floor(Math.random() * 2)];
	    },

	    //add dots to display in the verification.
	    addDots: function(num){

	    	let i;
			for(i = 0; i < num; i++){
			    const newDot = new Dot();
			    newDot.x = Math.round(Math.random() * this.canvasWidth);
			    newDot.y = Math.round(Math.random() * this.canvasHeight);
			    newDot.radius = this.dotRadius;
			    newDot.speedX = this.getRandomSpeed(this.dotSpeed);
			    newDot.speedY = this.getRandomSpeed(this.dotSpeed);
			    newDot.color = this.getRandomColor();
			    this.dots.push(newDot);
			}
	    },

	    //clear all currently added dots
	    clearDots: function(){
	    	this.dots = [];
	    },

	    //draw dots previously added
	    drawRandomDots: function(canvas){

	    	const canvasContext = canvas.getContext("2d");
	    	let i;
		    for(i = 0; i < this.dots.length; i++){
				canvasContext.beginPath();
				canvasContext.arc(this.dots[i].x, this.dots[i].y, this.dots[i].radius, 0, 2 * Math.PI);
					
				if(this.strokeOrfill() === "fill"){
					canvasContext.fillStyle = this.dots[i].color;
					canvasContext.fill();
				}
				else{
					canvasContext.strokeStyle = this.dots[i].color;
					canvasContext.stroke(); 
				}
				canvasContext.closePath();
		    }

	    },

	    //change each dot's position 
	    moveDots: function(){
	    	let i;
	    	for(i = 0; i < this.dots.length; i++){

	    		if(this.dots[i].speedX === 0 && this.dots[i].speedY === 0){
	    			this.dots[i].speedX = this.getRandomSpeed(1);
	    			this.dots[i].speedY = this.getRandomSpeed(1);
	    		}

		    	if(this.dots[i].x < 0 ){
		    		this.dots[i].speedX = -this.dots[i].speedX;
		    	}
		    	if(this.dots[i].x > this.canvasWidth){
		    		this.dots[i].speedX = -this.dots[i].speedX;
		    	}
		    	if(this.dots[i].y < 0){
		    		this.dots[i].speedY = -this.dots[i].speedY;
		    	}
		    	if(this.dots[i].y > this.canvasHeight){
		    		this.dots[i].speedY = -this.dots[i].speedY;
		    	}
		    	this.dots[i].x += this.dots[i].speedX;
		    	this.dots[i].y += this.dots[i].speedY;
		    }
	    	
	    },

	    //make the aniamtion of dots' movements
	    drawRandomDotsWithAnimation: function(canvas){

	    	this.moveDots();
	    	canvas.height = canvas.height;
	    	this.drawRandomDots(canvas);

		    requestAnimFrame(() => {
		    	this.drawRandomDotsWithAnimation(canvas);
		    })

	    },

	    //draw the number of lines want to display in the verification
	    drawRandomLines: function(canvas, num){

		    const canvasContext = canvas.getContext("2d");
		    for(let i = 0; i < num; i++){
				const startX = Math.round(Math.random() * this.canvasWidth);
				const startY = Math.round(Math.random() * this.canvasHeight);
				const endX = Math.round(Math.random() * this.canvasWidth);
				const endY = Math.round(Math.random() * this.canvasHeight);

				canvasContext.beginPath();
				canvasContext.moveTo(startX, startY);
				canvasContext.lineWidth = this.lineWidth;
				canvasContext.lineTo(endX,endY); 
				canvasContext.strokeStyle = this.getRandomColor();
				canvasContext.stroke();
				canvasContext.closePath();
			}

	    },

	    //generate the code of verification in the canvas by using current settings
		createCode: function(canvas, digits){
			const canvasContext = canvas.getContext("2d");
			const code = [];
			//generate code, each digit will be randomly decide whether is a letter or number
			let i;
			for(i = 0; i < digits; i++){
				if(this.numberOrLetter() === "number"){
					code.push(this.getRandomNumber());
				}
				else{
					code.push(this.getRandomLetter());
				}
			}
			this.code = code;

			let pos = 0;
			for(i = 0; i < digits; i++){

				//decide where the digit will be on canvas
				const x = this.canvasWidth / (digits + 2);
				const y = this.canvasHeight / 2;

				//apply current settings
				canvasContext.font = this.font;
				canvasContext.textBaseline = "middle";
				if(this.blur !== "no"){
					canvasContext.filter = this.blur;
				}

				let angle;
				if(this.negOrPos() === "positive"){
					angle = this.getRandomAngle();
					canvasContext.rotate(angle);
				}
				else{
					angle = -this.getRandomAngle();
					canvasContext.rotate(angle);
				}

				if(this.strokeOrfill() === "fill"){
					canvasContext.fillStyle = this.getRandomColor();
					canvasContext.fillText(code[i], x * (i+1), y);
				}
				else{
					canvasContext.strokeStyle = this.getRandomColor();
					canvasContext.strokeText(code[i], x * (i+1), y);
				}
				canvasContext.rotate(-angle);
			}
		},
	}
	global.SlideStyleGenerator = global.SlideStyleGenerator || SlideStyleGenerator;
	global.TextEnterGenerator = global.TextEnterGenerator || TextEnterGenerator;
})(window);