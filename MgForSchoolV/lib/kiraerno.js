import * as THREE from 'three'
import C3R from './vendor/CSS3DRenderer'
import TrackballControls from './vendor/TrackballControls'
// 3D vendor part


import Cube from './cubes'
import TWEEN from './vendor/tween.min'

function   kiraerno(domelem,name,presetstate=[],callback,fov=45){
    var that = this
    this.Constant = {
            FIELD_OF_VIEW : fov,
            WIDTH         :  Number(domelem.offsetWidth),
            HEIGHT        : Number(domelem.offsetHeight),
            ASPECT_RATIO  : Number(domelem.offsetWidth) / Number(window.innerWidth),
            NEAR          : 1,
            FAR           : 6000
    },
    this.version = 20181013.001
    this.verbosity = 0.5
    this.renderMode = 'css'
    this.name = name
    this.presetstate = presetstate
    this.state = 'setup'
    this.stateFrames = 0
    this.stateHistory = ['setup']
    this.states = {
        threeobj : {
            scene : new THREE.Scene(),
            camera : new THREE.PerspectiveCamera(that.Constant.FIELD_OF_VIEW,that.Constant.ASPECT_RATIO,that.Constant.NEAR,that.Constant.FAR),
            // projector : new THREE.Projector(),
            renderer : new C3R.CSS3DRenderer(),
            controls : {},
        },
        setup : function () {
            console.log( '\nCuber', that.version )

            window.help = (function(){

                var s = ''
                s += 'This Rubik\'s Cube simulator is run by the "erno" Object.'
                s += '\nType "erno" in this console and hit Enter for a summary.'
                s += '\nHere are some random commands to pique your interest:'
                s += '\n\n  cube.inspect()'
                s += '\n  cube.inspect( true )'
                s += '\n  cube.front'
                s += '\n  cube.front.northWest.inspect()'
                s += '\n  cube.front.northWest.up.color.name'
                s += '\n  cube.standing.setOpacity( 0.5 )'
                s += '\n  cube.corners.setRadius( 90 )'
                s += '\n  cube.hasColors( RED, BLUE ).showIds()'
                s += '\n  cube.solve()'
                s += '\n\nType "help" to view this message again.'
                return s + '\n'

            })()
            // console.log( window.help )

            //  If we have any tasks to complete at setup time
            //  this is the place to do it!
            if( window.setupTasks )	window.setupTasks.forEach( function( task ){ task() })

            //  Set up THREE.js:
            that.states.threeobj.camera.position.z = 1500
            that.states.threeobj.camera.lookAt( that.states.threeobj.scene.position )
            that.states.threeobj.scene.add( that.states.threeobj.camera )

            that.states.threeobj.renderer.domElement.style.position = 'static'
            that.states.threeobj.renderer.domElement.style.top = 0
            that.states.threeobj.renderer.setSize( that.Constant.WIDTH, that.Constant.HEIGHT )
            that.states.threeobj.renderer.originalHeight = that.Constant.HEIGHT



            that.states.threeobj.controls = new TrackballControls( that.states.threeobj.camera, that.states.threeobj.renderer.domElement )
            that.states.threeobj.controls.rotateSpeed = 0.5


            domelem.appendChild( that.states.threeobj.renderer.domElement )
            window.cube = new Cube(presetstate,that)
            callback()
            //  so let's change our state to loop.
            that.changeStateTo('loop')
        },
        loop:function () {
            TWEEN.update()
            if(that.states.threeobj.controls && that.states.threeobj.controls instanceof THREE.TrackballControls ){
                that.states.threeobj.controls.update()
            }
            that.render()
        }
    }

}

kiraerno.prototype.changeStateTo = function(stateNext){
    if(this.state !== stateNext){
        if(this.verbosity >=0.3){
            console.log( '< Exiting  "'+ this.state +'" state at '+ this.stateFrames +' frames.' )
            console.log( '> Entering "'+ stateNext +'" state.' )
        }
        this.stateHistory.push( stateNext )
        this.state = stateNext
        this.stateFrames = 0
    }
    return false
}
kiraerno.prototype.render = function () {
    this.states.threeobj.renderer.render( this.states.threeobj.scene, this.states.threeobj.camera )
}

export default kiraerno      // 这里不能用  function()




