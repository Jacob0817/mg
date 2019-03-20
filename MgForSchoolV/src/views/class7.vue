// author kirahan
// 2018.12.25
// ver 0.5.0
// 三阶魔方学习的第7课   顶面

<template>
  <v-container fluid>
    <ClassTimer :command="classTimerCommand" class="classtimer" type="s" size="30px" width="200px"></ClassTimer>
    <v-layout row wrap>
      <v-flex xs12 md5 v-if="cube.show" style="background-color:#1d2935">
        <Cube :cubestate="formulaTest.cubeStateBefore" :cubeid="cube.Cid" :cubesize="cube.Csize" :fov="cube.fov" :showtools="true"/>
      </v-flex>

      <v-flex xs12 md7 style="font-size:30px">
         <v-stepper
          style="border-radius:10px;background-color:#f2f2f2"
          v-model="stepSwithValue"
          vertical
        >
          <v-stepper-step :complete="stepSwithValue > 1" step="1">学习目标
            <v-icon class="text-xs-center" large style="display:contents">volume_up</v-icon>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-card
              color="grey lighten-1"
              style="border-radius:8px;padding:8px"
              class="mb-1"
              height="350px"
            >
            <v-layout row align-center>
                <v-flex xs5>
                        <Cube :cubestate="formulaTest.cubeStateBefore" cubeid="cube2" :cubesize="taskcubesize" fov="35" :showtools="false"/>
                </v-flex>
                <v-flex xs2>
                          <v-icon class="task-arrow red--text lighten-1">arrow_forward</v-icon>
                </v-flex>
                <v-flex xs5>
                          <Cube :cubestate="formulaTest.cubeStateOk" cubeid="cbue3" :cubesize="taskcubesize" fov="35" :showtools="false"/>
                </v-flex>
            </v-layout>
              
            </v-card>
            <v-btn color="primary" small @click="stepSwithValue = 2">下一步</v-btn>
          </v-stepper-content>

          <v-stepper-step color="success" :complete="stepSwithValue > 2" step="2">上左下右的特殊作用</v-stepper-step>

          <v-stepper-content step="2">
            <v-card color="grey lighten-1" class="mb-1" height="350px">
              <p>口诀：(上左下右)(上左下右) </p>
              <v-divider light ></v-divider>
              <div>
                <v-btn @click="cubetwist(`RUR'U'RUR'U'RUR'U'RUR'U'RUR'U'RUR'U'`,false)" class="cube-color-small" color="white lighten-1">
                   上左下右＊6 可以使魔方复原
                </v-btn>
                <br>
                <v-btn @click="cube1show1corner()" class="cube-color-small" color="yellow lighten-1">
                    只看右下角的角块
                </v-btn>
                <v-btn @click="cubetwist(`RUR'U'RUR'U'`,false)" class="cube-color-small" color="red lighten-1">
                    做两次上左下右
                </v-btn>
                <v-btn  class="cube-color-small" color="white lighten-1">
                    右下角原地旋转了一次
                </v-btn>
                <br>
                <v-btn @click="cubetwist(`RUR'U'RUR'U'`,false)" class="cube-color-small" color="red lighten-1">
                    再做2次，又旋转一下
                </v-btn>
                <v-btn @click="cubetwist(`RUR'U'RUR'U'`,false)" class="cube-color-small" color="red lighten-1">
                    再做2次，又旋转一下，回到原来状态
                </v-btn>
                <br>
                <v-btn @click="resetCube1()" class="cube-color-small" color="orange lighten-1">
                    重置
                </v-btn>
                <v-divider light ></v-divider>
                <v-btn class="cube-color-small" color="blue lighten-1">结论：两次“上左下右”可以让右下角角块旋转一次</v-btn>
              </div>
            </v-card>
            <v-btn color="success" small @click="stepSwithValue = 1">上一步</v-btn>
            <v-btn color="success" small @click="gotoStage3()">下一步</v-btn>
          </v-stepper-content>

          <v-stepper-step color="purple lighten-1" :complete="stepSwithValue > 3" step="3">用“上左下右”复原黄面</v-stepper-step>

          <v-stepper-content step="3">
            <v-card color="grey lighten-1" row class="mb-1" height="350px">
              <v-layout justify-center row fill-height>
                <v-flex xs12 text-xs-left>
                  <v-btn color="primary" class="cube-color-small">基本口诀:</v-btn>
                  <v-btn @click="cubetwist(`RUR'U'`,false)" color="warning" class="cube-color-small">上左下右</v-btn>
                  <v-btn @click="cubetwist(`RUR'U'`,false)" color="error" class="cube-color-small">上左下右</v-btn>
                  <br>
                  <v-divider light ></v-divider>
                    <v-btn @click="setCube1toc1()" class="cube-color-small" color="grey lighten-1">
                        情况1:
                    </v-btn>
                    <v-btn @click="cubetwist(`XX`,false)" class="cube-color-small" color="green lighten-1">
                        黄色朝下
                    </v-btn>
                    <v-btn @click="cubetwist(`D`,false)" class="cube-color-small" color="green lighten-1">
                        没复原的角块放置在右下角
                    </v-btn>
                    <v-btn @click="cubetwist(`RUR'U'RUR'U'`,false)" class="cube-color-small" color="blue lighten-1">
                        两次上左下右
                    </v-btn>
                    <br>
                    <v-btn  class="cube-color-small" color="grey lighten-1">
                        完成一个角块，进行下一个
                    </v-btn>
                    <v-btn @click="cubetwist(`D`,false)" class="cube-color-small" color="green lighten-1">
                        没复原的角块放置在右下角
                    </v-btn>
                    <v-btn @click="cubetwist(`RUR'U'RUR'U'`,false)" class="cube-color-small" color="blue lighten-1">
                        两次上左下右
                    </v-btn>
                    <v-btn @click="cubetwist(`RUR'U'RUR'U'`,false)" class="cube-color-small" color="blue lighten-1">
                        没有完成，再来一次
                    </v-btn>
                    <v-btn  class="cube-color-small" color="grey lighten-1">
                        重复这个过程直到黄面全部复原
                    </v-btn>
                  <br>
                    <v-btn @click="setCube1toc2()" class="cube-color-small" color="grey lighten-1">
                        情况2:
                    </v-btn>
                    <v-btn @click="cubetwist(`XX`,false)" class="cube-color-small" color="green lighten-1">
                        黄色朝下
                    </v-btn>
                    <br>
                     <v-btn  class="cube-color-small" color="green lighten-1">
                        没复原的角块放置在右下角
                    </v-btn>
                    <v-btn @click="cubetwist(`RUR'U'RUR'U'`,false)" class="cube-color-small" color="blue lighten-1">
                        做好第一个角块
                    </v-btn>
                    <v-btn @click="cubetwist(`D`,false)"  class="cube-color-small" color="green lighten-1">
                        没复原的角块放置在右下角
                    </v-btn>
                    <v-btn @click="cubetwist(`RUR'U'RUR'U'`,false)" class="cube-color-small" color="blue lighten-1">
                        做好第二个角块
                    </v-btn>
                    <v-btn @click="cubetwist(`D`,false)"  class="cube-color-small" color="green lighten-1">
                        没复原的角块放置在右下角
                    </v-btn>
                    <v-btn @click="cubetwist(`RUR'U'RUR'U'RUR'U'RUR'U'`,false)" class="cube-color-small" color="blue lighten-1">
                        做好第三个角块
                    </v-btn>
                    <v-btn @click="cubetwist(`D`,false)"  class="cube-color-small" color="green lighten-1">
                        没复原的角块放置在右下角
                    </v-btn>
                    <v-btn @click="cubetwist(`RUR'U'RUR'U'RUR'U'RUR'U'`,false)" class="cube-color-small" color="blue lighten-1">
                        做好第四个角块
                    </v-btn>
                    
                </v-flex>

              </v-layout>
            </v-card>
            <v-btn color="purple lighten-1" small @click="stepSwithValue = 2">上一步</v-btn>
          </v-stepper-content>

        </v-stepper>
      </v-flex>
      <div class="alert">
                        <v-alert
                        :value="alertFlag"
                        :type="alertType"
                        transition="scale-transition"
                        >
                        {{alertInfo}}
                        </v-alert>
      </div>
    </v-layout>
  </v-container>
</template>


<script>
import Cube from "Components/Cube"
import ClassTimer from "Components/ClassTimer"
import classStateList from "Lib/states"
  


export default {
  components: {
    Cube,
    ClassTimer,
  },
  data: () => ({
    student: "赵晗",
    alertFlag : false,
    alertInfo : '',
    alertType : 'success',
    cube: {
      Cid: "cube1",
      show: true,
      Csize: {
        width: "600px",
        height: "600px"
      },
      fov: 40
    },
    taskcubesize: {
        width: "250px",
        height: "250px"
    },
  
    stepSwithValue : 1,
    stepcounter : 1,   //用来整体改变按钮颜色的
    classTimerCommand: "waiting",
    formulaTest : {
      bgStyle:'cyan darken-2',
      cubeConfig:{
        Cid: "cubeTest1",
        show: true,
        Csize: {
          width: "400px",
          height: "400px"
        },
        fov: 40,
        movehistory: []
      },
      cubeStyle:{
      },
      cubeStateBefore : classStateList.class7base,
      cubeStateOk : classStateList.class7ok,
      cubeStateSp : classStateList.class7q1,
      cubeRunscript:{},

    }
  }),
  mounted: function() {
    this.classTimerCommand = 'start'
    if (this.$store.state.isGiikerConnected) {
      zhCube.removeEventListener("bindcube");
      zhCube.addEventListener("gikMove", "bindcube", function(d) {
        console.log(d);
        if (d.latestMove.amount == 1) {
          cube1.twistQueue.add(d.latestMove.base);
        } else {
          cube1.twistQueue.add(d.latestMove.base + "'");
        }
      });
    } else console.log("请连接蓝牙");
  },
  methods: {
    // 绑定cube1 和 蓝牙魔方
    addCubeEvent: function() {
      window.zhCube.addEventListener("gikMove", "bindcube", function(d) {
        console.log(d);
        if (d.latestMove.amount == 1) {
          cube1.twistQueue.add(d.latestMove.base);
        } else {
          cube1.twistQueue.add(d.latestMove.base + "'");
        }
      });
    },
    // 格式化时间   计时器
    formatTime: function(duration, type) {
      if (type == "s") {
        let ms = String(duration % 1000);
        let sec = String(Math.floor((duration % (1000 * 60)) / 1000));
        let min = String(Math.floor((duration % (1000 * 60 * 60)) / 1000 / 60));
        let hour = String(
          Math.floor((duration % (1000 * 60 * 60 * 24)) / 1000 / 60 / 60)
        );

        sec = sec + "秒";

        if (min == "0" && hour == "0") min = "";
        else min = min + "分";

        if (hour == "0") hour = "";
        else hour = hour + "小时";
        return hour + min + sec;
      } else if (type == "ms") {
        let ms = String(duration % 1000);
        let sec = String(Math.floor((duration % (1000 * 60)) / 1000));
        let min = String(Math.floor((duration % (1000 * 60 * 60)) / 1000 / 60));
        ms = ms + "秒";
        sec = sec + "点";

        if (min == "0") min = "";
        else min = min + "分";

        return min + sec + ms;
      }
    },
    timerCommandChange: function(command){
      console.log('[command]',command)
      this.formulaTimerCommand = command
    },


    cubetwist:function (params,add=true) {
      cube1.twistDuration = 600;
      cube1.twistQueue.add(params);
      if(add) this.stepcounter++
    },

    iscubeok:function(cubename){
        if(cubename){
        let flag1 = false
        let flag2 = false
        flag1 = cubename.cubeStage.faces.down.white == 9 || cubename.cubeStage.faces.down.yellow == 9
        flag2 = cubename.cubeStage.faces.up.yellow == 9 || cubename.cubeStage.faces.up.white == 9
        if(flag1 && flag2) {
            // if front 2layer same
            let Stage = cubename.cubeStage.layer2sideface.front
            let Keys = Object.keys(Stage)
            if(Keys.length == 1 && Stage[Keys[0]] == 6) {
                // if back 2layer  same
                let Stage = cubename.cubeStage.layer2sideface.back
                let Keys = Object.keys(Stage)
                if(Keys.length == 1 && Stage[Keys[0]] == 6) {
                    // if right 2layer  same
                    let Stage = cubename.cubeStage.layer2sideface.right
                    let Keys = Object.keys(Stage)
                    if(Keys.length == 1 && Stage[Keys[0]] == 6) {
                        return true
                    }else{
                    console.log('2 layer not finish')
                    return false
                    }
                }else{
                console.log('2 layer not finish')
                return false
                }
            }else{
              console.log('first face not finish')
              return false
            }
        }else{
          console.log('黄面没有完成')
          return false
        }
        
      }
    },
    cube1show1corner:function(){
        cube1.hideStickers()
        cube1.hasId(8).showStickers()
    },

    resetCube1 :function(){
      cube1.showStickers()  
      this.formulaTest.cubeStateBefore = classStateList.class7base
      this.stepcounter = 1
      this.cube.show = false
      this.$nextTick(() => {
            this.cube.show = true;//重建组件
        })
    },

    setCube1toc1:function(){
        this.formulaTest.cubeStateBefore = classStateList.class7base
        this.cube.show = false
        this.$nextTick(() => {
                this.cube.show = true;//重建组件
            })
    },

    setCube1toc2:function(){
        this.formulaTest.cubeStateBefore = classStateList.class7q2
        this.cube.show = false
        this.$nextTick(() => {
                this.cube.show = true;//重建组件
            })
    },
    setCube1toc3:function(){
        this.formulaTest.cubeStateBefore = classStateList.class7q3
        this.cube.show = false
        this.$nextTick(() => {
                this.cube.show = true;//重建组件
            })
    },
    setCube1toc4:function(){
        this.formulaTest.cubeStateBefore = classStateList.class7q4
        this.cube.show = false
        this.$nextTick(() => {
                this.cube.show = true;//重建组件
            })
    },

   

  
    // 从stage2 跳转到 stage3
    gotoStage3: function() {
      this.stepSwithValue = 3;
      this.formulaTest.cubeStateBefore = classStateList.class7base
      this.cube.show = false
      this.$nextTick(() => {
            this.cube.show = true;//重建组件
        })
    },

  },
  computed: {
    //实时绑定魔方连接状态
    GiikerConnectstate() {
      return this.$store.state.isGiikerConnected;
    }
  },
  watch: {
    // 根据状态的变化做出响应，从而实现，蓝牙连接完成之后，自动绑定转动事件
    GiikerConnectstate(newstate, oldstate) {
      var that = this;
      // 蓝牙成功连接
      if (newstate) {
        that.addCubeEvent();
        console.log("bind cube1 to zhcube");
      }
    },

  }
};
</script>


<style scoped>
.classtimer {
  position: absolute;
  left: 0%;
  bottom:0%;
}
.cube-color {
  font-size: 28px !important;
  border-radius: 5px;
  height: 40px;
  min-width: 40px;
}
.cube-color-small{
  color: 'black';
  font-size: 20px !important;
  border-radius: 5px;
  height: 35px;
  min-width: 40px;
}
#studyreport strong {
  font-size: 30px;
}
.task-arrow {
  /* position: absolute; */
  /* z-index: 999999; */
  /* right:40%; */
  /* top:30%; */
  font-size: 80px;
}

.alert{
    position: absolute!important;
    left:70%;
    right:10%;
    bottom: 30%;
}
</style>