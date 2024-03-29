

//  Skip.js
//  
//  Make JavaScript a little warmer, a little fuzzier.
//  
//  Author:  Stewart Smith.
//  Website: http://stewd.io
//  GitHub:  http://github.com/stewdio
//  Twitter: http://twitter.com/stewd_io




//  Copyright (C) 2013, Stewart Smith.
//  
//  Permission is hereby granted, free of charge, to any person obtaining a	
//  copy of this software and associated documentation files (the "Software"), 
//  to deal in the Software without restriction, including without limitation 
//  the rights to use, copy, modify, merge, publish, distribute, sublicense, 
//  and/or sell copies of the Software, and to permit persons to whom
//  the Software is furnished to do so, subject to the following conditions:
//  
//  The above copyright notice and this permission notice shall be included 
//  in all copies or substantial portions of the Software.
//  
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
//  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
//  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
//  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
//  ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
//  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
//  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



	let forceAugment = function( type, name, data ){

		var key
		
		if( typeof name === 'string' && data ){

			type.prototype[ name ] = data
		}
		else if( typeof name === 'object' && !data ){

			for( key in name ) forceAugment( type, key, name[ key ] )
		}
	}
	let augment = function( type, name, data ){

		var key
		
		if( typeof name === 'string' && 
			type.prototype[ name ] === undefined &&
			data ){

			forceAugment( type, name, data )
		}
		else if( typeof name === 'object' && !data ){

			for( key in name ) augment( type, key, name[ key ] )
		}
	}

	let forceLearn = function( student, teacher ){

		for( var p in teacher ){
		
			if( teacher.hasOwnProperty( p )){

				if( teacher[ p ].constructor === Object ) 
					student[ p ] = forceLearn( student[ p ], teacher[ p ])
				else student[ p ] = teacher[ p ]
			}
		}
		return student
	}
	let learn = function( student, teacher ){

		for( var p in teacher ){
		
			if( teacher.hasOwnProperty( p ) && student[ p ] === undefined ){

				if( teacher[ p ].constructor === Object ) 
					student[ p ] = learn( student[ p ], teacher[ p ])
				else student[ p ] = teacher[ p ]
			}
		}
		return student
	}
	
	let cascade = function(){

		var i, args = Array.prototype.slice.call( arguments )

		for( i = 0; i < args.length; i ++ )
			if( args[ i ] !== undefined ) return args[ i ]
		return false
	}
	




	augment( Array, {


		distanceTo : function( target ){

			var i, sum = 0

			if( arguments.length > 0 )
				target = Array.prototype.slice.call( arguments )
			if( this.length === target.length ){

				for( i = 0; i < this.length; i ++ )
					sum += Math.pow( target[i] - this[i], 2 )
				return Math.pow( sum, 0.5 )
			}
			else return null
		},
		first : function(){

			return this[ 0 ]
		},
		last : function(){

			return this[ this.length - 1 ]
		},
		maximum : function(){

			return Math.max.apply( null, this )
		},
		middle : function(){

			return this[ Math.round(( this.length - 1 ) / 2 ) ]
		},
		minimum : function(){

			return Math.min.apply( null, this )
		},
		indexOf : function( obj, fromIndex ){

			var i, j

			if( fromIndex === null )
				fromIndex = 0
			else if( fromIndex < 0 )
				fromIndex = Math.max( 0, this.length + fromIndex )
			for( i = fromIndex, j = this.length; i < j; i++ )
				if( this[i] === obj ) return i
			return -1//  I'd rather return NaN, but this is more standard.
		},
		rand : function(){
			return this[ Math.floor( Math.random() * this.length )]
		},
		random : function(){//  Convenience here. Exactly the same as .rand().

			return this[ Math.floor( Math.random() * this.length )]
		},
	
		shuffle : function(){

			var
			copy = this,
			i = this.length,
			j,
			tempi,
			tempj

			if( i == 0 ) return false
			while( -- i ){

				j = Math.floor( Math.random() * ( i + 1 ))
				tempi = copy[ i ]
				tempj = copy[ j ]
				copy[ i ] = tempj
				copy[ j ] = tempi
			}
			return copy
		},
		toArray : function(){

			return this
		},
		toHtml : function(){

			var i, html = '<ul>'

			for( i = 0; i < this.length; i ++ ){

				if( this[ i ] instanceof Array )
					html += this[ i ].toHtml()
				else
					html += '<li>' + this[ i ] + '</li>'
			}
			html += '</ul>'
			return html
		}


	})

	augment( Number, {


		absolute : function(){

			return Math.abs( this )
		},
		add : function(){

			var sum = this

			Array.prototype.slice.call( arguments ).forEach( function( n ){

				sum += n
			})
			return sum
		},
		arcCosine : function(){

			return Math.acos( this )
		},
		arcSine : function(){

			return Math.asin( this )
		},
		arcTangent : function(){

			return Math.atan( this )
		},
		constrain : function( a, b ){

			var higher, lower, c = this

			b = b || 0
			higher = Math.max( a, b )
			lower  = Math.min( a, b )
			c = Math.min( c, higher )
			c = Math.max( c, lower  )
			return c
		},
		cosine : function(){

			return Math.cos( this )
		},
		degreesToDirection : function(){

			var d = this % 360,

			directions = [ 'N', 'NNE', 'NE', 'NEE', 'E', 'SEE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'SWW', 'W', 'NWW', 'NW', 'NNW', 'N' ]
			return directions[ this.scale( 0, 360, 0, directions.length - 1 ).round() ]
		},
		degreesToRadians : function(){

			return this * Math.PI / 180
		},
		divide : function(){

			var sum = this

			Array.prototype.slice.call( arguments ).forEach( function( n ){

				sum /= n
			})
			return sum
		},
		isBetween : function( a, b ){

			var
			min = Math.min( a, b ),
			max = Math.max( a, b )

			return ( min <= this && this <= max )
		},
		lerp : function( a, b ){

			return a + (b - a ) * this
		},
		log : function( base ){

			return Math.log( this ) / ( base === undefined ? 1 : Math.log( base ))
		},
		log10 : function(){

			// is this more pragmatic? ---> return ( '' + this.round() ).length;
			return Math.log( this ) / Math.LN10
		},
		maximum : function( n ){

			return Math.max( this, n )
		},
		minimum : function( n ){

			return Math.min( this, n )
		},
		modulo : function( n ){

			return (( this % n ) + n ) % n
		},
		multiply : function(){

			var sum = this

			Array.prototype.slice.call( arguments ).forEach( function( n ){

				sum *= n
			})
			return sum
		},
		normalize : function( a, b ){

			if( a == b ) return 1.0
			return ( this - a ) / ( b - a )
		},
		raiseTo : function( exponent ){

			return Math.pow( this, exponent )
		},
		radiansToDegrees : function(){

			return this * 180 / Math.PI
		},
		rand : function( n ){

			var min, max

			if( n !== undefined ){

				min = Math.min( this, n )
				max = Math.max( this, n )
				return min + Math.floor( Math.random() * ( max - min ))
			}
			var ra = Math.floor( Math.random() * this )
			return ra
		},
		random : function( n ){

			var min, max

			if( n !== undefined ){

				min = Math.min( this, n )
				max = Math.max( this, n )
				return min + Math.random() * ( max - min )
			}
			return Math.random() * this
		},
		remainder : function( n ){

			return this % n
		},
		round : function( decimals ){

			var n  = this

			decimals = decimals || 0
			n *= Math.pow( 10, decimals )
			n  = Math.round( n )
			n /= Math.pow( 10, decimals )
			return n
		},
		roundDown : function(){

			return Math.floor( this )
		},
		roundUp : function(){

			return Math.ceil( this )
		},
		scale : function( a0, a1, b0, b1 ){

			var phase = this.normalize( a0, a1 )

			if( b0 == b1 ) return b1
			return b0 + phase * ( b1 - b0 )
		},
		sine : function(){

			return Math.sin( this )
		},
		subtract : function(){

			var sum = this

			Array.prototype.slice.call( arguments ).forEach( function( n ){

				sum -= n
			})
			return sum
		},
		tangent : function(){

			return Math.tan( this )
		},
		toArray : function(){

			return [ this.valueOf() ]
		},
		toNumber : function(){

			return this.valueOf()
		},
		toPaddedString : function( digits, decimals ){

			//  @@
			//  Need to review this later.
			//  Mos def not bullet proof and also doesn't handle decimals.

			var
			i,
			stringed = '' + this,
			padding  = ''

			digits   = digits   || 2
			decimals = decimals || 0
			for( i = stringed.length; i < digits; i ++ )
				padding += '0'
			// so what about decimals? padding to right of decimal?
			return padding + stringed
		},
		toSignedString : function(){

			var stringed = '' + this

			if( this >= 0 ) stringed = '+' + stringed
			return stringed
		},
		toString : function(){

			return ''+ this
		},




		
	})

	augment( String, {


		capitalize : function(){

			return this.charAt( 0 ).toUpperCase() + this.slice( 1 )//.toLowerCase()
		},
		invert: function(){

			var
			s = '',
			i

			for( i = 0; i < this.length; i ++ ){

				if( this.charAt( i ) === this.charAt( i ).toUpperCase()) s += this.charAt( i ).toLowerCase()
				else s += this.charAt( i ).toUpperCase()
			}
			return s
		},
		isEmpty : function(){

			return this.length === 0 ? true : false
		},
		justifyCenter : function( n ){

			var
			thisLeftLength  = Math.round( this.length / 2 ),
			thisRightLength = this.length - thisLeftLength,
			containerLeftLength  = Math.round( n / 2 ),
			containerRightLength = n - containerLeftLength,
			padLeftLength  = containerLeftLength  - thisLeftLength,
			padRightLength = containerRightLength - thisRightLength,
			centered = this

			if( padLeftLength > 0 ){

				while( padLeftLength -- ) centered = ' ' + centered
			}
			else if( padLeftLength < 0 ){

				centered = centered.substr( padLeftLength * -1 )
			}
			if( padRightLength > 0 ){

				while( padRightLength -- ) centered += ' '
			}
			else if( padRightLength < 0 ){

				centered = centered.substr( 0, centered.length + padRightLength )
			}
			return centered
		},
		justifyLeft: function( n ){

			var justified = this

			while( justified.length < n ) justified = justified + ' '
			return justified
		},
		justifyRight: function( n ){

			var justified = this

			while( justified.length < n ) justified = ' ' + justified
			return justified
		},
		multiply : function( n ){

			var i, s = ''

			n = cascade( n, 2 )
			for( i = 0; i < n; i ++ ){
				s += this
			}
			return s
		},
		reverse : function(){

			var i, s = ''

			for( i = 0; i < this.length; i ++ ){
				s = this[ i ] + s
			}
			return s
		},
		size : function(){

			return this.length
		},
		toEntities : function(){

			var i, entities = ''

			for( i = 0; i < this.length; i ++ ){
				entities += '&#' + this.charCodeAt( i ) + ';'
			}
			return entities
		},
		toCamelCase : function(){

			var
			split  = this.split( /\W+|_+/ ),
			joined = split[ 0 ],
			i

			for( i = 1; i < split.length; i ++ )
				joined += split[ i ].capitalize()

			return joined
		},
		directionToDegrees : function(){

			var
			directions = [ 'N', 'NNE', 'NE', 'NEE', 'E', 'SEE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'SWW', 'W', 'NWW', 'NW', 'NNW', 'N' ],
			i = directions.indexOf( this.toUpperCase() )

			return i >= 0 ? i.scale( 0, directions.length - 1, 0, 360 ) : Number.NaN
		},
		toArray : function(){

			return [ this ]
		},
		toNumber : function(){

			return parseFloat( this )
		},
		toString : function(){

			return this
		},
		toUnderscoreCase : function(){

			var underscored = this.replace( /[A-Z]+/g, function( $0 ){

				return '_' + $0
			})

			if( underscored.charAt( 0 ) === '_' ) underscored = underscored.substr( 1 )
			return underscored.toLowerCase()
		},
		toUnicode : function(){

			var i, u, unicode = ''

			for( i = 0; i < this.length; i ++ ){
				u = this.charCodeAt( i ).toString( 16 ).toUpperCase()
				while( u.length < 4 ){
					u = '0' + u
				}
				unicode += '\\u' + u
			}
			return unicode
		}
	})

export {augment,forceAugment,learn,forceLearn}



