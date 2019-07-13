/*


	CUBES

	A Cube is composed of 27 Cubelets (3x3x3 grid) numbered 0 through 26.
	Cubelets are numbered beginning from the top-left-forward corner of the 
	Cube and proceeding left to right, top to bottom, forward to back:
     

             ----------------------- 
           /   18      19      20  /|
          /                       / |
         /   9      10       11  / 20
        /                       /   |
       /   0       1       2   / 11 |
       -----------------------     23
      |                       |2    |
      |   0       1       2   |  14 |
      |                       |    26
      |                       |5    |
      |   3       4       5   |  17 /
      |                       |    /
      |                       |8  /
      |   6       7       8   |  /
      |                       | /
       ----------------------- 



	Portions of the Cube are grouped (Groups):

	  this.core
	  this.centers
	  this.edges
	  this.corners
	  this.crosses
	


	Portions of the Cube are grouped and rotatable (Slices):

	Rotatable around the Z axis:
	  this.front
	  this.standing
	  this.back

	Rotatable around the X axis:
	  this.left
	  this.middle
	  this.right

	Rotatable around the Y axis:
	  this.up
	  this.equator
	  this.down



	A Cube may be inspected through its Faces (see Slices for more 
	information on Faces vs Slices). From the browser's JavaScript console:

	  this.inspect()

	This will reveal each Face's Cubelet indexes and colors using the Face's
	compact inspection mode. The non-compact mode may be accessed by passing
	a non-false value as an argument:

	  this.inspect( true )




*/

import C3R from './vendor/CSS3DRenderer'
import TWEEN from './vendor/tween.min'
import { W, Y, G, B, R, O, SECOND, COLORLESS } from './colors'
import Cubelet from './cubelets'
import Queue from './queues'
import Twist from './twists'
import Group from './groups'
import Slice from './slices'
import Fold from './folds'
import Direction from './directions'
import { forceAugment } from './vendor/skip'



function Cube(presetstate = [], erno) {

	// console.log('[debug]',preset,erno)
	//  Important for working around lexical closures in things like
	//  forEach() or setTimeout(), etc which change the scope of "this".

	var cube = this

	this.name = erno.name
	this.presetstate = presetstate
	this.parentID = '#' + erno.name
	//  Some important booleans.

	this.isReady = true
	this.isShuffling = false
	this.isRotating = false
	this.isSolving = false

	this.keypressable = false



	//  Every fire of this.loop() will attempt to complete our tasks
	//  which can only be run if this.isReady === true.

	this.taskQueue = new Queue()


	//  We need the ability to gang up twist commands.
	//  Every fire of this.loop() will attempt to empty it.

	this.twistQueue = new Queue(Twist.validate)


	//  How long should a Cube.twist() take?

	this.twistDuration = SECOND / 5


	//  If we shuffle, how shall we do it?

	this.shuffleMethod = this.PRESERVE_LOGO


	//  Size matters? Cubelets will attempt to read these values.

	this.size = 420
	this.cubeletSize = 140

	//  We need to create and setup a new CSS3 Object
	//  to represent our Cube. 
	//  THREE will take care of attaching it to the DOM, etc.

	this.domElement = document.createElement('div')
	this.domElement.classList.add('cube')
	this.threeObject = new C3R.CSS3DObject(this.domElement)


	this.threeObject.rotation.set(

		(25).degreesToRadians(),
		(-30).degreesToRadians(),
		0
	)
	erno.states.threeobj.scene.add(this.threeObject)


	//  If we enable Auto-Rotate then the cube will spin (not twist!) in space
	//  by adding the following values to the Three object on each frame.

	this.rotationDeltaX = 0.1
	this.rotationDeltaY = 0.15
	this.rotationDeltaZ = 0




	//  Here's the first big map we've come across in the program so far. 
	//  Imagine you're looking at the Cube straight on so you only see the front face.
	//  We're going to map that front face from left to right (3), and top to bottom (3): 
	//  that's 3 x 3 = 9 Cubelets.
	//  But then behind the Front slice we also have a Standing slice (9) and Back slice (9),
	//  so that's going to be 27 Cubelets in total to create a Cube.

	this.cubelets = [];
	/* eslint-disable */

	if (presetstate.length == 0) {
		([
			[G, W, , , O,], [G, W, , , ,], [G, W, R, , ,],//   0,  1,  2
			[G, , , , O,], [G, , , , ,], [G, , R, , ,],//   3,  4,  5
			[G, , , Y, O,], [G, , , Y, ,], [G, , R, Y, ,],//   6,  7,  8




			[, W, , , O,], [, W, , , ,], [, W, R, , ,],//   9, 10, 11
			[, , , , O,], [, , , , ,], [, , R, , ,],//  12, OO, 14
			[, , , Y, O,], [, , , Y, ,], [, , R, Y, ,],//  15, 16, 17



			[, W, , , O, B], [, W, , , , B], [, W, R, , , B],//  18, 19, 20
			[, , , , O, B], [, , , , , B], [, , R, , , B],//  21, 22, 23
			[, , , Y, O, B], [, , , Y, , B], [, , R, Y, , B] //  24, 25, 26


		]).forEach(function (cubeletColorMap, cubeletId) {
			cube.cubelets.push(new Cubelet(cube, cubeletId, cubeletColorMap, erno))
		})
	} else {
		(presetstate).forEach(function (cubeletColorMap, cubeletId) {
			cube.cubelets.push(new Cubelet(cube, cubeletId, cubeletColorMap, erno))
		})
	}

	/* eslint-enable */
	// console.log('[debug:cube1]',this)
	//  Mapping the Cube creates all the convenience shortcuts
	//  that we will need later. (Demonstrated immediately below!)
	this.map()

	// cube.twistDuration = 600
	// cube.twistQueue.add("X")


	//  Now that we have mapped faces we can create faceLabels    前後左右的文字

	if (erno.renderMode === 'css') {

		this.faces.forEach(function (face, i) {

			var labelElement = document.createElement('div')
			labelElement.classList.add('faceLabel')
			labelElement.classList.add('face' + face.face.capitalize())
			labelElement.innerHTML = face.face.toUpperCase()
			cube.domElement.appendChild(labelElement)
		})
	}


	//  We need to map our folds separately from Cube.map()
	//  because we only want folds mapped at creation time.
	//  Remapping folds with each Cube.twist() would get weird...

	this.folds = [

		new Fold(this.front, this.right),
		new Fold(this.left, this.up),
		new Fold(this.down, this.back)
	]

	//  Shall we load some presets here?

	// 原来的函数，用来设置一些预制的状态
	// preset = 'preset' + preset.capitalize()
	// if( this[ preset ] instanceof Function === false ) preset = 'presetBling'
	// this[ preset ]()



	//  Get ready for major loop-age.
	//  Our Cube checks these booleans at roughly 60fps.
	//  use call to give loop() function a given this: window[name]
	setInterval(function () {
		cube.loop.call(cube)
	}, 16)



}

Cube.prototype = Object.create(Group.prototype)
Cube.prototype.constructor = Cube

var setupTasks = window.setupTasks || []
setupTasks.push(
	forceAugment(Cube, {
		//  A Rubik's Cube is composed of 27 cubelets arranged 3 x 3 x 3.
		//  We need a map that relates these 27 locations to the 27 cubelets
		//  such that we can ask questions like:
		//  What colors are on the Front face of the cube? Etc.
		map: function () {

			var that = this, i


			//  Groups are simple collections of Cubelets.
			//  Their position and rotation is irrelevant.

			this.core = new Group()
			this.centers = new Group()
			this.edges = new Group()
			this.corners = new Group()
			this.crosses = new Group()
			this.cubelets.forEach(function (cubelet, index) {

				if (cubelet.type === 'core') that.core.add(cubelet)
				if (cubelet.type === 'center') that.centers.add(cubelet)
				if (cubelet.type === 'edge') that.edges.add(cubelet)
				if (cubelet.type === 'corner') that.corners.add(cubelet)
				if (cubelet.type === 'center' || cubelet.type === 'edge') that.crosses.add(cubelet)
			})


			//  Slices that can rotate about the X-axis:

			this.left = new Slice(

				this.cubelets[24], this.cubelets[21], this.cubelets[18],
				this.cubelets[15], this.cubelets[12], this.cubelets[9],
				this.cubelets[6], this.cubelets[3], this.cubelets[0]
			)
			this.left.name = 'left'
			this.middle = new Slice(

				this.cubelets[25], this.cubelets[22], this.cubelets[19],
				this.cubelets[16], this.cubelets[13], this.cubelets[10],
				this.cubelets[7], this.cubelets[4], this.cubelets[1]

			)
			this.middle.name = 'middle'
			this.right = new Slice(

				this.cubelets[2], this.cubelets[11], this.cubelets[20],
				this.cubelets[5], this.cubelets[14], this.cubelets[23],
				this.cubelets[8], this.cubelets[17], this.cubelets[26]

			)
			this.right.name = 'right'


			//add by kira han in order to rotate 'r'
			this.right2layer = new Slice(
				//middle layer
				this.cubelets[25], this.cubelets[22], this.cubelets[19],
				this.cubelets[16], this.cubelets[13], this.cubelets[10],
				this.cubelets[7], this.cubelets[4], this.cubelets[1],

				//right layer
				this.cubelets[2], this.cubelets[11], this.cubelets[20],
				this.cubelets[5], this.cubelets[14], this.cubelets[23],
				this.cubelets[8], this.cubelets[17], this.cubelets[26]
			)
			this.right2layer.name = 'right2layer'

			//add by kirahan in order to rotate 'l'
			this.left2layer = new Slice(
				//middle layer
				this.cubelets[25], this.cubelets[22], this.cubelets[19],
				this.cubelets[16], this.cubelets[13], this.cubelets[10],
				this.cubelets[7], this.cubelets[4], this.cubelets[1],

				this.cubelets[24], this.cubelets[21], this.cubelets[18],
				this.cubelets[15], this.cubelets[12], this.cubelets[9],
				this.cubelets[6], this.cubelets[3], this.cubelets[0]
			)
			this.left2layer.name = 'left2layer'
			//  Slices that can rotate about the Y-axis:

			this.up = new Slice(

				this.cubelets[18], this.cubelets[19], this.cubelets[20],
				this.cubelets[9], this.cubelets[10], this.cubelets[11],
				this.cubelets[0], this.cubelets[1], this.cubelets[2]
			)
			this.up.name = 'up'
			this.equator = new Slice(

				this.cubelets[21], this.cubelets[22], this.cubelets[23],
				this.cubelets[12], this.cubelets[13], this.cubelets[14],
				this.cubelets[3], this.cubelets[4], this.cubelets[5]
			)
			this.equator.name = 'equator'
			this.down = new Slice(

				this.cubelets[8], this.cubelets[17], this.cubelets[26],
				this.cubelets[7], this.cubelets[16], this.cubelets[25],
				this.cubelets[6], this.cubelets[15], this.cubelets[24]
			)
			this.down.name = 'down'

			//add by kirahan in order to rotate u and d
			this.up2layer = new Slice(
				//up
				this.cubelets[18], this.cubelets[19], this.cubelets[20],
				this.cubelets[9], this.cubelets[10], this.cubelets[11],
				this.cubelets[0], this.cubelets[1], this.cubelets[2],

				//equator
				this.cubelets[21], this.cubelets[22], this.cubelets[23],
				this.cubelets[12], this.cubelets[13], this.cubelets[14],
				this.cubelets[3], this.cubelets[4], this.cubelets[5]
			)
			this.up2layer.name = 'up2layer'

			this.down2layer = new Slice(
				//down
				this.cubelets[8], this.cubelets[17], this.cubelets[26],
				this.cubelets[7], this.cubelets[16], this.cubelets[25],
				this.cubelets[6], this.cubelets[15], this.cubelets[24],

				//equator
				this.cubelets[21], this.cubelets[22], this.cubelets[23],
				this.cubelets[12], this.cubelets[13], this.cubelets[14],
				this.cubelets[3], this.cubelets[4], this.cubelets[5]
			)
			this.down2layer.name = 'down2layer'


			//  Slices are Groups with purpose; they are rotate-able!
			//  These are Slices that can rotate about the Z-axis:

			this.front = new Slice(

				this.cubelets[0], this.cubelets[1], this.cubelets[2],
				this.cubelets[3], this.cubelets[4], this.cubelets[5],
				this.cubelets[6], this.cubelets[7], this.cubelets[8]
			)
			this.front.name = 'front'
			this.standing = new Slice(

				this.cubelets[9], this.cubelets[10], this.cubelets[11],
				this.cubelets[12], this.cubelets[13], this.cubelets[14],
				this.cubelets[15], this.cubelets[16], this.cubelets[17]
			)
			this.standing.name = 'standing'
			this.back = new Slice(

				this.cubelets[26], this.cubelets[23], this.cubelets[20],
				this.cubelets[25], this.cubelets[22], this.cubelets[19],
				this.cubelets[24], this.cubelets[21], this.cubelets[18]
			)
			this.back.name = 'back'


			//add by kirahan in order to rotate f and b
			this.front2layer = new Slice(
				//front
				this.cubelets[0], this.cubelets[1], this.cubelets[2],
				this.cubelets[3], this.cubelets[4], this.cubelets[5],
				this.cubelets[6], this.cubelets[7], this.cubelets[8],

				//standing
				this.cubelets[9], this.cubelets[10], this.cubelets[11],
				this.cubelets[12], this.cubelets[13], this.cubelets[14],
				this.cubelets[15], this.cubelets[16], this.cubelets[17]
			)
			this.front2layer.name = 'front2layer'

			this.back2layer = new Slice(
				//back
				this.cubelets[26], this.cubelets[23], this.cubelets[20],
				this.cubelets[25], this.cubelets[22], this.cubelets[19],
				this.cubelets[24], this.cubelets[21], this.cubelets[18],

				//standing
				this.cubelets[9], this.cubelets[10], this.cubelets[11],
				this.cubelets[12], this.cubelets[13], this.cubelets[14],
				this.cubelets[15], this.cubelets[16], this.cubelets[17]
			)
			this.back2layer.name = 'back2layer'

			//  Faces .... special kind of Slice!

			this.faces = [this.front, this.up, this.right, this.down, this.left, this.back]


			//  Good to let each Cubelet know where it exists
			//  in relationship to our full Cube.

			for (i = 0; i < this.cubelets.length; i++) {

				this.cubelets[i].setAddress(i)
			}

			this.cubeStage = {
				faces: {},
				layer1sideface: {},
				layer2sideface: {},
				layer3cornerface: {},
				layer3topcross: {},
			}

			// 计算每个面的颜色情况
			let faceListName = ['up', 'down', 'front', 'back', 'left', 'right']
			for (let face of faceListName) {
				this.cubeStage.faces[face] = {}
				for (let cubelet of this[face].cubelets) {
					let color = cubelet[face].color.name
					if (this.cubeStage.faces[face][color] === undefined) {
						this.cubeStage.faces[face][color] = 1
					} else {
						this.cubeStage.faces[face][color]++
					}
				}
			}

			// 计算一层侧面的情况的颜色情况
			let layer1sidefaceListName1 = ['front', 'right']
			let layer1sidefaceListName2 = ['back', 'left']
			for (let face of layer1sidefaceListName1) {
				this.cubeStage.layer1sideface[face] = {}
				for (let cubelet of this[face].down.cubelets) {
					let color = cubelet[face].color.name
					if (this.cubeStage.layer1sideface[face][color] === undefined) {
						this.cubeStage.layer1sideface[face][color] = 1
					} else {
						this.cubeStage.layer1sideface[face][color]++
					}
				}
			}
			for (let face of layer1sidefaceListName2) {
				this.cubeStage.layer1sideface[face] = {}
				for (let cubelet of this[face].left.cubelets) {
					let color = cubelet[face].color.name
					if (this.cubeStage.layer1sideface[face][color] === undefined) {
						this.cubeStage.layer1sideface[face][color] = 1
					} else {
						this.cubeStage.layer1sideface[face][color]++
					}
				}
			}

			// 计算二层侧面的情况的颜色情况
			let layer2sidefaceListName1 = ['front', 'right']
			let layer2sidefaceListName2 = ['back', 'left']
			for (let face of layer2sidefaceListName1) {
				this.cubeStage.layer2sideface[face] = {}
				let face2layer = this[face].down.cubelets
				let faceequator = this[face].equator.cubelets
				face2layer.push(...faceequator) 
				for (let cubelet of face2layer) {
					let color = cubelet[face].color.name
					if (this.cubeStage.layer2sideface[face][color] === undefined) {
						this.cubeStage.layer2sideface[face][color] = 1
					} else {
						this.cubeStage.layer2sideface[face][color]++
					}
				}
			}
			for (let face of layer2sidefaceListName2) {
				this.cubeStage.layer2sideface[face] = {}
				let face2layer = this[face].left.cubelets
				let facemiddle = this[face].middle.cubelets
				face2layer.push(...facemiddle) 
				for (let cubelet of face2layer) {
					let color = cubelet[face].color.name
					if (this.cubeStage.layer2sideface[face][color] === undefined) {
						this.cubeStage.layer2sideface[face][color] = 1
					} else {
						this.cubeStage.layer2sideface[face][color]++
					}
				}
			}

			// 计算顶层侧面角块的情况的颜色情况
			let layer3cornerfaceListName1 = ['front', 'right']
			let layer3cornerfaceListName2 = ['back', 'left']
			for (let face of layer3cornerfaceListName1) {
				this.cubeStage.layer3cornerface[face] = {}
				for (let cubelet of [this[face].northWest, this[face].northEast]) {
					let color = cubelet[face].color.name
					if (this.cubeStage.layer3cornerface[face][color] === undefined) {
						this.cubeStage.layer3cornerface[face][color] = 1
					} else {
						this.cubeStage.layer3cornerface[face][color]++
					}
				}
			}
			for (let face of layer3cornerfaceListName2) {
				this.cubeStage.layer3cornerface[face] = {}
				for (let cubelet of [this[face].northEast, this[face].southEast]) {
					let color = cubelet[face].color.name
					if (this.cubeStage.layer3cornerface[face][color] === undefined) {
						this.cubeStage.layer3cornerface[face][color] = 1
					} else {
						this.cubeStage.layer3cornerface[face][color]++
					}
				}
			}

			// 计算顶面十字的颜色情况
			this.cubeStage.layer3topcross = {}
			for (let cubelet of [this.up.north, this.up.south, this.up.west, this.up.east]) {
				let color = cubelet.up.color.name
				if (this.cubeStage.layer3topcross[color] === undefined) {
					this.cubeStage.layer3topcross[color] = 1
				} else {
					this.cubeStage.layer3topcross[color]++
				}
			}




		},

		//  We'll inspect the Cube by specifically inspecting the Faces.
		//  Bear in mind this is merely one way to think about the Cube
		//  and does require some redundancy in terms of Cubelet indexes.
		//  Here we'll default to 'compact' mode in order to give the
		//  full Cube overview in the least amount of space.

		inspect: function (compact, side) {

			compact = !compact

			this.front.inspect(compact, side)
			this.up.inspect(compact, side)
			this.right.inspect(compact, side)
			this.down.inspect(compact, side)
			this.left.inspect(compact, side)
			this.back.inspect(compact, side)
		},




		solve: function () {

			this.isSolving = true
		},
		isSolved: function () {
			var
				FRONT = new Direction(0, 'front'),
				UP = new Direction(1, 'up'),
				RIGHT = new Direction(2, 'right'),
				DOWN = new Direction(3, 'down'),
				LEFT = new Direction(4, 'left'),
				BACK = new Direction(5, 'back')
			return (

				this.front.isSolved(FRONT) &&
				this.up.isSolved(UP) &&
				this.right.isSolved(RIGHT) &&
				this.down.isSolved(DOWN) &&
				this.left.isSolved(LEFT) &&
				this.back.isSolved(BACK)
			)
		},

		twist: function (twist) {
			var thiscube = this
			var onTwistComplete
			// console.log(`[debug|twist] ${twist}`)
			if (twist instanceof Twist && !thiscube.isTweening()) {
				var command = twist.command
				var degrees = twist.degrees
				// console.log(`[debug|twist] ${twist}`)

				//  X-axis rotations

				if (command === 'X' && !thiscube.isEngagedY() && !thiscube.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets = [
							//front
							swap[6], swap[7], swap[8],
							swap[15], swap[16], swap[17],
							swap[24], swap[25], swap[26],
							//standing
							swap[3], swap[4], swap[5],
							swap[12], swap[13], swap[14],
							swap[21], swap[22], swap[23],
							//back
							swap[0], swap[1], swap[2],
							swap[9], swap[10], swap[11],
							swap[18], swap[19], swap[20]
						]
					}
					if (degrees === undefined)
						degrees = thiscube.getDistanceToPeg('X')
					thiscube.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.cubelets.length - 1) cubelet.rotate('X', degrees, onTwistComplete)
						else cubelet.rotate('X', degrees)
					})
				}
				else if (command === "X'" && !thiscube.isEngagedY() && !thiscube.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets = [
							//front
							swap[18], swap[19], swap[20],
							swap[9], swap[10], swap[11],
							swap[0], swap[1], swap[2],
							//standing
							swap[21], swap[22], swap[23],
							swap[12], swap[13], swap[14],
							swap[3], swap[4], swap[5],
							//back
							swap[24], swap[25], swap[26],
							swap[15], swap[16], swap[17],
							swap[6], swap[7], swap[8]
						]
					}
					if (degrees === undefined) degrees = thiscube.getDistanceToPeg('x')
					thiscube.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.cubelets.length - 1) cubelet.rotate('x', degrees, onTwistComplete)
						else cubelet.rotate('x', degrees)
					})
				}
				else if (command === "R" && !thiscube.right.isEngagedY() && !thiscube.right.isEngagedZ()) {

					onTwistComplete = function (swap) {
						thiscube.cubelets[2] = swap[8]
						thiscube.cubelets[11] = swap[5]
						thiscube.cubelets[20] = swap[2]
						thiscube.cubelets[5] = swap[17]
						thiscube.cubelets[23] = swap[11]
						thiscube.cubelets[8] = swap[26]
						thiscube.cubelets[17] = swap[23]
						thiscube.cubelets[26] = swap[20]
					}
					if (degrees === undefined) degrees = thiscube.right.getDistanceToPeg('X')
					thiscube.right.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.right.cubelets.length - 1) cubelet.rotate('X', degrees, onTwistComplete)
						else cubelet.rotate('X', degrees)
					})

				}
				else if (command === "R'" && !thiscube.right.isEngagedY() && !thiscube.right.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[2] = swap[20]
						thiscube.cubelets[11] = swap[23]
						thiscube.cubelets[20] = swap[26]
						thiscube.cubelets[5] = swap[11]
						thiscube.cubelets[23] = swap[17]
						thiscube.cubelets[8] = swap[2]
						thiscube.cubelets[17] = swap[5]
						thiscube.cubelets[26] = swap[8]
					}
					if (degrees === undefined) degrees = thiscube.right.getDistanceToPeg('x')
					thiscube.right.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.right.cubelets.length - 1) cubelet.rotate('x', degrees, onTwistComplete)
						else cubelet.rotate('x', degrees)
					})
				}
				else if (command === "M'" && !thiscube.middle.isEngagedY() && !thiscube.middle.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[1] = swap[19]
						thiscube.cubelets[10] = swap[22]
						thiscube.cubelets[19] = swap[25]
						thiscube.cubelets[4] = swap[10]
						thiscube.cubelets[22] = swap[16]
						thiscube.cubelets[7] = swap[1]
						thiscube.cubelets[16] = swap[4]
						thiscube.cubelets[25] = swap[7]
					}
					if (degrees === undefined) degrees = thiscube.middle.getDistanceToPeg('x')
					thiscube.middle.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.middle.cubelets.length - 1) cubelet.rotate('x', degrees, onTwistComplete)
						else cubelet.rotate('x', degrees)
					})
				}
				else if (command === "M" && !thiscube.middle.isEngagedY() && !thiscube.middle.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[1] = swap[7]
						thiscube.cubelets[10] = swap[4]
						thiscube.cubelets[19] = swap[1]
						thiscube.cubelets[4] = swap[16]
						thiscube.cubelets[22] = swap[10]
						thiscube.cubelets[7] = swap[25]
						thiscube.cubelets[16] = swap[22]
						thiscube.cubelets[25] = swap[19]
					}
					if (degrees === undefined) degrees = thiscube.middle.getDistanceToPeg('X')
					thiscube.middle.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.middle.cubelets.length - 1) cubelet.rotate('X', degrees, onTwistComplete)
						else cubelet.rotate('X', degrees, onTwistComplete)
					})
				}
				else if (command === "L" && !thiscube.left.isEngagedY() && !thiscube.left.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[18] = swap[24]
						thiscube.cubelets[9] = swap[21]
						thiscube.cubelets[0] = swap[18]
						thiscube.cubelets[21] = swap[15]
						thiscube.cubelets[3] = swap[9]
						thiscube.cubelets[24] = swap[6]
						thiscube.cubelets[15] = swap[3]
						thiscube.cubelets[6] = swap[0]
					}
					if (degrees === undefined) degrees = thiscube.left.getDistanceToPeg('x')
					thiscube.left.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.left.cubelets.length - 1) cubelet.rotate('x', degrees, onTwistComplete)
						else cubelet.rotate('x', degrees)
					})
				}
				else if (command === "L'" && !thiscube.left.isEngagedY() && !thiscube.left.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[18] = swap[0]
						thiscube.cubelets[9] = swap[3]
						thiscube.cubelets[0] = swap[6]
						thiscube.cubelets[21] = swap[9]
						thiscube.cubelets[3] = swap[15]
						thiscube.cubelets[24] = swap[18]
						thiscube.cubelets[15] = swap[21]
						thiscube.cubelets[6] = swap[24]
					}
					if (degrees === undefined) degrees = thiscube.left.getDistanceToPeg('X')
					thiscube.left.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.left.cubelets.length - 1) cubelet.rotate('X', degrees, onTwistComplete)
						else cubelet.rotate('X', degrees)
					})
				}
				//add by kira  build right2layer left2layer group's rotate  change in twist.js(line 31) and cubes.js
				else if (command === "r" && !thiscube.right.isEngagedY() && !thiscube.left.isEngagedZ() && !thiscube.middle.isEngagedY() && !thiscube.middle.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[2] = swap[8]
						thiscube.cubelets[11] = swap[5]
						thiscube.cubelets[20] = swap[2]
						thiscube.cubelets[5] = swap[17]
						thiscube.cubelets[23] = swap[11]
						thiscube.cubelets[8] = swap[26]
						thiscube.cubelets[17] = swap[23]
						thiscube.cubelets[26] = swap[20]

						thiscube.cubelets[1] = swap[7]
						thiscube.cubelets[10] = swap[4]
						thiscube.cubelets[19] = swap[1]
						thiscube.cubelets[4] = swap[16]
						thiscube.cubelets[22] = swap[10]
						thiscube.cubelets[7] = swap[25]
						thiscube.cubelets[16] = swap[22]
						thiscube.cubelets[25] = swap[19]

					}
					if (degrees === undefined) degrees = thiscube.right2layer.getDistanceToPeg('X')
					thiscube.right2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.right2layer.cubelets.length - 1) cubelet.rotate('X', degrees, onTwistComplete)
						else cubelet.rotate('X', degrees)
					})
				}
				else if (command === "r'" && !thiscube.right.isEngagedY() && !thiscube.left.isEngagedZ() && !thiscube.middle.isEngagedY() && !thiscube.middle.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[2] = swap[20]
						thiscube.cubelets[11] = swap[23]
						thiscube.cubelets[20] = swap[26]
						thiscube.cubelets[5] = swap[11]
						thiscube.cubelets[23] = swap[17]
						thiscube.cubelets[8] = swap[2]
						thiscube.cubelets[17] = swap[5]
						thiscube.cubelets[26] = swap[8]

						thiscube.cubelets[1] = swap[19]
						thiscube.cubelets[10] = swap[22]
						thiscube.cubelets[19] = swap[25]
						thiscube.cubelets[4] = swap[10]
						thiscube.cubelets[22] = swap[16]
						thiscube.cubelets[7] = swap[1]
						thiscube.cubelets[16] = swap[4]
						thiscube.cubelets[25] = swap[7]

					}
					if (degrees === undefined) degrees = thiscube.right2layer.getDistanceToPeg('x')
					thiscube.right2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.right2layer.cubelets.length - 1) cubelet.rotate('x', degrees, onTwistComplete)
						else cubelet.rotate('x', degrees)
					})
				}
				else if (command === "l" && !thiscube.left.isEngagedY() && !thiscube.left.isEngagedZ() && !thiscube.middle.isEngagedY() && !thiscube.middle.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[18] = swap[24]
						thiscube.cubelets[9] = swap[21]
						thiscube.cubelets[0] = swap[18]
						thiscube.cubelets[21] = swap[15]
						thiscube.cubelets[3] = swap[9]
						thiscube.cubelets[24] = swap[6]
						thiscube.cubelets[15] = swap[3]
						thiscube.cubelets[6] = swap[0]

						thiscube.cubelets[1] = swap[19]
						thiscube.cubelets[10] = swap[22]
						thiscube.cubelets[19] = swap[25]
						thiscube.cubelets[4] = swap[10]
						thiscube.cubelets[22] = swap[16]
						thiscube.cubelets[7] = swap[1]
						thiscube.cubelets[16] = swap[4]
						thiscube.cubelets[25] = swap[7]

					}
					if (degrees === undefined) degrees = thiscube.left2layer.getDistanceToPeg('x')
					thiscube.left2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.left2layer.cubelets.length - 1) cubelet.rotate('x', degrees, onTwistComplete)
						else cubelet.rotate('x', degrees)
					})
				}
				else if (command === "l'" && !thiscube.left.isEngagedY() && !thiscube.left.isEngagedZ() && !thiscube.middle.isEngagedY() && !thiscube.middle.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[18] = swap[0]
						thiscube.cubelets[9] = swap[3]
						thiscube.cubelets[0] = swap[6]
						thiscube.cubelets[21] = swap[9]
						thiscube.cubelets[3] = swap[15]
						thiscube.cubelets[24] = swap[18]
						thiscube.cubelets[15] = swap[21]
						thiscube.cubelets[6] = swap[24]

						thiscube.cubelets[1] = swap[7]
						thiscube.cubelets[10] = swap[4]
						thiscube.cubelets[19] = swap[1]
						thiscube.cubelets[4] = swap[16]
						thiscube.cubelets[22] = swap[10]
						thiscube.cubelets[7] = swap[25]
						thiscube.cubelets[16] = swap[22]
						thiscube.cubelets[25] = swap[19]

					}
					if (degrees === undefined) degrees = thiscube.left2layer.getDistanceToPeg('X')
					thiscube.left2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.left2layer.cubelets.length - 1) cubelet.rotate('X', degrees, onTwistComplete)
						else cubelet.rotate('X', degrees)
					})
				}


				//  Y-axis rotations

				if (command === 'Y' && !thiscube.isEngagedX() && !thiscube.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets = [

							swap[2], swap[11], swap[20],
							swap[5], swap[14], swap[23],
							swap[8], swap[17], swap[26],

							swap[1], swap[10], swap[19],
							swap[4], swap[13], swap[22],
							swap[7], swap[16], swap[25],

							swap[0], swap[9], swap[18],
							swap[3], swap[12], swap[21],
							swap[6], swap[15], swap[24]
						]
					}
					if (degrees === undefined) degrees = thiscube.getDistanceToPeg('Y')
					thiscube.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.cubelets.length - 1) cubelet.rotate('Y', degrees, onTwistComplete)
						else cubelet.rotate('Y', degrees)
					})
				}
				else if (command === "Y'" && !thiscube.isEngagedX() && !thiscube.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets = [

							swap[18], swap[9], swap[0],
							swap[21], swap[12], swap[3],
							swap[24], swap[15], swap[6],

							swap[19], swap[10], swap[1],
							swap[22], swap[13], swap[4],
							swap[25], swap[16], swap[7],

							swap[20], swap[11], swap[2],
							swap[23], swap[14], swap[5],
							swap[26], swap[17], swap[8]
						]
					}
					if (degrees === undefined) degrees = thiscube.getDistanceToPeg('y')
					thiscube.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.cubelets.length - 1) cubelet.rotate('y', degrees, onTwistComplete)
						else cubelet.rotate('y', degrees)
					})
				}
				else if (command === "U" && !thiscube.up.isEngagedX() && !thiscube.up.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[18] = swap[0]
						thiscube.cubelets[19] = swap[9]
						thiscube.cubelets[20] = swap[18]
						thiscube.cubelets[9] = swap[1]
						thiscube.cubelets[11] = swap[19]
						thiscube.cubelets[0] = swap[2]
						thiscube.cubelets[1] = swap[11]
						thiscube.cubelets[2] = swap[20]
					}
					if (degrees === undefined) degrees = thiscube.up.getDistanceToPeg('Y')
					thiscube.up.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.up.cubelets.length - 1) cubelet.rotate('Y', degrees, onTwistComplete)
						else cubelet.rotate('Y', degrees)
					})
				}
				else if (command === "U'" && !thiscube.up.isEngagedX() & !thiscube.up.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[18] = swap[20]
						thiscube.cubelets[19] = swap[11]
						thiscube.cubelets[20] = swap[2]
						thiscube.cubelets[9] = swap[19]
						thiscube.cubelets[11] = swap[1]
						thiscube.cubelets[0] = swap[18]
						thiscube.cubelets[1] = swap[9]
						thiscube.cubelets[2] = swap[0]
					}
					if (degrees === undefined) degrees = thiscube.up.getDistanceToPeg('y')
					thiscube.up.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.up.cubelets.length - 1) cubelet.rotate('y', degrees, onTwistComplete)
						else cubelet.rotate('y', degrees)
					})
				}
				else if (command === "E" && !thiscube.equator.isEngagedX() && !thiscube.equator.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[21] = swap[23]
						thiscube.cubelets[22] = swap[14]
						thiscube.cubelets[23] = swap[5]
						thiscube.cubelets[12] = swap[22]
						thiscube.cubelets[14] = swap[4]
						thiscube.cubelets[3] = swap[21]
						thiscube.cubelets[4] = swap[12]
						thiscube.cubelets[5] = swap[3]
					}
					if (degrees === undefined) degrees = thiscube.equator.getDistanceToPeg('y')
					thiscube.equator.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.equator.cubelets.length - 1) cubelet.rotate('y', degrees, onTwistComplete)
						else cubelet.rotate('y', degrees)
					})
				}
				else if (command === "E'" && !thiscube.equator.isEngagedX() && !thiscube.equator.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[21] = swap[3]
						thiscube.cubelets[22] = swap[12]
						thiscube.cubelets[23] = swap[21]
						thiscube.cubelets[12] = swap[4]
						thiscube.cubelets[14] = swap[22]
						thiscube.cubelets[3] = swap[5]
						thiscube.cubelets[4] = swap[14]
						thiscube.cubelets[5] = swap[23]
					}
					if (degrees === undefined) degrees = thiscube.equator.getDistanceToPeg('Y')
					thiscube.equator.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.equator.cubelets.length - 1) cubelet.rotate('Y', degrees, onTwistComplete)
						else cubelet.rotate('Y', degrees)
					})
				}
				else if (command === "D" && !thiscube.down.isEngagedX() && !thiscube.down.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[6] = swap[24]
						thiscube.cubelets[7] = swap[15]
						thiscube.cubelets[8] = swap[6]
						thiscube.cubelets[15] = swap[25]
						thiscube.cubelets[17] = swap[7]
						thiscube.cubelets[24] = swap[26]
						thiscube.cubelets[25] = swap[17]
						thiscube.cubelets[26] = swap[8]
					}
					if (degrees === undefined) degrees = thiscube.down.getDistanceToPeg('y')
					thiscube.down.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.down.cubelets.length - 1) cubelet.rotate('y', degrees, onTwistComplete)
						else cubelet.rotate('y', degrees)
					})
				}
				else if (command === "D'" && !thiscube.down.isEngagedX() && !thiscube.down.isEngagedZ()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[6] = swap[8]
						thiscube.cubelets[7] = swap[17]
						thiscube.cubelets[8] = swap[26]
						thiscube.cubelets[15] = swap[7]
						thiscube.cubelets[17] = swap[25]
						thiscube.cubelets[24] = swap[6]
						thiscube.cubelets[25] = swap[15]
						thiscube.cubelets[26] = swap[24]
					}
					if (degrees === undefined) degrees = thiscube.down.getDistanceToPeg('Y')
					thiscube.down.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.down.cubelets.length - 1) cubelet.rotate('Y', degrees, onTwistComplete)
						else cubelet.rotate('Y', degrees)
					})
				}
				//add by kira  build up2layer down2layer group's rotate  change in twist.js(line 31) and cubes.js
				else if (command === 'u' && !thiscube.up.isEngagedX() & !thiscube.up.isEngagedZ() && !thiscube.equator.isEngagedX() && !thiscube.equator.isEngagedZ()) {

					onTwistComplete = function (swap) {
						//U
						thiscube.cubelets[18] = swap[0]
						thiscube.cubelets[19] = swap[9]
						thiscube.cubelets[20] = swap[18]
						thiscube.cubelets[9] = swap[1]
						thiscube.cubelets[11] = swap[19]
						thiscube.cubelets[0] = swap[2]
						thiscube.cubelets[1] = swap[11]
						thiscube.cubelets[2] = swap[20]

						//E'
						thiscube.cubelets[21] = swap[3]
						thiscube.cubelets[22] = swap[12]
						thiscube.cubelets[23] = swap[21]
						thiscube.cubelets[12] = swap[4]
						thiscube.cubelets[14] = swap[22]
						thiscube.cubelets[3] = swap[5]
						thiscube.cubelets[4] = swap[14]
						thiscube.cubelets[5] = swap[23]

					}
					if (degrees === undefined) degrees = thiscube.up2layer.getDistanceToPeg('Y')
					thiscube.up2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.up2layer.cubelets.length - 1) cubelet.rotate('Y', degrees, onTwistComplete)
						else cubelet.rotate('Y', degrees)
					})
				}
				else if (command === "u'" && !thiscube.up.isEngagedX() & !thiscube.up.isEngagedZ() && !thiscube.equator.isEngagedX() && !thiscube.equator.isEngagedZ()) {

					onTwistComplete = function (swap) {
						//U'
						thiscube.cubelets[18] = swap[20]
						thiscube.cubelets[19] = swap[11]
						thiscube.cubelets[20] = swap[2]
						thiscube.cubelets[9] = swap[19]
						thiscube.cubelets[11] = swap[1]
						thiscube.cubelets[0] = swap[18]
						thiscube.cubelets[1] = swap[9]
						thiscube.cubelets[2] = swap[0]

						//E
						thiscube.cubelets[21] = swap[23]
						thiscube.cubelets[22] = swap[14]
						thiscube.cubelets[23] = swap[5]
						thiscube.cubelets[12] = swap[22]
						thiscube.cubelets[14] = swap[4]
						thiscube.cubelets[3] = swap[21]
						thiscube.cubelets[4] = swap[12]
						thiscube.cubelets[5] = swap[3]

					}
					if (degrees === undefined) degrees = thiscube.up2layer.getDistanceToPeg('y')
					thiscube.up2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.up2layer.cubelets.length - 1) cubelet.rotate('y', degrees, onTwistComplete)
						else cubelet.rotate('y', degrees)
					})
				}
				else if (command === "d" && !thiscube.down.isEngagedX() & !thiscube.down.isEngagedZ() && !thiscube.equator.isEngagedX() && !thiscube.equator.isEngagedZ()) {

					onTwistComplete = function (swap) {
						//D
						thiscube.cubelets[6] = swap[24]
						thiscube.cubelets[7] = swap[15]
						thiscube.cubelets[8] = swap[6]
						thiscube.cubelets[15] = swap[25]
						thiscube.cubelets[17] = swap[7]
						thiscube.cubelets[24] = swap[26]
						thiscube.cubelets[25] = swap[17]
						thiscube.cubelets[26] = swap[8]

						//E
						thiscube.cubelets[21] = swap[23]
						thiscube.cubelets[22] = swap[14]
						thiscube.cubelets[23] = swap[5]
						thiscube.cubelets[12] = swap[22]
						thiscube.cubelets[14] = swap[4]
						thiscube.cubelets[3] = swap[21]
						thiscube.cubelets[4] = swap[12]
						thiscube.cubelets[5] = swap[3]

					}
					if (degrees === undefined) degrees = thiscube.down2layer.getDistanceToPeg('y')
					thiscube.down2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.down2layer.cubelets.length - 1) cubelet.rotate('y', degrees, onTwistComplete)
						else cubelet.rotate('y', degrees)
					})
				}
				else if (command === "d'" && !thiscube.down.isEngagedX() & !thiscube.down.isEngagedZ() && !thiscube.equator.isEngagedX() && !thiscube.equator.isEngagedZ()) {

					onTwistComplete = function (swap) {
						//D'
						thiscube.cubelets[6] = swap[8]
						thiscube.cubelets[7] = swap[17]
						thiscube.cubelets[8] = swap[26]
						thiscube.cubelets[15] = swap[7]
						thiscube.cubelets[17] = swap[25]
						thiscube.cubelets[24] = swap[6]
						thiscube.cubelets[25] = swap[15]
						thiscube.cubelets[26] = swap[24]

						//E'
						thiscube.cubelets[21] = swap[3]
						thiscube.cubelets[22] = swap[12]
						thiscube.cubelets[23] = swap[21]
						thiscube.cubelets[12] = swap[4]
						thiscube.cubelets[14] = swap[22]
						thiscube.cubelets[3] = swap[5]
						thiscube.cubelets[4] = swap[14]
						thiscube.cubelets[5] = swap[23]

					}
					if (degrees === undefined) degrees = thiscube.down2layer.getDistanceToPeg('Y')
					thiscube.down2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.down2layer.cubelets.length - 1) cubelet.rotate('Y', degrees, onTwistComplete)
						else cubelet.rotate('Y', degrees)
					})
				}

				//  Z-axis rotations

				if (command === 'Z' && !thiscube.isEngagedX() && !thiscube.isEngagedY()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets = [

							swap[6], swap[3], swap[0],
							swap[7], swap[4], swap[1],
							swap[8], swap[5], swap[2],

							swap[15], swap[12], swap[9],
							swap[16], swap[13], swap[10],
							swap[17], swap[14], swap[11],

							swap[24], swap[21], swap[18],
							swap[25], swap[22], swap[19],
							swap[26], swap[23], swap[20]
						]
					}
					if (degrees === undefined) degrees = thiscube.getDistanceToPeg('Z')
					thiscube.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.cubelets.length - 1) cubelet.rotate('Z', degrees, onTwistComplete)
						else cubelet.rotate('Z', degrees)
					})
				}
				else if (command === "Z'" && !thiscube.isEngagedX() && !thiscube.isEngagedY()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets = [

							swap[2], swap[5], swap[8],
							swap[1], swap[4], swap[7],
							swap[0], swap[3], swap[6],

							swap[11], swap[14], swap[17],
							swap[10], swap[13], swap[16],
							swap[9], swap[12], swap[15],

							swap[20], swap[23], swap[26],
							swap[19], swap[22], swap[25],
							swap[18], swap[21], swap[24]
						]
					}
					if (degrees === undefined) degrees = thiscube.getDistanceToPeg('z')
					thiscube.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.cubelets.length - 1) cubelet.rotate('z', degrees, onTwistComplete)
						else cubelet.rotate('z', degrees)
					})
				}
				else if (command === "F" && !thiscube.front.isEngagedX() && !thiscube.front.isEngagedY()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[0] = swap[6]
						thiscube.cubelets[1] = swap[3]
						thiscube.cubelets[2] = swap[0]
						thiscube.cubelets[3] = swap[7]
						thiscube.cubelets[5] = swap[1]
						thiscube.cubelets[6] = swap[8]
						thiscube.cubelets[7] = swap[5]
						thiscube.cubelets[8] = swap[2]
					}
					if (degrees === undefined) degrees = thiscube.front.getDistanceToPeg('Z')
					thiscube.front.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.front.cubelets.length - 1) cubelet.rotate('Z', degrees, onTwistComplete)
						else cubelet.rotate('Z', degrees)
					})
				}
				else if (command === "F'" && !thiscube.front.isEngagedX() && !thiscube.front.isEngagedY()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[0] = swap[2]
						thiscube.cubelets[1] = swap[5]
						thiscube.cubelets[2] = swap[8]
						thiscube.cubelets[3] = swap[1]
						thiscube.cubelets[5] = swap[7]
						thiscube.cubelets[6] = swap[0]
						thiscube.cubelets[7] = swap[3]
						thiscube.cubelets[8] = swap[6]
					}
					if (degrees === undefined) degrees = thiscube.front.getDistanceToPeg('z')
					thiscube.front.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.front.cubelets.length - 1) cubelet.rotate('z', degrees, onTwistComplete)
						else cubelet.rotate('z', degrees)
					})
				}
				else if (command === "S" && !thiscube.standing.isEngagedX() && !thiscube.standing.isEngagedY()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[9] = swap[15]
						thiscube.cubelets[10] = swap[12]
						thiscube.cubelets[11] = swap[9]
						thiscube.cubelets[12] = swap[16]
						thiscube.cubelets[14] = swap[10]
						thiscube.cubelets[15] = swap[17]
						thiscube.cubelets[16] = swap[14]
						thiscube.cubelets[17] = swap[11]
					}
					if (degrees === undefined) degrees = thiscube.standing.getDistanceToPeg('Z')
					thiscube.standing.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.standing.cubelets.length - 1) cubelet.rotate('Z', degrees, onTwistComplete)
						else cubelet.rotate('Z', degrees)
					})
				}
				else if (command === "S'" && !thiscube.standing.isEngagedX() && !thiscube.standing.isEngagedY()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[9] = swap[11]
						thiscube.cubelets[10] = swap[14]
						thiscube.cubelets[11] = swap[17]
						thiscube.cubelets[12] = swap[10]
						thiscube.cubelets[14] = swap[16]
						thiscube.cubelets[15] = swap[9]
						thiscube.cubelets[16] = swap[12]
						thiscube.cubelets[17] = swap[15]
					}
					if (degrees === undefined) degrees = thiscube.standing.getDistanceToPeg('z')
					thiscube.standing.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.standing.cubelets.length - 1) cubelet.rotate('z', degrees, onTwistComplete)
						else cubelet.rotate('z', degrees)
					})
				}
				else if (command === "B" && !thiscube.back.isEngagedX() && !thiscube.back.isEngagedY()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[18] = swap[20]
						thiscube.cubelets[19] = swap[23]
						thiscube.cubelets[20] = swap[26]
						thiscube.cubelets[21] = swap[19]
						thiscube.cubelets[23] = swap[25]
						thiscube.cubelets[24] = swap[18]
						thiscube.cubelets[25] = swap[21]
						thiscube.cubelets[26] = swap[24]
					}
					if (degrees === undefined) degrees = thiscube.back.getDistanceToPeg('z')
					thiscube.back.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.back.cubelets.length - 1) cubelet.rotate('z', degrees, onTwistComplete)
						else cubelet.rotate('z', degrees)
					})
				}
				else if (command === "B'" && !thiscube.back.isEngagedX() && !thiscube.back.isEngagedY()) {

					onTwistComplete = function (swap) {

						thiscube.cubelets[18] = swap[24]
						thiscube.cubelets[19] = swap[21]
						thiscube.cubelets[20] = swap[18]
						thiscube.cubelets[21] = swap[25]
						thiscube.cubelets[23] = swap[19]
						thiscube.cubelets[24] = swap[26]
						thiscube.cubelets[25] = swap[23]
						thiscube.cubelets[26] = swap[20]
					}
					if (degrees === undefined) degrees = thiscube.back.getDistanceToPeg('Z')
					thiscube.back.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.back.cubelets.length - 1) cubelet.rotate('Z', degrees, onTwistComplete)
						else cubelet.rotate('Z', degrees)
					})
				}
				//add by kira  build front2layer back2layer group's rotate  change in twist.js(line 31) and cubes.js
				else if (command === "f" && !thiscube.front.isEngagedX() && !thiscube.front.isEngagedY() && !thiscube.standing.isEngagedX() && !thiscube.standing.isEngagedY()) {

					onTwistComplete = function (swap) {
						//F
						thiscube.cubelets[0] = swap[6]
						thiscube.cubelets[1] = swap[3]
						thiscube.cubelets[2] = swap[0]
						thiscube.cubelets[3] = swap[7]
						thiscube.cubelets[5] = swap[1]
						thiscube.cubelets[6] = swap[8]
						thiscube.cubelets[7] = swap[5]
						thiscube.cubelets[8] = swap[2]

						//S
						thiscube.cubelets[9] = swap[15]
						thiscube.cubelets[10] = swap[12]
						thiscube.cubelets[11] = swap[9]
						thiscube.cubelets[12] = swap[16]
						thiscube.cubelets[14] = swap[10]
						thiscube.cubelets[15] = swap[17]
						thiscube.cubelets[16] = swap[14]
						thiscube.cubelets[17] = swap[11]
					}
					if (degrees === undefined) degrees = thiscube.front2layer.getDistanceToPeg('Z')
					thiscube.front2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.front2layer.cubelets.length - 1) cubelet.rotate('Z', degrees, onTwistComplete)
						else cubelet.rotate('Z', degrees)
					})
				}
				else if (command === "f'" && !thiscube.front.isEngagedX() && !thiscube.front.isEngagedY() && !thiscube.standing.isEngagedX() && !thiscube.standing.isEngagedY()) {

					onTwistComplete = function (swap) {
						//F'
						thiscube.cubelets[0] = swap[2]
						thiscube.cubelets[1] = swap[5]
						thiscube.cubelets[2] = swap[8]
						thiscube.cubelets[3] = swap[1]
						thiscube.cubelets[5] = swap[7]
						thiscube.cubelets[6] = swap[0]
						thiscube.cubelets[7] = swap[3]
						thiscube.cubelets[8] = swap[6]
						//S'
						thiscube.cubelets[9] = swap[11]
						thiscube.cubelets[10] = swap[14]
						thiscube.cubelets[11] = swap[17]
						thiscube.cubelets[12] = swap[10]
						thiscube.cubelets[14] = swap[16]
						thiscube.cubelets[15] = swap[9]
						thiscube.cubelets[16] = swap[12]
						thiscube.cubelets[17] = swap[15]
					}
					if (degrees === undefined) degrees = thiscube.front2layer.getDistanceToPeg('z')
					thiscube.front2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.front2layer.cubelets.length - 1) cubelet.rotate('z', degrees, onTwistComplete)
						else cubelet.rotate('z', degrees)
					})
				}
				else if (command === "b" && !thiscube.back.isEngagedX() && !thiscube.back.isEngagedY() && !thiscube.standing.isEngagedX() && !thiscube.standing.isEngagedY()) {

					onTwistComplete = function (swap) {
						//B
						thiscube.cubelets[18] = swap[20]
						thiscube.cubelets[19] = swap[23]
						thiscube.cubelets[20] = swap[26]
						thiscube.cubelets[21] = swap[19]
						thiscube.cubelets[23] = swap[25]
						thiscube.cubelets[24] = swap[18]
						thiscube.cubelets[25] = swap[21]
						thiscube.cubelets[26] = swap[24]

						//S'
						thiscube.cubelets[9] = swap[11]
						thiscube.cubelets[10] = swap[14]
						thiscube.cubelets[11] = swap[17]
						thiscube.cubelets[12] = swap[10]
						thiscube.cubelets[14] = swap[16]
						thiscube.cubelets[15] = swap[9]
						thiscube.cubelets[16] = swap[12]
						thiscube.cubelets[17] = swap[15]
					}
					if (degrees === undefined) degrees = thiscube.back2layer.getDistanceToPeg('z')
					thiscube.back2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.back2layer.cubelets.length - 1) cubelet.rotate('z', degrees, onTwistComplete)
						else cubelet.rotate('z', degrees)
					})
				}
				else if (command === "b'" && !thiscube.back.isEngagedX() && !thiscube.back.isEngagedY() && !thiscube.standing.isEngagedX() && !thiscube.standing.isEngagedY()) {

					onTwistComplete = function (swap) {
						//B'
						thiscube.cubelets[18] = swap[24]
						thiscube.cubelets[19] = swap[21]
						thiscube.cubelets[20] = swap[18]
						thiscube.cubelets[21] = swap[25]
						thiscube.cubelets[23] = swap[19]
						thiscube.cubelets[24] = swap[26]
						thiscube.cubelets[25] = swap[23]
						thiscube.cubelets[26] = swap[20]

						//S
						thiscube.cubelets[9] = swap[15]
						thiscube.cubelets[10] = swap[12]
						thiscube.cubelets[11] = swap[9]
						thiscube.cubelets[12] = swap[16]
						thiscube.cubelets[14] = swap[10]
						thiscube.cubelets[15] = swap[17]
						thiscube.cubelets[16] = swap[14]
						thiscube.cubelets[17] = swap[11]
					}
					if (degrees === undefined) degrees = thiscube.back2layer.getDistanceToPeg('Z')
					thiscube.back2layer.cubelets.forEach(function (cubelet, i) {

						if (i === thiscube.back2layer.cubelets.length - 1) cubelet.rotate('Z', degrees, onTwistComplete)
						else cubelet.rotate('Z', degrees)
					})
				}

			}
		},



		showFaceLabels: function () {
			document.getElementsByClassName('faceLabel').style.display = 'block'
			this.showingFaceLabels = true
		},
		hideFaceLabels: function () {

			document.getElementsByClassName('faceLabel').style.display = 'none'
			this.showingFaceLabels = false
		},


		//
		// Linear：线性匀速运动效果；
		// Quadratic：二次方的缓动（t^2）；
		// Cubic：三次方的缓动（t^3）；
		// Quartic：四次方的缓动（t^4）；
		// Quintic：五次方的缓动（t^5）；
		// Sinusoidal：正弦曲线的缓动（sin(t)）；
		// Exponential：指数曲线的缓动（2^t）；
		// Circular：圆形曲线的缓动（sqrt(1-t^2)）；
		// Elastic：指数衰减的正弦曲线缓动；
		// Back：超过范围的三次方缓动（(s+1)*t^3 – s*t^2）；
		// Bounce：指数衰减的反弹缓动。
		// 每个效果都分三个缓动方式，分别是：
		//
		// easeIn：从0开始加速的缓动，也就是先慢后快；
		// easeOut：减速到0的缓动，也就是先快后慢；
		// easeInOut：前半段从0开始加速，后半段减速到0的缓动。


		/////////////////
		//             //
		//   Presets   //
		//             //
		/////////////////


		presetBling: function () {

			var cube = this

			this.threeObject.position.y = -2000
			new TWEEN.Tween(this.threeObject.position)
				.to({
					y: 0
				}, SECOND * 0.5)
				.easing(TWEEN.Easing.Quartic.Out)
				.start()
			this.threeObject.rotation.set(

				(180).degreesToRadians(),
				(180).degreesToRadians(),
				(20).degreesToRadians()
			)
			new TWEEN.Tween(this.threeObject.rotation)
				.to({

					x: (25).degreesToRadians(),
					y: (-30).degreesToRadians(),
					z: 0

				}, SECOND * 0.5)
				.easing(TWEEN.Easing.Quartic.Out)
				.onComplete(function () {
					cube.isReady = true
				})
				.start()
			this.isReady = false


			//  And we want each Cubelet to begin in an exploded position and tween inward.

			this.cubelets.forEach(function (cubelet) {


				//  We want to start with each Cubelet exploded out away from the Cube center.
				//  We're reusing the x, y, and z we created far up above to handle Cubelet positions.

				var distance = 1000
				cubelet.anchor.position.set(

					cubelet.addressX * distance,
					cubelet.addressY * distance,
					cubelet.addressZ * distance
				)


				//  Let's vary the arrival time of flying Cubelets based on their type.
				//  An nice extra little but of sauce!

				var delay
				if (cubelet.type === 'core') delay = (0).random(100)
				if (cubelet.type === 'center') delay = (100).random(200)
				if (cubelet.type === 'edge') delay = (200).random(400)
				if (cubelet.type === 'corner') delay = (400).random(800)


				new TWEEN.Tween(cubelet.anchor.position)
					.to({

						x: 0,
						y: 0,
						z: 0

					}, SECOND)
					.delay(delay)
					.easing(TWEEN.Easing.Quartic.Out)
					.onComplete(function () {

						cubelet.isTweening = false
					})
					.start()

				cubelet.isTweening = true
			})

		},

		//  Shuffle methods.

		PRESERVE_LOGO: 'RrLlUuDdSBb',            //  Preserve the logo position and rotation.
		ALL_SLICES: 'RrMmLlUuEeDdFfSsBb',      //  Allow all slices to rotate.
		EVERYTHING: 'XxRrMmLlYyUuEeDdZzFfSsBb',//  Allow all slices, and also full cube X, Y, and Z rotations.


		//  The cube does its own loopage.
		//  It attempts to execute twists in the twistQueue
		//  and then tasks in the taskQueue.
		//  This is how shuffling and solving are handled.

		loop: function () {
			var cube = this
			if (cube.isRotating) {
				cube.threeObject.rotation.x += cube.rotationDeltaX.degreesToRadians()
				cube.threeObject.rotation.y += cube.rotationDeltaY.degreesToRadians()
				cube.threeObject.rotation.z += cube.rotationDeltaZ.degreesToRadians()
			}
			if (cube.isReady && !cube.isTweening()) {
				if (cube.twistQueue.isReady) {
					//  We have zero twists in the queue
					//  so perhaps we'd like to add some?

					if (cube.twistQueue.future.length === 0) {



						//  If the Cube ought to be shuffling then
						//  add a random command to the twist queue.

						if (cube.isShuffling) {
							cube.twistQueue.add(cube.shuffleMethod[cube.shuffleMethod.length.rand()])
						}

						//  If the cube ought to be solving and a solver exists
						//  and we're not shuffling, tweening, etc.

						else if (cube.isSolving && window.solver) {

							cube.isSolving = window.solver.consider(cube)
						}

						//  If we are doing absolutely nothing else
						//  then we can can try executing a task.

						else if (cube.taskQueue.isReady === true) {

							var task = cube.taskQueue.do()
							if (task instanceof Function) task()
						}
					}

					//  Otherwise, we have some twists in the queue
					//  and we should put everything else aside and tend to those.

					else {
						cube.twist(cube.twistQueue.do())
					}


				}// cube.twistQueue.isReady
			}
			else if (cube.isTweening) {
				null
			}


		},// loop: function()

		init: function () {
			let cube = this
			cube.isShuffling = false
			cube.twistQueue.future = []
			cube.twistDuration = 50


			if (cube.isSolved() === false) {
				let twistHistoryLength = cube.twistQueue.history.length
				while (twistHistoryLength--) {

					//  OMFG cube is dirty. but solves a subtle logical flaw.
					//  Can’t use cube.undo() here because undo() would be
					//  adding to the taskQueue AFTER shit below is being
					//  added to the taskQueue.
					//  That means it would set .future = [] BEFORE we actually call undo()!!!
					//cube.taskQueue.add( function(){ cube.undo() })

					var wasOk = false

					cube.taskQueue.add(function () {

						if (cube.twistQueue.history.length) {
							var move = cube.twistQueue.history.pop()
							cube.twistQueue.future = []//  We might have shit queued up.
							if (move.command != undefined && move.command != '') {
								cube.twistQueue.add(move.getInverse())
							}
							wasOk = true
						}

					},
						function () {
							if (wasOk) cube.twistQueue.history.pop()
						})
				}
			}

			//  Finally, make sure to reset the twistDuration,
			//  and make damn sure the queues are empty!

			cube.taskQueue.add(function () {

				cube.twistDuration = SECOND / 5
				cube.twistQueue.history = []
				// cube.historyQueue.history = []// WTF is this?!?!? Seems redundant and black magic!
			})
		}

	})
)


export default Cube



