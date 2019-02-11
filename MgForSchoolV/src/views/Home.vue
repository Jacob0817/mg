<template>
  <v-app style="background-color:black">
    
    <!--顶部导航栏-->
    <v-toolbar
            dense
            app
            dark
            color="purple"
    >
      <v-btn
        icon
        @click="gotomain()"
      >
      <v-icon >home </v-icon>
      </v-btn>
      
          <div v-for="item in items" class="test" :key="item.text">
              <router-link v-if="item.show" :to="item.href">{{item.text}}</router-link>
              <v-icon  style="padding-left:10px;padding-right:10px" v-if="item.arrow">forward</v-icon>
          </div>
      
      <v-spacer/>
      <!--<div style="width: 40px">-->
      <!--连接-->
      <!--</div>-->
     
      <v-btn
              icon
              @click="onClickConnect()"
              :class="bluetoothColor"
      >
        <v-icon v-if="isGiikerConnected">bluetooth_connected</v-icon>
        <v-icon v-else-if="isConnecting">bluetooth_searching</v-icon>
        <v-icon v-else>bluetooth</v-icon>
      </v-btn>

      <v-btn
              icon
              @click="onClickFullscreen()"
      >
        <v-icon v-if="isFullscreen">fullscreen_exit</v-icon>
        <v-icon v-else>fullscreen</v-icon>
      </v-btn>

      <v-btn
              icon
              @click="onClickClosed()"
      >
        <v-icon >close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content v-if="clientData.state != 'login'" class="fill-height">
        <v-layout  align-center justify-center row fill-height>
          <v-flex xs12 fill-height>
            <v-card class="elevation-12 white--text fill-height text-xs-center"  >
                <div class="display-3" style="color:black;padding-top:20%">
                  三阶魔方复原课程
                  <br>
                  <strong class="headline">武汉魔方协会</strong>
                </div>                
                <v-btn @click="sendRequest()" class="request-btn" color="green lighten-1 white--text">{{btnText}}</v-btn>
                 <v-progress-circular
                  :width="3"
                  color="red"
                  indeterminate
                  v-if="requestProgress"
                ></v-progress-circular>
            </v-card>
          </v-flex>
        </v-layout>
    </v-content>

    <v-content v-else style="padding-top:80px">
      <router-view name="classPanel">
      </router-view>

      <v-card v-if="ismain()">
        <v-container
          fluid
          grid-list-lg
        >
          <v-layout row wrap>
            <v-flex xs12 md3 v-for="lesson in lessons" :key="lesson.index">
              <v-card  color="cyan darken-2" class="white--text elevation-22">
                <v-layout>
                  <v-flex xs4>
                    <v-img
                      :src="require(`../assets/cover/class${lesson.index}.png`)"
                      height="125px"
                      contain
                      style="margin-top:50px"
                    ></v-img>
                  </v-flex>
                  <v-flex xs8>
                    <v-card-title primary-title>
                      <div>
                        <div class="display-1" style="color:black">第{{lesson.index}}课：{{lesson.title}}</div>
                                <div v-for="step in lesson.steps" :key="step"  class="headline">{{step}}</div>
                      </div>
                    </v-card-title>
                  </v-flex>
                </v-layout>
                <v-divider light></v-divider>
                
                <v-card-actions class="pa-3">
                  学习难度：
                  <v-rating
                    v-model="lesson.rating"
                    background-color="white"
                    color="yellow accent-4"
                    dense
                    hover
                    size="18"
                    readonly
                  ></v-rating>
                  
                  

                      <v-btn 
                        absolute
                        right
                        @click="gotoclass(lesson.to)"
                      >开始学习</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>

          </v-layout>
        </v-container>
      </v-card>
      
      
    </v-content>
    
  </v-app>
</template>

<script>
import Cube from 'Components/Cube'
import GiikerCube from 'Lib/giiker'
import {mapState} from 'vuex'
import store from '../store'
import axios from 'axios'
// import os from 'os'
const uuidv1 = require('uuid/v1')
// import VueSocketIO from 'vue-socket.io'   //websocket

// import {ipcRenderer} from 'electron'

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

export default {
  name: 'App',
  components: {
    Cube
  },
  store,
  computed:mapState(["isGiikerConnected","phase"]),
  data () {
    return {
      clientData:{
        id : '',
        agent : '',
        time : {
          open : '',
          login : '',
          loged: '',
          logout : '',
        },
        state : '',
        location : '',
      },
      clientLoopTask: '',
      btnText : '登陆',
      requestProgress : false,
      lessons:[
        {
          index:1,
          title:"认识魔方",
          rating:2.0,
          to : '/class1',
          steps:[
            '魔方的历史',
            '魔方的颜色',
            '魔方的结构',
            '测试',
              ],
        },
        {
          index:2,
          title:"小花学习",
          rating:2.0,
          to : '/class2',
          steps:[
            '认识小花',
            '学会找花',
            '学做小花',
            '测试',
              ],
        },
        {
          index:3,
          title:"十字学习",
          rating:3.0,
          to : '/class3',
          steps:[
            '认识十字',
            '学会对齐',
            '学做十字',
            '测试',
              ],
        },
        {
          index:4,
          title:"一层学习",
          rating:3.0,
          to : '/class4',
          steps:[
            '认识一层',
            '学会对齐',
            '学做一层',
            '测试',
              ],
        },{
          index:5,
          title:"两层学习",
          rating:4.0,
          to : '/class5',
          steps:[
            '基本情况',
            '特殊情况',
            '测试',
              ],
        },{
          index:6,
          title:"顶层十字",
          rating:2.0,
          to : '/class6',
          steps:[
            '基本动作',
            '3种情况',
            '测试',
              ],
        },{
          index:7,
          title:"顶面复原",
          rating:3.0,
          to : '/class7',
          steps:[
            '基本情况',
            '特殊情况',
            '测试',
              ],
        },{
          index:8,
          title:"顶面角块",
          rating:3.0,
          to : '/class8',
          steps:[
            '基本情况',
            '特殊情况',
            '测试',
              ],
        },{
          index:9,
          title:"六面复原",
          rating:3.0,
          to : '/class9',
          steps:[
            '基本情况',
            '特殊情况',
            '测试',
              ],
        }
      ],
      items: [
        {
          text: '三阶魔方初级教程',
          arrow: false,
          show : true,
          href: './'
        },
        {
          text: `1`,
          arrow: false,
          show : false,
          href: './',
        }
      ],
      isFullscreen: false,
      isConnecting: false,
      bluetoothColor:'white--text',
    }
  },
  sockets: {
        // state     open --->  request-----> login
        connect: function () {
            console.log('socket connected')
        },
        allowclientlogin: function (id) {
            if(id == this.clientData.id){
              this.clientData.state = 'login'
              this.clientData.time.loged = Number(new Date())
            }
        },
        forceclientquit : function(id){
          if(id == this.clientData.id){
            this.clientData.state = 'open'
            this.btnText = '登陆'
            this.requestProgress = false
            this.clientData.time.logout = Number(new Date())
          }
            
            // ipcRenderer.send('quit', 'close')
        },
        quitall:function () {
            this.clientData.state = 'open'
            this.btnText = '登陆'
            this.requestProgress = false
            this.clientData.time.logout = Number(new Date())
        },
  },
  mounted : function(){
      let that = this
      this.getLocation()
      this.clientData.id = uuidv1()
      this.clientData.agent = navigator.platform
      this.clientData.userAgent = navigator.userAgent
      this.clientData.time.open = Number(new Date())
      this.clientData.state = 'open'
      console.log(this.clientData)
      this.clientLoopTask = setInterval(() => {
        that.$socket.emit('pingping', that.clientData)
      }, 500);
  },
  methods : {
    sendRequest : function(){
      let that = this
      this.btnText = '请求中。。。'
      this.requestProgress = true
      this.clientData.state = 'request'
      this.clientData.time.login = Number(new Date())
      this.clientLoopTask = setInterval(() => {
        that.$socket.emit('pingping', that.clientData)
      }, 500);
      // 不需要 发送请求了，因为直接通过心跳包    pingping发送了已经
      // this.$socket.emit('request',this.clientData)
    },
    ismain : function(){
      // console.log(this.$route.path)
      if(this.$route.path == '/'){
        return true
      }
      else return false
      
    },
    gotomain : function(){
      let buffer = this.items
      buffer[0].arrow = false
      buffer[1].show = false
      this.items = buffer
      this.$router.push({path: './'})
    },
    gotoclass : function(url){
      // add by kirahan
      // big big probrem
      // 这里有一个非常大的坑，调试了5个小时
      // 如果新建了一个default的 router-view,这个时候home。vue的data会赋值一份进入这个router－view
      // 所以这时候改变data的值，只会变化router－view新的data，而不会改变最开始的data
      // 从而导致改动失效
      // 解决方法,在创建router-view的时候一定设置一个name，就可以避免这个显现出现
      let that = this
      let classnumber = Number(url.split('class')[1])
      if(url) that.$router.push({path: url})
      else that.$router.push({path: '/'})
      let buffer = that.items
      buffer[0].arrow = true
      buffer[1].text = `第${classnumber}课${that.lessons[classnumber-1].title}`
      buffer[1].href =  url
      buffer[1].show = true
      // that.$set(that,'items',buffer)
      that.items = buffer
      
    },
    onClickConnect(){
          if (this.isConnecting) {
                return;
          }
          if (this.noSleep) {
              this.noSleep.enable();
          }

          window.zhCube = new GiikerCube()
          this.isConnecting = true
          this.bluetoothColor = 'green--text accent-2';

          window.zhCube.connect().then(()=>{
            this.$store.commit('setGikConed')
            this.bluetoothColor = 'light-blue--text accent-2';
            this.$store.commit('changeGikPhase','scramble')
          }, (error) => {
            this.isConnecting = false;
          })
    },
    onClickFullscreen() {
        if (this.isFullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozExitFullscreen) {
            document.mozExitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
          this.isFullscreen = false;
        } else {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
          }
          this.isFullscreen = true;
        } 
    },
    onClickClosed(){
      // ipcRenderer.send('quit', 'close')
      // this.$socket.emit('forcequit','quit')
      
    },
    getLocation: function () {
        let that = this
        let my_baidu_ak = 'SCiSPy4jqsauAjWR7ZwaHPiG8qAkQDxl'
        let baidu_ip_location_api = `http://api.map.baidu.com/location/ip?ak=${my_baidu_ak}&coor=bd09ll`

        axios.get(baidu_ip_location_api).then(function (response) {
            // console.log(response.data.content.address)
            that.clientData.location = response.data.content.address
        }).catch(function (err) {
            console.log(err)
        })
    },
    },
    
}
</script>

<style >
 body {
 overflow: auto;
}
.request-btn {
  font-size: 28px !important;
  border-radius: 5px;
  height: 40px;
  min-width: 100px;
}
.test a{
  cursor: pointer;
  color: aliceblue;
  text-decoration: none;
  font-size: 24px;
  border: 0px;
}

.test a:hover{
  text-decoration: none;
}
</style>

