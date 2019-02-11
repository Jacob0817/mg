/*


	TWISTS

	Why have twist validation code in multiple places when we can create a
	Twist class here for all?


*/





import Direction from './directions'

let isNumeric = function( n ){

	return !isNaN( parseFloat( n )) && isFinite( n )
}

function Twist( command, degrees ){


	//  What group of Cubelets do we intend to twist?

	var group = {

		X: 'Cube on X',
		L: 'Left face',
		M: 'Middle slice',
		R: 'Right face',
		l: 'middle slice and left face',
		r: 'middle slice and right face',


		Y: 'Cube on Y',
		U: 'Up face',
		E: 'Equator slice',
		D: 'Down face',
		u: 'equator slice and up face',
		d: 'equator slice and down face',


		Z: 'Cube on Z',
		F: 'Front face',
		S: 'Standing slice',
		B: 'Back face',
		f: 'standing slice and front face',
		b: 'standing slice and front face',

	// }[ command.toUpperCase() ]
	}[ command[0]]

	// console.log(group)
	//  If we've received a valid twist group to operate on
	//  then we can proceed. Otherwise return false!

	if( group !== undefined ){


		//  If our degrees of rotation are negative
		//  then we need to invert the twist direction
		// (ie. change clockwise to anticlockwise)
		//  and take the absolute value of the degrees.
		//  Remember, it's ok to have degrees === undefined
		//  which will peg to the nearest degrees % 90 === 0.

		if( degrees != undefined && degrees < 0 ){

			// command = command.invert()
			if(command === command[0]){
				command = command + "'"
			}
			else{
				command = command[0]
			}
			degrees = degrees.absolute()
		}


		//  Now let's note the absolute direction of the rotation
		//  as both a number and in English.

		var
		vector =  0,
		wise   = 'unwise'

		if( command === command[0] ){

			vector =  1 
			wise   = 'clockwise'
		}
		else if( command === command[0] + "'" ){

			vector = -1
			wise   = 'anticlockwise'
		}


		//  Finally we're ready to package up all the relevant information
		//  about this particular twist.
		//  The constructor will return it of course.

		this.command = command //  Twist command
		this.group   = group   //  Description in English
		this.degrees = degrees //  Relative degrees (undefined is ok!)
		this.vector  = vector  //  Absolute degree polarity
		this.wise    = wise    //  Absolute clock direction in English
		this.created = Date.now()
	

		//  Best to leave this as a function rather than a property.
		//  I mean... imagine call this constructor if it tried to call itself!
		//  Infinite loopage mess.

		this.getInverse = function(){

			// command = command.invert()
			if(command === command[0]){
				command = command + "'"
			}
			else if(command != ''){
				command = command[0]
			}
			return new Twist( command, degrees )
		}
	}
	else return false
}

Twist.validate = function(){

	var 
	elements = Array.prototype.slice.call( arguments ),
	element, i,
	pattern, matches, match, m, head, foot
	// console.log(elements)
	for( i = 0; i < elements.length; i ++ ){
		// console.log('i=',i)
		element = elements[ i ]
		// console.log('ele=',element)
		if( i + 1 < elements.length ) var lookAhead = elements[ i + 1 ]
		else lookAhead = undefined
		// console.log('lookahead=',lookAhead)
	

		if( element instanceof Twist ){


			//  Example usage:
			//  cube.twistQueue.add( new Twist( 'U' ))
			//  cube.twistQueue.add( new Twist( 'U', -17 ))
			//  AWESOME. Nothing to do here.
		}
		else if( typeof element === 'string' ){

			if( element.length === 1 ){


				//  Example usage: 
				//  cube.twistQueue.add( 'U' )
				//  cube.twistQueue.add( 'U', 45 )

				if( typeof lookAhead === 'number' ){
					if(lookAhead === 2) elements[ i ] = new Twist( element, 180 )
					else elements[ i ] = new Twist( element, lookAhead )
				}
				else elements[ i ] = new Twist( element )

				// console.log('ele_111',elements)

			}
			else if( element.length > 1 ){
				if(element.length === 2 && element.indexOf("'")!=-1){
					if( typeof lookAhead === 'number' ){
						if(lookAhead === 2) elements[ i ] = new Twist( element, 180 )
						else elements[ i ] = new Twist( element, lookAhead )
					}
					else elements[ i ] = new Twist( element )
				}
				else{

					//  Example usage:
					//  cube.twistQueue.add( 'UdrLf' )
					//  cube.twistQueue.add( 'Udr10Lf-30b' )

					pattern = /(-?\d+|[XLMRPYUEDZFSB]('?))/gi    //稍微修改了一下，可以识别 u 和 u'  [XLMRPYUEDZFSB]变为[XLMRPYUEDZFSB]('?)
					matches = element.match( pattern )
					for( m = 0; m < matches.length; m ++ ){

						match = matches[ m ]
						// console.log('match=',match)
						if( isNumeric( match )) matches[ m ] = +match
						else {

							head    = matches.slice( 0, m )
							foot    = matches.slice( m + 1 )
							match   = match.split( "'?" )
							matches = head.concat( match, foot )
							// console.log('match=',match,'head=',head,'foot=',foot)
							// console.log('matches-step=',matches)
						}
					}
					// console.log('matchesafter=',matches)
					head = elements.slice( 0, i )
					foot = elements.slice( i + 1 )
					elements = head.concat( matches, foot )
					// console.log('ele_hf',elements)
					i --//  Send it through the loop again to avoid duplicating logic.
				}


			}
		}
		else if( element instanceof Direction ){


			//  Example usage: 
			//  cube.twistQueue.add( FRONT )

			elements[ i ] = element.initial
			i --//  Send it through the loop again to avoid duplicating logic.
		}
		else if( element instanceof Array ){


			//  Example usage: 
			//  cube.twistQueue.add([ ? ])

			head = elements.slice( 0, i )
			foot = elements.slice( i + 1 )				
			elements = head.concat( element, foot )
			i --//  Send it through the loop again to avoid duplicating logic.
		}
		else {


			//  Whatever this element is, we don't recognize it.
			//  (Could be a Number that we're discarding on purpose.)

			elements.splice( i, 1 )
			i --//  Send it through the loop again to avoid duplicating logic.
		}
	}
	// console.log(elements)
	return elements
}

export default Twist


