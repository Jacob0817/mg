<template>
  <v-container ma-1 pa-1>
    <v-layout text-xs-center left absolute wrap>
      <v-flex :id="cubeid" :style="{width:cubesize.width,height:cubesize.height}">
      </v-flex>
	  <v-flex xs12 sm12  v-if="showtools">
				<v-btn @click="cubeRotatingSelf('up')" style="margin:1px" color="info" large>
					<v-icon style="font-size:40px">keyboard_arrow_up</v-icon>
				</v-btn>
				<v-btn @click="cubeRotatingSelf('down')" style="margin:1px" color="info" large>
					<v-icon style="font-size:40px">keyboard_arrow_down</v-icon>
				</v-btn>
				<v-btn @click="cubeRotatingSelf('left')" style="margin:1px" color="info" large >
					<v-icon style="font-size:40px">keyboard_arrow_left</v-icon>
				</v-btn>
				<v-btn @click="cubeRotatingSelf('right')" style="margin:1px" color="info" large >
					<v-icon style="font-size:40px">keyboard_arrow_right</v-icon>
				</v-btn>
				<v-btn @click="cubeAutoRotating()" style="margin:5px" color="error" large >
					<v-icon style="font-size:40px">cached</v-icon>
				</v-btn>

				
			

	  </v-flex>
    </v-layout>
  </v-container>
</template>



<script>
import kiraerno from 'Lib/kiraerno'
import FixState from 'Lib/fixedcubestate.js'
import {W,Y,G,B,R,O} from  'Lib/colors'


export default {
	props: ['cubeid','cubesize','fov',
	'showtools','cubestate','cubescript','cubearrow'],
    data: () => ({
	  stage: '',
	  clickable : true,
      discript:'init',
      /* eslint-disable */
      SlovedCubeState : [

          //  Front slice

          [ W, O,  ,  , G,   ],    [ W, O,  ,  ,  ,   ],    [ W, O, B,  ,  ,   ],//   0,  1,  2
          [ W,  ,  ,  , G,   ],    [ W,  ,  ,  ,  ,   ],    [ W,  , B,  ,  ,   ],//   3,  4,  5
          [ W,  ,  , R, G,   ],    [ W,  ,  , R,  ,   ],    [ W,  , B, R,  ,   ],//   6,  7,  8


          //  Standing slice

          [  , O,  ,  , G,   ],    [  , O,  ,  ,  ,   ],    [  , O, B,  ,  ,   ],//   9, 10, 11
          [  ,  ,  ,  , G,   ],    [  ,  ,  ,  ,  ,   ],    [  ,  , B,  ,  ,   ],//  12, XX, 14
          [  ,  ,  , R, G,   ],    [  ,  ,  , R,  ,   ],    [  ,  , B, R,  ,   ],//  15, 16, 17


          //  Back slice

          [  , O,  ,  , G, Y ],    [  , O,  ,  ,  , Y ],    [  , O, B,  ,  , Y ],//  18, 19, 20
          [  ,  ,  ,  , G, Y ],    [  ,  ,  ,  ,  , Y ],    [  ,  , B,  ,  , Y ],//  21, 22, 23
          [  ,  ,  , R, G, Y ],    [  ,  ,  , R,  , Y ],    [  ,  , B, R,  , Y ] //  24, 25, 26

        ],
      
      
      /* eslint-enable */
      SECOND : 1000,
	}),
	computed:{
		// arrow(){
		// 	return this.cubearrow
		// },
	},
    methods:{
      initcube :function(cube_state_before_init){
		let that = this
        let name = this.cubeid
        let erno = 'erno_' + name
        let container = document.getElementById(name)
        window[erno] = new kiraerno(container,name,cube_state_before_init,function () {
                window[name] = window.cube
        },this.fov)
        function loop(){
			window[erno].stateFrames ++
			var state = window[erno].states[ window[erno].state]
			// console.log('loop func state is ',state)
            if( state instanceof Function ) state()
        }
		setInterval( loop, 16 )
	  },
	  cubeRotatingSelf: function(direction){
		  let cube = window[this.cubeid]
		  let command = ''
		  cube.twistDuration = 600
		  if(direction == 'up') command = "X" 
		  else if(direction == 'down') command = "X'" 
		  else if(direction == 'left') command = "Y" 
		  else if(direction == 'right') command = "Y'" 
		  cube.twistQueue.add(command)
		  this.$emit('cube-tools-turn-command',command)
		  
	  },
	  cubeAutoRotating : function(){
		  let cube = window[this.cubeid]
		  cube.rotationDeltaX = 0
		  cube.isRotating = !cube.isRotating
	  },
	
	  cubeAddArrow: function(faceid,arrowface,direction){
		  let cubeClass = `#${this.cubeid} .cubeletId-${faceid}`
		  let faceDom = document.querySelector(cubeClass)
		  let direClass = `.face${arrowface}`
		  let direDom = faceDom.querySelector(direClass)
			// <v-icon class="moveright ar-animated iconfont">chevron_right</v-icon>

		  	let namelist = ['5','4','3','2','1']
			for (name of namelist)
			{
				let classname = `ar-delay-${name}s`
				if(direction == 'right' || direction == 'left'){
					let arrowDom = document.createElement('span')
						arrowDom.classList.add('movearrow')
						arrowDom.classList.add('ar-animated')
						arrowDom.classList.add('theme--light')

						if(direction == 'right'){
							arrowDom.classList.add(classname)
							arrowDom.classList.add('moveright')
							arrowDom.innerHTML = '>'
							// arrowDom.innerHTML = '⇉'
						}else {
							arrowDom.classList.add(`ar-delay-${6- Number(name)}s`)
							arrowDom.classList.add('moveleft')
							arrowDom.innerHTML = '<'
							// arrowDom.innerHTML = '⇇'
							// arrowDom.innerHTML = '⬅︎'
						}
						direDom.appendChild(arrowDom)
				}else{
					let arrowDom = document.createElement('p')
						arrowDom.classList.add('movearrow')
						arrowDom.classList.add('ar-animated')
						arrowDom.classList.add('theme--light')
					if(direction == 'up'){
						arrowDom.classList.add(classname)
						arrowDom.classList.add('moveup')
						// arrowDom.innerHTML = '↑'
						arrowDom.innerHTML = '∧'
						// arrowDom.innerHTML = '⇈'
					}else if(direction == 'down'){
						arrowDom.classList.add(classname)
						arrowDom.classList.add('movedown')
						// arrowDom.innerHTML = '↓'
						arrowDom.innerHTML = '∨'
						// arrowDom.innerHTML = '⇊'
					}
					direDom.appendChild(arrowDom)
				}
				


				
				
			}
	  },

	  cubeAnimationDisplay:function(formula){
		  if(formula == 'R'){
			this.cubeAddArrow('2','Front','up')
			this.cubeAddArrow('5','Front','up')
			this.cubeAddArrow('8','Front','up')

			this.cubeAddArrow('2','Up','up')
			this.cubeAddArrow('11','Up','up')
			this.cubeAddArrow('20','Up','up')

		  }else if(formula == "R'"){
			this.cubeAddArrow('2','Front','down')
			this.cubeAddArrow('5','Front','down')
			this.cubeAddArrow('8','Front','down')

			this.cubeAddArrow('2','Up','down')
			this.cubeAddArrow('11','Up','down')
			this.cubeAddArrow('20','Up','down')
		  }else if(formula == "U"){
			this.cubeAddArrow('0','Front','left')
			this.cubeAddArrow('1','Front','left')
			this.cubeAddArrow('2','Front','left')

			this.cubeAddArrow('2','Right','left')
			this.cubeAddArrow('11','Right','left')
			this.cubeAddArrow('20','Right','left')
		  }else if(formula == "U'"){
			this.cubeAddArrow('0','Front','right')
			this.cubeAddArrow('1','Front','right')
			this.cubeAddArrow('2','Front','right')

			this.cubeAddArrow('2','Right','right')
			this.cubeAddArrow('11','Right','right')
			this.cubeAddArrow('20','Right','right')
		  }else if(formula == "F"){
			this.cubeAddArrow('0','Up','right')
			this.cubeAddArrow('1','Up','right')
			this.cubeAddArrow('2','Up','right')

			this.cubeAddArrow('2','Right','down')
			this.cubeAddArrow('5','Right','down')
			this.cubeAddArrow('8','Right','down')
		  }else if(formula == "F'"){
			this.cubeAddArrow('0','Up','left')
			this.cubeAddArrow('1','Up','left')
			this.cubeAddArrow('2','Up','left')

			this.cubeAddArrow('2','Right','up')
			this.cubeAddArrow('5','Right','up')
			this.cubeAddArrow('8','Right','up')
		  }else{
			  console.log('undefined arrow')
		  }
	  },
	},
	watch:{
		// 监听prpos 需要使用深度监听，否则不会触发
		cubearrow:{
			handler:function(newarr,oldarr){
				console.log('in in in')
				if(newarr.show){
					if(newarr.formula == '' || newarr.formula == undefined){
						let arrowDom = document.querySelectorAll(`#${this.cubeid} .movearrow`)
						let arr = [...arrowDom]
						arr.forEach((ele)=>{
							ele.parentNode.removeChild(ele)
							})
					}else{
						this.cubeAnimationDisplay(newarr.formula)
					}
				}else{
					let arrowDom = document.querySelectorAll(`#${this.cubeid} .movearrow`)
					let arr = [...arrowDom]
						arr.forEach((ele)=>{
							ele.parentNode.removeChild(ele)
						})
				}
			},
			deep: true,

		},
			
		
	},
    mounted : function(){
	  if(this.cubestate){
		this.initcube(this.cubestate)
	  }	else{
	  	this.initcube()
	  }
	  setTimeout(() => {
		  	if(this.cubescript) console.log(this.cubescript)
			if(this.clickable){
				// es6 the extend of string  use `` and  ${} 
					let CubeletFacesdom = document.querySelectorAll(`.face`)
					// es6 new features ... means  rest , can transfer ele to arr then use foreach to map it
					let arr = [...CubeletFacesdom]
					arr.forEach((ele)=>{
						
						ele.addEventListener('click',function(){
							let that = this
							// es6 的新方法 classlist 是类的数组   contains是判断是否含有
							let divWireframe = this.querySelector('.wireframe')
							if(divWireframe.classList.contains('arrow_box')){
								divWireframe.classList.remove('arrow_box')
								let divCircle = this.querySelector('.test-circle')
								this.removeChild(divCircle)
							}
							else{
								let divCircle = document.createElement("div")
								divCircle.classList.add("test-circle")
								divWireframe.classList.add('arrow_box')
								this.appendChild(divCircle)
							}
							
						})
					})
				}
				
				if(this.cubearrow != undefined && this.cubearrow.show){
					if(this.cubearrow.formula == '' || this.cubearrow.formula == undefined){
						null
					}else{
						this.cubeAnimationDisplay(this.cubearrow.formula)
					}
				}

				this.$emit('cube-init-ok',this.cubeid)
	  }, 500);
	  
		  

    }
  }
</script>

<style >




    /************/
   /*          */
  /*   Base   */
 /*          */
/************/



html, body {
	
	width:  100%;
	height: 100%;
}
body {
	
	background-color: #000;
	vertical-align: top;
	overflow: hidden;
}
body, h1, h2 {

	margin:  0;
	border:  0;
	padding: 0;
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-size:   12px;
	line-height: 15px;
	color: rgba( 255, 255, 255, 0.7 );
}
a {

	color: rgba( 255, 255, 255, 0.7 );
	text-decoration: none;
	border-bottom: 1px dotted #FFF;
}
a:hover {

	color: #FFF;
	border-bottom: 1px solid #FFF;
}
table, td, tr {

	margin: 0;
	border: none;
	border-collapse: collapse;
	padding: 0;
}
.pad {

	padding: 8px;
}
	.graydient {

		/* http://www.colorzilla.com/gradient-editor/ */
		background: #000; /* Old browsers */
		background: -moz-radial-gradient(center, ellipse cover,  #444 0%, #000000 90%); /* FF3.6+ */
		background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,#444), color-stop(90%,#000000)); /* Chrome,Safari4+ */
		background: -webkit-radial-gradient(center, ellipse cover,  #444 0%,#000000 90%); /* Chrome10+,Safari5.1+ */
		background: -o-radial-gradient(center, ellipse cover,  #444 0%,#000000 90%); /* Opera 12+ */
		background: -ms-radial-gradient(center, ellipse cover,  #444 0%,#000000 90%); /* IE10+ */
		background: radial-gradient(ellipse at center,  #444 0%,#000000 90%); /* W3C */
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#444444', endColorstr='#000000',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
	}
.heroicRed {

	background-color: #F00;
}






    /************/
   /*          */
  /*   Cube   */
 /*          */
/************/


.cube {

	width:  420px;
	height: 420px;
}
#cubeHasTwistsQueued {

	box-sizing: border-box;
	display: none;
	position: absolute;
	top:  85px;
	left: 85px;
	border: 2px solid #FFF;
	border-radius: 20px;
	width:  40px;
	height: 40px;
	opacity: 0.3;
}
#cubeIsTweening {

	display: none;
	position: absolute;
	top:  90px;
	left: 90px;
	border-radius: 15px;
	width:  30px;
	height: 30px;
	background-color: #FFF;
	opacity: 0.1;
}
/*

	This next bit is just for labeling a Cube's face.

*/
.faceLabel {

	display: none;
	position: absolute;
	z-index: 3000;
	width:  100%;
	height: 100%;
	font-size:    60px;
	line-height: 420px;
	text-align: center;	
	font-family: "RubikExtended";
	text-shadow: 0 0 24px rgba( 0, 0, 0, 0.3 );
	color: #FFF;
}
.faceLabel.faceFront { -webkit-transform: rotateX(   0deg ) translateZ( 350px ) rotateZ(   0deg ); }
.faceLabel.faceUp    { -webkit-transform: rotateX(  90deg ) translateZ( 350px ) rotateZ(   0deg ); }
.faceLabel.faceRight { -webkit-transform: rotateY(  90deg ) translateZ( 350px ) rotateZ(   0deg ); }
.faceLabel.faceDown  { -webkit-transform: rotateX( -90deg ) translateZ( 350px ) rotateZ(  90deg ); }
.faceLabel.faceLeft  { -webkit-transform: rotateY( -90deg ) translateZ( 350px ) rotateZ( -90deg ); }
.faceLabel.faceBack  { -webkit-transform: rotateY( 180deg ) translateZ( 350px ) rotateZ( -90deg ); }






    /****************/
   /*              */
  /*   Cubelets   */
 /*              */
/****************/


.cubelet {

	width:  140px;
	height: 140px;
	position: absolute;
  	-webkit-transform-style: preserve-3d;	
}






    /*********************/
   /*                   */
  /*   Cubelet Faces   */
 /*                   */
/*********************/


/*
	
	Direction-facing planes of limited size
	that act as containers for content.

*/
.face {

	position: absolute;
	width:  140px;
	height: 140px;
	/*background-color: #000;背景颜色*/
	background-color: #acacac;
	text-align: center;
	-webkit-backface-visibility: hidden;
  	-moz-backface-visibility:    hidden;
  	-ms-backface-visibility:     hidden;
  	-o-backface-visibility:      hidden;
  	backface-visibility:         hidden;
  	overflow: hidden;
  	-webkit-transform-style: preserve-3d;
}
.faceFront { -webkit-transform: rotateX(   0deg ) translateZ( 70px ) rotateZ(   0deg ); }
.faceUp    { -webkit-transform: rotateX(  90deg ) translateZ( 70px ) rotateZ(   0deg ); }
.faceRight { -webkit-transform: rotateY(  90deg ) translateZ( 70px ) rotateZ(   0deg ); }
.faceDown  { -webkit-transform: rotateX( -90deg ) translateZ( 70px ) rotateZ(  90deg ); }
.faceLeft  { -webkit-transform: rotateY( -90deg ) translateZ( 70px ) rotateZ( -90deg ); }
.faceBack  { -webkit-transform: rotateY( 180deg ) translateZ( 70px ) rotateZ( -90deg ); }
/*

	Extroverted faces have content such as a colored sticker, text, etc.
	They are constantly visible. Meanwhile introverted faces are not
	visible when the cube is an untwisted state. Some introverted walls 
	are momentarily visible as the cube twists.

*/
/* kirahan */
.faceIntroverted { background-color: #acacac; }
/*

	Our Cubelet faces are naturally black to match the physical Rubik's Cube.
	Adding or removing the "transparent" class here keeps the position and
	rotation integrity of the face while supporting Group.showPlastics() and
	Group.hidePlastics().

*/
.faceTransparent { background-color: transparent; }
/*

	Awwww.... Look at da purty colors...

*/
.purty .face { opacity: 0.5; }
.purty .face.faceFront { background-color: #FFF; }
.purty .face.faceUp    { background-color: #F60; }
.purty .face.faceRight { background-color: #00D; }
.purty .face.faceDown  { background-color: #F00; }
.purty .face.faceLeft  { background-color: #0A0; }
.purty .face.faceBack  { background-color: #FE0; }
/*.purty .face.faceFront { background-color: #CCC; }
.purty .face.faceUp    { background-color: #C30; }
.purty .face.faceRight { background-color: #00A; }
.purty .face.faceDown  { background-color: #C00; }
.purty .face.faceLeft  { background-color: #070; }
.purty .face.faceBack  { background-color: #CB0; }*/






    /****************************/
   /*                          */
  /*   Cubelet Face Content   */
 /*                          */
/****************************/


/*

	WIREFRAMES

	Oddly, we cannot use borders to make our wireframes
	because this will cause a visible oscillation as CSS
	struggles to decide what gets drawn on top.
	Instead we use specially crafted box-shadows.

*/
.wireframe {

	box-sizing: border-box;
	display: none;
	position: absolute;
	width:  100%;
	height: 100%;
	/*border: 1px solid #FFF;    //线的颜色*/
	border: 2px solid #111111;
	background-color: rgba( 255, 255, 255, 0.05 );
}


/*

	STICKERS

	About what you'd expect. The default color here
	is full on bright purple (which does not exist 
	on an actual Rubik's Cube) so that one can see 
	quickly if something's gone wrong with stickers.

*/
.sticker {

	position: absolute;
	margin: 10px 0 0 10px;
	width:  120px;
	height: 120px;
	background-color: #F0F;
	border-radius: 12px;
	text-align: center;
}
.stickerLogo {

	/*background-image: url( "../img/rubiksLogoClassic.png" );*/
	background-size: 120px 120px;
	background-repeat: no-repeat;
}


/*

	CUBELET IDs

	Each Cubelet has a unique ID number from 0 to 26.
	We display these mostly for debugging purposes
	as the end user probably doesn't care and/or would
	find this superfluous info confusing.

*/
.id {

	display: none;
	position: absolute;
	z-index: 1000;
	width:  100%;
	height: 100%;
	font-size:   30px;
	line-height: 135px;
	text-align: center;
	color: #000;
}
.id .underline {

	border-bottom: 1px solid #000;
}
/*

	We want ID numbers displayed on introverted faces to be white,
	but why use #FEFEFE instead of #FFF?
	So we can export as PDF, open up in Adobe Illustrator, select "Same Fill Color" 
	and it will exclude our #FFF text nodes!

*/
.faceIntroverted .id {

	color: #FEFEFE;
}
.faceIntroverted .id .underline {

	border-bottom: 1px solid #FEFEFE;
}


/*
	
	TEXT

	Formerly referred to as "Hero Text", this is the one-character
	display for a Cubelet face.

*/
.text {

	display: none;
	position: absolute;
	z-index: 2000;
	width:  100%;
	height: 100%;
	text-align: center;
	color: #FFF;
	font-family: "RubikExtended", sans-serif;
	font-size:   150px;
	line-height: 170px;
}






    /****************/
   /*              */
  /*   Messages   */
 /*              */
/****************/


#twist {

	position: absolute;
	width: 100%;
	text-align: center;
	font-size:   240px;
	line-height: 240px;
	color: rgba( 255, 255, 255, 0.4 );
	text-shadow: 0 0 12px rgba( 255, 255, 255, 0.5 );
	font-weight: bold;
	visibility: hidden;
}
.twister {
	
	display: none;
	width:  180px;
	height: 180px;
	border: 2px solid rgba( 255, 255, 255, 0.3 );
	background-color: rgba( 255, 255, 255, 0.3 );
	text-align: center;
	vertical-align: middle;
	color: rgba( 255, 255, 255, 0.1 );
	text-decoration: none;
	font-weight: bold;
	font-size: 64px;
	line-height: 100px;
	overflow: hidden;	
}
.twister:hover {

	box-shadow: 0px 0px 18px rgba( 255, 255, 255, 0.8 );
	border: 2px solid rgb( 255, 255, 255 );
	background-color: rgba( 255, 255, 255, 0.7 );
	color: #FFF;
	text-shadow: 0px 0px 6px rgba( 255, 255, 255, 0.5 );
}
#captions {

	display: none;
	position: absolute;
	top: 15%;
	width:  100%;
	height: 100%;
	color: #FFF;
	text-shadow: 0 0 24px rgba( 0, 0, 0, 1 );
	font-family: "RubikExtended", sans-serif;
	font-size:   75px;
	line-height: 85px;
	text-transform: uppercase;
	text-align: center;
}






    /****************/
   /*              */
  /*   Controls   */
 /*              */
/****************/


#controls, #controlsOpen {
	
	position: absolute;
	top:   0;
	right: 0;
	width: 200px;	
	color: rgba( 255, 255, 255, 0.4 );
	overflow: auto;
}
#controlsClose {

	position: absolute;
	top: 20px;
	right: 10px;
}
#controls {

	height: 100%;
}
#controls {

	display: none;
	height: 100%;
	background-color: rgba( 255, 255, 255, 0.9 );
	color: rgba( 0, 0, 0, 0.5 );
}
#controls .pad, #controlsOpen .pad {

	padding: 20px 5px 20px 20px;
}
#controls h2 {

	margin: 20px 0 5px 0;
	color: rgba( 0, 0, 0, 0.9 );
}
#controls a {

	color: rgba( 0, 0, 0, 0.5 );
	text-decoration: none;
	border: none;
}
#controls a:hover {

	border: none;
	background-color: #FFF;
	color: rgba( 0, 0, 0, 0.9 );
}
#controlsOpen a {

	display: block;
	padding-bottom: 20px;
	color: rgba( 255, 255, 255, 0.4 );
	text-decoration: none;
	border: none;
}
#controlsOpen a:hover {

	color: #FFF;
}
#controls input {

	border: 0;
	background-color: rgba( 0, 0, 0, 0.15 );
	color: #FFF;
	font-family: "Courier New", Courier, monospace;
}
#controls label:hover input, #controls input:hover {

	border: 0;
	background-color: rgba( 0, 0, 0, 0.3 );
	color: #FFF;
}
#controls input:focus {

	outline: none;
	background-color: rgba( 0, 0, 0, 0.5 );
}
#backgroundColor input, #camera input {

	width: 120px;
}
#camera input {

	margin-left: 5px;
}
#camera input {

	width: 40px;
	text-align: right;
}
#camera label, #cubePosition label, #cubeRotation label, #cubeRotationDelta label {

	display: block;
}
#cubePosition input, #cubeRotation input, #cubeRotationDelta input, #partialRots input {

	margin-left: 5px;
	width: 50px;
	text-align: right;
}
#cubeRotation input, #cubeRotationDelta input {

	width: 90px;
}
#cubeTwistDuration input {

	width: 40px;
	text-align: right;
}
#attributes label, #actions label {

	display: block;
}
#attributes label:hover, #actions label:hover {

	background-color: #FFF;
	color: rgba( 0, 0, 0, 0.9 );
	cursor: pointer;
}
#attributes input, #actions input {

	margin-right: 10px;
}
#actions a, #presets a {

	display: block;
	padding: 1px 0 1px 0;
}
#controls .key, #controls .key:hover {
	
	display: inline-block;
	margin-right: 4px;
	width:  20px;
	height: 20px;
	border: 1px solid rgba( 0, 0, 0, 0.2 );
	border-radius: 2px;	
	/*padding: 2px 4px 2px 4px;	*/
	text-align: center;
	/*font-family: 'Courier New', Courier, monospace;*/
	font-weight: bold;
	color: rgba( 0, 0, 0, 0.8 );
}
.key+.key {

	margin-right: 5px;
}
.keyBundle {

	margin-top: 12px;
}
#commands {

	line-height: 24px;
}
textarea#texts {

	font-family: "RubikExtended";
	font-size: 24px;
}


.ppt-text{
	color: #000;
	font-size: 40px;
	border-left: 10px solid #009688 !important;
	line-height: 50px !important;
}
.movearrow{
	color: black!important;
	font-size: 80px!important;
}

.click-circle{
            position:absolute;
            width: 50px;height: 50px;
            border-radius: 30px;
            left: 45px;top: 45px;
            background-color: #c64edd;
            z-index:99999;
        }
.test-circle{animation: circle 1000ms ease-in infinite alternate;}
@keyframes circle {
	0%{
			position:absolute;
            border-radius: 30px;
            left: 35%;top: 35%;
            right: 35%;bottom: 35%;
            background-color: #c64edd;
            z-index:99999;
	}
	50%{
			position:absolute;
            border-radius: 30px;
            left: 30%;top: 30%;
			right: 30%;bottom: 30%;
            background-color: #46c06d;
            z-index:99999;
	}
	100%{
			position:absolute;
            border-radius: 30px;
            left: 35%;top: 35%;
			right: 35%;bottom: 35%;
            background-color: #c64edd;
            z-index:99999;
	}
}


@keyframes moveright { 
	  0% {left: 0%;	 opacity: 0; }
	  70% {left: 70%; opacity: 1 }
	  100% {left: 100%;opacity: 0;}
	}		 
.moveright{-webkit-animation-name:moveright;animation-name:moveright;position:relative;margin-left:-16px;}

@keyframes moveleft { 
	  0% {right: 0%;	 opacity: 0; }
	  70% {right: 70%; opacity: 1 }
	  100% {right: 100%;opacity: 0;}
	}		 
.moveleft{-webkit-animation-name:moveleft;animation-name:moveleft;position:relative;margin-right:-16px;}

@keyframes moveup { 
	  0% {bottom: 0%;	 opacity: 0; }
	  70% {bottom: 70%; opacity: 1 }
	  100% {bottom: 100%;opacity: 0;}
	}		 
	/* 改margin可以改密度 */
.moveup{-webkit-animation-name:moveup;animation-name:moveup;position:relative;margin-bottom:-75px;}

@keyframes movedown { 
	  0% {top: 0%;	 opacity: 0; }
	  70% {top: 70%; opacity: 1 }
	  100% {top: 100%;opacity: 0;}
	}		 
.movedown{-webkit-animation-name:movedown;animation-name:movedown;position:relative;margin-top:-100px;}
	
	
.ar-animated{-webkit-animation-duration:1.5s;animation-duration:1.5s;-webkit-animation-fill-mode:both;animation-fill-mode:both;animation-iteration-count:infinite;-webkit-animation-iteration-count:infinite;font-style:inherit;-webkit-animation-timing-function:linear;animation-timing-function:linear;}
.ar-delay-1s{animation-delay:0.1s;}
.ar-delay-2s{animation-delay:0.2s;}
.ar-delay-3s{animation-delay:0.3s;}
.ar-delay-4s{animation-delay:0.4s;}
.ar-delay-5s{animation-delay:0.5s;}
.ar-delay-6s{animation-delay:0.6s;}
.ar-delay-7s{animation-delay:0.7s;}
.ar-delay-8s{animation-delay:0.8s;}
.ar-delay-9s{animation-delay:0.9s;}
.ar-delay-10s{animation-delay:0.10s;}

.arrow_box{animation: glow 800ms ease-out infinite alternate;}
        @keyframes glow {
            0% {
                border-color: #ffa9f2;
                border-width: 5px;
                box-shadow: 0 0 5px rgba(255, 0, 252, 0.97), inset 0 0 5px rgba(123, 172, 223, 0.99), 0 3px 0 #c09dc6;
            }
            100% {
                border-color: #e32abd;
                border-width: 5px;
                box-shadow: 0 0 20px rgba(238, 0, 238, 0.92), inset 0 0 10px rgba(255, 31, 176, 0.87), 0 3px 0 #ffc0ee;
            }
        }
</style>
ß