/**
 * Created by hanzhao on 18/11/14.
 */
var fixedcubestate = {
    flower : {
        good : [
            {
                cross: "L2R2D2L2R2",
                solved: "R2D'L2B2D'F2"
            }
        ]
        ,

        second : [
            {
                cross: "R'U",
                solved : "F2B2L2RU"
            },
            {
                cross: "LU'",
                solved : "F2B2L'R2U'"
            },
            {
                cross: "L",
                solved : "R2B2F2L'"
            },
            {
                cross: "R'",
                solved : "L2B2F2R"
            },
        ],
        first : [
            {
                cross: "LU'F'U2",
                solved : "L2B2R2FULU2Y'"
            },
            {
                cross: "LU'F'U",
                solved : "L2B2R2FULUY'"
            },
            {
                cross: "LU'F'",
                solved : "L2B2R2FULY'"
            }
        ],
        third : [
            {
                cross: "R'UF'",
                solved : "LLBBRRFUL'Y'"
            }
        ],
        bottom : [

            {
                cross: "F2D2",
                solved : "L2B2R2D2"
            },
            {
                cross: "F2D'",
                solved : "L2B2R2D'"
            },
            {
                cross: "F2",
                solved : "L2B2R2"
            },
        ]
    },
    firstfloor : {

    },
    secondfloor :{
      good : [{
          solved : "U'F'UFURU'R'U'"
            }]
    },
    topcross : {
        good: [{
            solved : "FRUR'U'RUR'U'RUR'U'F'"
        }],
        step1: [{
            solved : "fRUR'U'f'"
        }],
        step2: [{
            solved : "FRUR'U'F'U2"
        }],
        step3: [{
            solved : "FRUR'U'RUR'U'F'UFRUR'U'F'"
        }],

    },
    topedge : {
        good : [{
            solved : "FRUR'U'RUR'U'RUR'U'F'"
        }],
        step1 :[{
            solved : "Y'FRUR'U'RUR'U'RUR'U'F'RU'U'R'U'RU'R'"
        }]
    }
}

window.fixedcubestate = fixedcubestate

export default fixedcubestate