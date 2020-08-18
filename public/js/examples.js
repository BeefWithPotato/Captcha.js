'use strict';
const log = console.log

const ex1Js = document.querySelector('#ex1-a-js');
const ex1Html = document.querySelector('#ex1-a-html');
const ex1Css = document.querySelector('#ex1-a-css');
ex1Js.addEventListener('click', openJS1);
ex1Html.addEventListener('click', openHTML1);
ex1Css.addEventListener('click', openCSS1);

const ex2Js = document.querySelector('#ex2-a-js');
const ex2Html = document.querySelector('#ex2-a-html');
const ex2Css = document.querySelector('#ex2-a-css');
ex2Js.addEventListener('click', openJS2);
ex2Html.addEventListener('click', openHTML2);
ex2Css.addEventListener('click', openCSS2);

const ex3Js = document.querySelector('#ex3-a-js');
const ex3Html = document.querySelector('#ex3-a-html');
const ex3Css = document.querySelector('#ex3-a-css');
ex3Js.addEventListener('click', openJS3);
ex3Html.addEventListener('click', openHTML3);
ex3Css.addEventListener('click', openCSS3);

const ex4Js = document.querySelector('#ex4-a-js');
const ex4Html = document.querySelector('#ex4-a-html');
const ex4Css = document.querySelector('#ex4-a-css');
ex4Js.addEventListener('click', openJS4);
ex4Html.addEventListener('click', openHTML4);
ex4Css.addEventListener('click', openCSS4);

const options = document.querySelector('#options');
options.addEventListener('submit', apply);

const ex5Js = document.querySelector('#ex5-a-js');
const ex5Html = document.querySelector('#ex5-a-html');
const ex5Css = document.querySelector('#ex5-a-css');
ex5Js.addEventListener('click', openJS5);
ex5Html.addEventListener('click', openHTML5);
ex5Css.addEventListener('click', openCSS5);

function setDefaultImgs(list){
	const imga = document.querySelector('#imga');
	const imgb = document.querySelector('#imgb');
	const imgc = document.querySelector('#imgc');

	list.push(imga.src);
	list.push(imgb.src);
	list.push(imgc.src);
}

// default slide-type example
let ex1 = null;
function exForDefaultSlide(){
	ex1 = new SlideStyleGenerator();
	const defaultEx = document.querySelector('#ex1');
	const canvas = ex1.createCanvas(320, 200, "canvas1", "background");
	const block = ex1.createCanvas(320, 200, "jigsaw1", "jigsaw");
	defaultEx.append(canvas);
	defaultEx.append(block);

	const defaultImg = [];
	setDefaultImgs(defaultImg);
	ex1.setSrcs(defaultImg);
	ex1.setXYError(410, 213);
	ex1.makeJigsaw(0, 0, 320, 200, 50, "src");
}
exForDefaultSlide();

function resetDefault(){
	const canvas = document.querySelector('#canvas1');
	const block = document.querySelector('#jigsaw1');
	canvas.height = canvas.height;
	block.height = block.height;
	ex1.makeJigsaw(0, 0, 320, 200, 50, "src");
}

// slide-type example with customize backgrounds
const uploadedImg = [];
let ex2 = null;
function exForCustomizeSlide(){
	ex2 = new SlideStyleGenerator();
	ex2.imgs = uploadedImg;
	ex2.setXYError(412, 274);
	const uploadEx = document.querySelector('#upload');
	const canvas = ex2.createCanvas(320, 200, "canvas2", "background");
	const block = ex2.createCanvas(320, 200, "jigsaw2", "jigsaw");
	uploadEx.append(canvas);
	uploadEx.append(block);
}
exForCustomizeSlide()

function uploadImages(){
	log("uploadImage");
	const files = document.querySelector("input[type=file]").files;
	Array.prototype.forEach.call(files, (file) => {
		  uploadedImg.push(file);
	});
	const canvas = document.querySelector('#canvas2');
	const block = document.querySelector('#jigsaw2');
	canvas.height = canvas.height;
	block.height = block.height;
	ex2.makeJigsaw(0, 0, 320, 200, 50, "file");
}

function resetUpload(){

	if(uploadedImg.length === 0){
		alert("Please upload images first!");
	}
	else{
		const canvas = document.querySelector('#canvas2');
		const block = document.querySelector('#jigsaw2');
		canvas.height = canvas.height;
		block.height = block.height;
		ex2.makeJigsaw(0, 0, 320, 200, 50, "file");
	}
}

// Text-enter style example
let ex3 = null;
function normalTextType(){
	ex3 = new TextEnterGenerator();
	const textEx = document.querySelector('#text-button');
	const canvas = ex3.createCanvas(360, 150, "canvas3");
	textEx.append(canvas);
	ex3.createCode(canvas, 4);
	ex3.drawRandomLines(canvas, 30);
	ex3.addDots(30);
	ex3.drawRandomDots(canvas);
}
normalTextType();

// Text-enter style example with animation
let ex4 = null;
function textTypeWithAnimation(){
	ex4 = new TextEnterGenerator();
	const text2Ex = document.querySelector('#text-button-animation');
	const canvas = ex4.createCanvas(360, 150, "canvas4");
	const canvasA = ex4.createCanvas(360, 150, "canvasA");
	ex4.canvasA = canvasA;
	text2Ex.append(canvas);
	text2Ex.append(canvasA);
	ex4.createCode(canvas, 4);
	ex4.drawRandomLines(canvas, 20);
	ex4.addDots(20);
	ex4.drawRandomDotsWithAnimation(canvasA);
}
textTypeWithAnimation();

// Text-enter style with customize options
let ex5 = null;
function textTypeWithOptions(){
	ex5 = new TextEnterGenerator();
	const textEx = document.querySelector('#text-button-customize');
	const canvas5 = ex5.createCanvas(360, 150, "canvas5");
	textEx.append(canvas5);
}
textTypeWithOptions();

function apply(){
	const canvas5 = document.querySelector('#canvas5');
	canvas5.height = canvas5.height;
	const digits = document.querySelector('#ex5-digits').value;
	const level = document.querySelector('#blur').value;
	const dots = document.querySelector('#ex5-dots').value;
	const lines = document.querySelector('#ex5-lines').value;
	const angle = document.querySelector('#ex5-angle').value;

	if(level !== "" && !isNaN(level)){
		ex5.setBlur(level);
	}

	if(angle !== "" && !isNaN(angle)){
		ex5.setAngle(angle);
	}

	if(digits !== "" && !isNaN(digits)){
		ex5.createCode(canvas5, parseInt(digits));
	}

	if(dots !== "" && !isNaN(dots)){
		ex5.addDots(dots);
		ex5.drawRandomDots(canvas5);
	}

	if(lines !== "" && !isNaN(lines)){
		ex5.drawRandomLines(canvas5, lines);
	}
}


function verifyText(x){
	if(x === 1){
		const code = document.querySelector('#ex3-input').value;
		let answer = "";
		for(let i = 0; i < ex3.getCode().length; i++){
			answer += ex3.getCode()[i];
		}

		console.log("code:" + code);
		console.log("answer:" + answer);
		if(code.toUpperCase() === answer.toUpperCase() || code.toLowerCase() === answer.toLowerCase()){
			alert("Correct!")
		}
		else{
			alert("Incorrect! Please Try Again!")
		}
		resetText(1);
	}
	else if(x === 2){
		const code = document.querySelector('#ex4-input').value;
		let answer = "";
		for(let i = 0; i < ex4.getCode().length; i++){
			answer += ex4.getCode()[i];
		}

		console.log("code:" + code);
		console.log("answer:" + answer);
		if(code.toUpperCase() === answer.toUpperCase() || code.toLowerCase() === answer.toLowerCase()){
			alert("Correct!")
		}
		else{
			alert("Incorrect! Please Try Again!")
		}
		resetText(2);
	}
	else{
		const code = document.querySelector('#ex5-input').value;
		let answer = "";
		for(let i = 0; i < ex5.getCode().length; i++){
			answer += ex5.getCode()[i];
		}

		console.log("code:" + code);
		console.log("answer:" + answer);
		if(code.toUpperCase() === answer.toUpperCase() || code.toLowerCase() === answer.toLowerCase()){
			alert("Correct!")
		}
		else{
			alert("Incorrect! Please Try Again!")
		}
		apply();
	}
}

function resetText(x){
	if(x === 1){
		const canvas = document.querySelector('#canvas3');
		canvas.height = canvas.height;
		ex3.createCode(canvas, 4);
		ex3.drawRandomLines(canvas, 30, 1);
		ex3.clearDots();
		ex3.addDots(30, 2, 1);
		ex3.drawRandomDots(canvas);
	}
	else if(x === 2){
		const canvas = document.querySelector('#canvas4');
		const canvasA = document.querySelector('#canvasA');
		canvas.height = canvas.height;
		ex4.createCode(canvas, 4);
		ex4.drawRandomLines(canvas, 20, 1);
		ex4.clearDots();
		ex4.addDots(20, 2, 1);
	}
}

function openJS1(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 0){
			document.getElementById("ex1-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex1-" + type[i]).style.display="none";
		}
	}
}

function openHTML1(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 1){
			document.getElementById("ex1-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex1-" + type[i]).style.display="none";
		}
	}
}

function openCSS1(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 2){
			document.getElementById("ex1-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex1-" + type[i]).style.display="none";
		}
	}
}

function openJS2(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 0){
			document.getElementById("ex2-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex2-" + type[i]).style.display="none";
		}
	}
}

function openHTML2(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 1){
			document.getElementById("ex2-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex2-" + type[i]).style.display="none";
		}
	}
}

function openCSS2(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 2){
			document.getElementById("ex2-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex2-" + type[i]).style.display="none";
		}
	}
}

function openJS3(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 0){
			document.getElementById("ex3-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex3-" + type[i]).style.display="none";
		}
	}
}

function openHTML3(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 1){
			document.getElementById("ex3-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex3-" + type[i]).style.display="none";
		}
	}
}

function openCSS3(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 2){
			document.getElementById("ex3-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex3-" + type[i]).style.display="none";
		}
	}
}

function openJS4(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 0){
			document.getElementById("ex4-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex4-" + type[i]).style.display="none";
		}
	}
}

function openHTML4(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 1){
			document.getElementById("ex4-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex4-" + type[i]).style.display="none";
		}
	}
}

function openCSS4(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 2){
			document.getElementById("ex4-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex4-" + type[i]).style.display="none";
		}
	}
}

function openJS5(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 0){
			document.getElementById("ex5-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex5-" + type[i]).style.display="none";
		}
	}
}

function openHTML5(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 1){
			document.getElementById("ex5-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex5-" + type[i]).style.display="none";
		}
	}
}

function openCSS5(e){
	e.preventDefault();
	const type = ["js", "html", "css"];
	for(let i = 0; i <= 2; i++){
		if(i === 2){
			document.getElementById("ex5-" + type[i]).style.display="block";
		}
		else{
			document.getElementById("ex5-" + type[i]).style.display="none";
		}
	}
}
