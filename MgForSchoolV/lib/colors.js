/*


	COLORS

	Here's a little bootstrapping to create our global Color constants.
	At first it seemed like overkill, but then as the solvers and inspectors
	moved forward having these objects available became highly desirable.
	Sure, ES5 doesn't really have constants but the all-caps alerts you
	to the fact that them thar variables ought not to be messed with.


*/












function Color( name, initial, hex, styleF, styleB ){

	this.name    = name
	this.initial = initial
	this.hex     = hex
	this.styleF  = styleF
	this.styleB  = styleB
}


//  Global constants to describe sticker colors.
let WHITE = new Color(

	'white',
	'W',
	'#FFF',
	'font-weight: bold; color: #888',
	'background-color: #F3F3F3; color: rgba( 0, 0, 0, 0.5 )'
)
let ORANGE = new Color(

	'orange',
	'O',
	'#F60',
	'font-weight: bold; color: #F60',
	'background-color: #F60; color: rgba( 255, 255, 255, 0.9 )'
)
let BLUE = new Color(

	'blue',
	'B',
	'#00D',
	'font-weight: bold; color: #00D',
	'background-color: #00D; color: rgba( 255, 255, 255, 0.9 )'
)
let RED = new Color(

	'red',
	'R',
	'#F00',
	'font-weight: bold; color: #F00',
	'background-color: #F00; color: rgba( 255, 255, 255, 0.9 )'
)
let GREEN = new Color(

	'green',
	'G',
	'#0A0',
	'font-weight: bold; color: #0A0',
	'background-color: #0A0; color: rgba( 255, 255, 255, 0.9 )'
)
let YELLOW = new Color(

	'yellow',
	'Y',
	'#FE0',
	'font-weight: bold; color: #ED0',
	'background-color: #FE0; color: rgba( 0, 0, 0, 0.5 )'
)
let COLORLESS = new Color(

	'NA',
	'X',
	'#DDD',
	'font-weight: bold; color: #ED0',
	'background-color: #FE0; color: rgba( 0, 0, 0, 0.5 )'
	)


let ZGREY = new Color(

	'zgrey',
	'Z',
	'#FFF',
	'font-weight: bold; color: #888',
	'background-color: #F3F3F3; color: rgba( 0, 0, 0, 0.5 )'
)
window.B = BLUE
window.G = GREEN
window.Y = YELLOW
window.W = WHITE
window.R = RED
window.O = ORANGE
window.COLORLESS  = COLORLESS


let SECOND  = 3000      //这里注释  赵晗   修改时间

export  {
	WHITE as W,
	YELLOW as Y,
	GREEN as G,
	BLUE as B,
	RED as R,
	ORANGE as O,
	COLORLESS as COLORLESS,
	SECOND as SECOND
}
