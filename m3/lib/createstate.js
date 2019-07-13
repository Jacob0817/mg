/**
 * Created by hanzhao on 18/11/28.
 */

function createstate(fixedlist,isRandom,isRandomRotating,Config){
    function randx(list) {
        var index = Math.floor(Math.random()*list.length)
        return list[index]
    }
    const ROTATE = ['X','Y','Z',"X'","Y'","Z'"]

    var crossScramble = ""
    var solvedScramble = ""
    var rotateScrambel = ""

    if(isRandom){
        var index = randx(fixedlist)
        console.log(index,fixedlist)
        crossScramble = index.cross
        solvedScramble = index.solved
    }else{
        var state = fixedlist.pop()
        crossScramble = state.cross
        solvedScramble = state.solved
    }

    if(isRandomRotating){
        for(var i=0;i<5;i++){
            rotateScrambel += randx(ROTATE)
        }
    }

    var flag = false
    cube1.isRotating = false

    if(Config.display == 'FACE'){
        cube1.showWireframes()
        cube1.hideStickers()
        cube1.centers.showStickers()
        cube1.hasColor(WHITE).showStickers()
        cube1.corners.hideStickers()
        cube1.edges.hasColor(W).setColor(1,'rgba( 255, 255, 255, 0.05 )')
    }else if(Config.display == 'ALL'){
        cube1.showWireframes()
        cube1.showStickers()
        cube1.edges.hasColor(W).resetColor()
    }else if(Config.display == 'Layer'){
        cube1.showWireframes()
        cube1.hideStickers()
        cube1.centers.showStickers()
        cube1.hasColor(WHITE).showStickers()
        cube1.corners.hideStickers()
    }

    if(flag){
        cube1.twistQueue.add(crossScramble)
        if(isRandomRotating) cube1.twistQueue.add(rotateScrambel)
    }
    else if(cube1.isSolved()){
        if(cube1.up.color.name == 'yellow'){
            cube1.twistQueue.add(solvedScramble)
            if(isRandomRotating) cube1.twistQueue.add(rotateScrambel)
        }else{
            cube1.twistDuration = 100
            cube1.twistQueue.add("X'Y'")
            cube1.twistQueue.add(solvedScramble)
            console.log(solvedScramble)
            if(isRandomRotating) cube1.twistQueue.add(rotateScrambel)
        }
    }
    else {
        console.log('not solved')
        $('#cube1').empty()
        $('.container').each(function () {
            var that = this
            var name = this.id
            var erno = 'erno_' + name
            cubelist.push(name)
            console.log('[debug]',erno,this)
            window[erno] = new kiraerno(this,name,function () {
                window[name] = window.cube
            })
            function loop(){
                window[erno].stateFrames ++
                var divwidth = Number($(that).css('width').split('px')[0])
                if(divwidth<=150){
                    window[erno].states.threeobj.camera.fov = 30
                }else if(divwidth<=200){
                    window[erno].states.threeobj.camera.fov = 25
                }else if(divwidth<=300){
                    window[erno].states.threeobj.camera.fov = 30
                }else if(divwidth<=400){
                    window[erno].states.threeobj.camera.fov = 40
                }else if(divwidth<=500){
                    window[erno].states.threeobj.camera.fov = 30
                }else {
                    window[erno].states.threeobj.camera.fov = 30
                }
                var state = window[erno].states[ window[erno].state ]
                if( state instanceof Function ) state()
            }
            setInterval( loop, 16 )
            // loop()
        })
        setTimeout(function () {
            erno_cube1.states.threeobj.controls.noRotate = true
            erno_cube1.states.threeobj.controls.noZoom = true
            cube1.keypressable = false
            cube1.rotationDeltaX = 0
            cube1.isRotating = false
            cube1.twistDuration = 100
            cube1.showWireframes()
            cube1.showStickers()
            setTimeout(function () {
                cube1.twistDuration = 100
                cube1.twistQueue.add("X'Y'")
                cube1.twistQueue.add(solvedScramble)
                if(isRandomRotating) cube1.twistQueue.add(rotateScrambel)
            },2000)
        },2000)

    }
}

export  default  createstate