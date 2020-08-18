"use strict";
console.log('SlideStyleGenerator');

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
		this.pastX = 0;
		this.pastY = "";
		this.trailX = [];
		this.trailY = [];
		this.srcs = [];
		this.curr_src = "";
		this.verticalOrHorizontal = "";
		this.imgData = "";
		this.error = 5;
		this.Xerror = "";
		this.Yerror = "";
	}

	SlideStyleGenerator.prototype = {

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

		verticalOrHorizontal: function(){
	    	const result = ["vertical", "horizontal"];
			return result[Math.floor(Math.random() * 2)];
	    },

	    setError: function(x){
	    	this.error = x;
	    },

		makeJigsaw: function(x, y, width, height, length, type){
			
			log("drawImageOnCanvas");

			const direction = ["vertical", "horizontal"][Math.floor(Math.random() * 2)];
			console.log(direction)

			const partContext = this.part.getContext("2d");
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
							partX = this.getRandomNumber(this.canvasWidth / 2) + (this.canvasWidth / 2) - length;
							partY = this.getRandomNumber(this.canvasHeight / 2) + (this.canvasHeight / 2) - length;
						}
						else{
							this.verticalOrHorizontal = "vertical";
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
								
						partContext.rect(partX, partY, length, length);
						partContext.clip();
						partContext.drawImage(img, x, y, width, height);
						partContext.strokeStyle = "#FFFFF";
						partContext.stroke();
					}
		  			img.src = event.target.result;
				}
				this.createBackground(x, y, width, height, type);
			}
			else if(type === "src"){
				const src = this.srcs[this.getRandomNumber(this.srcs.length-1)];
				this.curr_src = src;
				
				const img = new Image();
				img.onload = () => {
						
					let partX = null;
					let partY = null;
					if(direction === "horizontal"){
						this.verticalOrHorizontal = "horizontal";
						partX = this.getRandomNumber(this.canvasWidth / 2) + (this.canvasWidth / 2) - length;
						partY = this.getRandomNumber(this.canvasHeight / 2) + (this.canvasHeight / 2) - length;
					}
					else{
						this.verticalOrHorizontal = "vertical";
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
						
					partContext.rect(partX, partY, length, length);
					partContext.clip();
					partContext.drawImage(img, x, y, width, height);
					partContext.strokeStyle = "#FFFFF";
					partContext.stroke();
				}
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

						if(this.verticalOrHorizontal === "horizontal"){
							try{
								const imgData = partContext.getImageData(this.x, this.y, this.length, this.length);
								this.imgData = imgData;
								partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
								partContext.putImageData(imgData, 0, this.y);
							}
							catch(e){
								this.createBackground(this.x, this.y, this.canvasWidth, this.canvasHeight, "file");
							}
						}
						else{
							try{
								const imgData = partContext.getImageData(this.x, this.y, this.length, this.length);
								this.imgData = imgData;
								partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
								partContext.putImageData(imgData, this.x, this.canvasHeight - this.length);
							}
							catch(e){
								this.createBackground(this.x, this.y, this.canvasWidth, this.canvasHeight, "file");
							}
						}
					}
		  			img.src = event.target.result;
				}
				this.initMouseEvent(this.part, type);
				
			}
			else if(type === "src"){
				
				const img = new Image();
				img.onload = () => {
					canvasContext.drawImage(img, x, y, width, height);
					canvasContext.clearRect(this.x, this.y, this.length, this.length);

					if(this.verticalOrHorizontal === "horizontal"){
						try{
							const imgData = partContext.getImageData(this.x, this.y, this.length, this.length);
							this.imgData = imgData;
							partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
							partContext.putImageData(imgData, 0, this.y);
						}
						catch(e){
							this.createBackground(this.x, this.y, this.canvasWidth, this.canvasHeight, "src");
						}
					}
					else{
						try{
							const imgData = partContext.getImageData(this.x, this.y, this.length, this.length);
							this.imgData = imgData;
							partContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
							partContext.putImageData(imgData, this.x, this.canvasHeight - this.length);
						}
						catch(e){
							this.createBackground(this.x, this.y, this.canvasWidth, this.canvasHeight, "src");
						}
					}
				}
		  		img.src = this.curr_src;
				
				this.initMouseEvent(this.part, type);
			}

		},

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
						let x = e.clientX;
						const y = e.clientY;
						imgData = this.imgData;
						//records y-axis changes when moving and use the data to verify if user is a machine
						this.trailY.push(y);

						//clear the canvas (I don't know why clearRect() doesn't work here, so I change the height of
						//the canvas to force it to clear.)
						canvas.height = canvas.height;
								
						//jigsaw can only move in the canvas
						// if(x + this.length/2 > this.canvasWidth){
						// 	x = this.canvasWidth - this.length/2;
						// }
						// else if(x - this.length/2 < 0){
						// 	x = 0 + this.length/2;
						// }
						console.log("x:" + x)
						console.log("y:" + y)
						partContext.putImageData(imgData, x - this.Xerror - this.length/2, this.y);
					}
				        
				    else if(this.verticalOrHorizontal === "vertical"){
				    	const x = e.clientX;
				    	let y = e.clientY;
				    	imgData = this.imgData;

				        //records y-axis changes when moving and use the data to verify if user is a machine
						this.trailX.push(x);

						//clear the canvas (I don't know why clearRect() doesn't work here, so I change the height of
						//the canvas to force it to clear.)
						canvas.height = canvas.height;
						console.log("x:" + x)
						console.log("y:" + y)
						//jigsaw can only move in the canvas
						// if(y - 200 + 25 > 351){
						// 	y = 351;
						// }
						
						// if(y - 25 - 200 < 0){
						// 	y = -200;
						// }
				        partContext.putImageData(imgData, this.x, y - this.Yerror - this.length/2);
				    }	
				}
				canvas.onmouseup = (e) => {
					canvas.onmousemove = null;
				    canvas.onmouseup = null;

					if(this.verticalOrHorizontal === "horizontal"){
						if(Math.abs(e.clientX - this.Xerror - this.length/2 - this.x) <= this.error){
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

							const background = this.canvas.getContext("2d");
							background.clearRect(0,0,this.canvasWidth, this.canvasHeight);
							const part = canvas.getContext("2d");
							part.clearRect(0,0,this.canvasWidth, this.canvasHeight);

							
							if(type === "file"){
								this.makeJigsaw(0, 0, this.canvasWidth, this.canvasHeight, this.length, "file");
							}
							else if(type === "src"){
								this.makeJigsaw(0, 0, this.canvasWidth, this.canvasHeight, this.length, "src");
							}			
						}
					}
					if(this.verticalOrHorizontal === "vertical"){
						if(Math.abs(e.clientY - this.Yerror - this.length/2 - this.y) <= this.error){
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

							const background = this.canvas.getContext("2d");
							background.clearRect(0,0,this.canvasWidth, this.canvasHeight);
							const part = canvas.getContext("2d");
							part.clearRect(0,0,this.canvasWidth, this.canvasHeight);

							
							if(type === "file"){
								this.makeJigsaw(0, 0, this.canvasWidth, this.canvasHeight, this.length, "file");
							}
							else if(type === "src"){
								this.makeJigsaw(0, 0, this.canvasWidth, this.canvasHeight, this.length, "src");
							}			
						}
					}
					
				}
			}
		},

	};

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
		this.canvasA = "";
		this.blur = "no";
		this.code = [];
		this.lineWidth = 2;
		this.dotRadius = 3;
	}

	TextEnterGenerator.prototype = {

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

		setFont: function(font){
			this.font = font;
		},

		setAngle: function(angle){
			this.angle = angle;
		},

		setBlur: function(x){
			const blur = "blur(" + x + "px)";
			this.blur = blur;
		},

		getCode: function(){
			return this.code;
		},

		getRandomNumber: function(){
			return this.nums[Math.floor(Math.random() * 10)];
		},

		upperOrLower: function(){
			const result = ["lower", "upper"];
			return result[Math.round(Math.random())];
		},

		getRandomSpeed: function(x){
			return Math.round(Math.random() * x);
		},

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

		getRandomColor: function(){
	        const r = Math.round(Math.random() * 256);
	        const g = Math.round(Math.random() * 256);
	        const b = Math.round(Math.random() * 256);
	        return "rgb(" + r + "," + g + "," + b +")";
	    },

	    numberOrLetter: function(){
	    	const result = ["number", "letter"];
			return result[Math.floor(Math.random() * 2)];
	    },

	    getRandomAngle: function(){
	    	const degree = Math.round(Math.random() * this.angle);
	    	return degree * Math.PI / 180;
	    },

	    negOrPos: function(){
	    	const result = ["positive", "negative"];
	    	return result[Math.floor(Math.random() * 2)];
	    },

	    strokeOrfill: function(){
	    	const result = ["stroke", "fill"];
	    	return result[Math.floor(Math.random() * 2)];
	    },

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

	    clearDots: function(){
	    	this.dots = [];
	    },

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

	    drawRandomDotsWithAnimation: function(canvas){

	    	this.moveDots();
	    	canvas.height = canvas.height;
	    	this.drawRandomDots(canvas);

		    requestAnimFrame(() => {
		    	this.drawRandomDotsWithAnimation(canvas);
		    })

	    },

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

		createCode: function(canvas, digits){
			const canvasContext = canvas.getContext("2d");
			const code = [];
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

				const x = this.canvasWidth / (digits + 2);
				const y = this.canvasHeight / 2;
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