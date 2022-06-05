<template>
    <div class="login-container" style="background-color: #141a48;margin: 0px;overflow: hidden;">
        <div id="canvascontainer" ref='can'></div>

        <div v-if="notRegister">
            <el-form ref="loginForm" autocomplete="on" :model="loginForm" :rules="loginRules"  class="login-form">
                <el-form-item prop="username">
                    <el-input type="text" v-model="loginForm.username" placeholder="Username" autocomplete="on">
                        <i class="el-icon-user svg-container" slot="prepend"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" placeholder="Password" @keyup.enter.native="handleLogin">
                        <i class="el-icon-lock svg-container" slot="prepend"></i>
                    </el-input>
                </el-form-item>
                <el-button type="primary" @click="handleLogin" long>登录</el-button>
                <el-button type="primary" @click="notRegister = false" class="register">注册</el-button>
            </el-form>
        </div>

        <div v-if="!notRegister">
            <el-form ref="registerForm" autocomplete="on" :model="registerForm" :rules="registerRules"  class="login-form">
                <el-form-item prop="username">
                    <el-input type="text" v-model="registerForm.username" placeholder="Username" autocomplete="on">
                        <i class="el-icon-user svg-container" slot="prepend"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="registerpassword">
                    <el-input type="password" v-model="registerForm.registerpassword" placeholder="Password">
                        <i class="el-icon-lock svg-container" slot="prepend"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="repeatpassword">
                    <el-input type="password" v-model="registerForm.repeatpassword" placeholder="repeat password" @keyup.enter.native="handleRegister">
                        <i class="el-icon-lock svg-container" slot="prepend"></i>
                    </el-input>
                </el-form-item>
                <el-button type="primary" @click="handleRegister" long>注册</el-button>
                <el-button type="primary" @click="notRegister = true" long class="register">返回</el-button>
            </el-form>
        </div>

    </div>
</template>

<script>
// npm i three@0.058 --save
import * as THREE from "three";

function isWscnEmail(str) {
    const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@wz\.com$/i;
    return reg.test(str.trim());
}

export default {
    name: 'login',
    data() {
        const validateEmail = (rule, value, callback) => { // 验证用户名
            // if (!isWscnEmail(value)) {
            //     callback(new Error('请输入正确的合法邮箱'));
            // } else {
            //     callback();
            // }
            callback();
        };
        const validatePass = (rule, value, callback) => { // 验证输入密码
            if (value.length < 6) {
                callback(new Error('密码不能小于6位'));
            } else {
                callback();
            }
        };
        const validateRegisterPass = (rule, value, callback) => { // 验证注册密码
            if (value.length < 6) {
                callback(new Error('密码不能小于6位'));
            } else if (value != this.registerForm.repassword) {
                callback(new Error('输入的密码必须一致'));
            } else {
                callback();
            }
        };
        const validateRepeatPass = (rule, value, callback) => { // 验证注册重复的密码
            if (value != this.registerForm.password) {
                callback(new Error('输入的密码必须一致'));
            } else {
                callback();
            }
        };
        return {
            loginForm: { // 登录表单
                username: 'Admin',
                password: ''
            },
            loginRules: {  // 登录验证规则
                username: [
                    { required: true, trigger: 'blur', validator: validateEmail }
                ],
                password: [
                    { required: true, trigger: 'blur', validator: validatePass }
                ] 
            },
            registerForm: { // 注册表单
                username: '',
                registerpassword: '',
                repeatpassword: ''
            },
            registerRules: { // 注册验证规则，规则名必须和数据名相同，不让会有奇怪的 bug
                username: [
                    { required: true, trigger: 'blur', validator: validateEmail }
                ],
                registerpassword: [
                    { required: true, trigger: 'blur', validator: validateRegisterPass }
                ],
                repeatpassword: [
                    { required: true, trigger: 'blur', validator: validateRepeatPass }
                ],
            },
            loading: false,
            showDialog: false,
            notRegister: true,  // 是否处于登录状态
            timer: null  // 登录有效时间计时器
        }
    },
    mounted () { // 加载动画
        document.getElementsByTagName("body")[0].style.backgroundColor = "#0d1c4d";

        container = document.createElement( 'div' );
        this.$refs.can.appendChild( container );  

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

        scene = new THREE.Scene();

        particles = new Array();

        var PI2 = Math.PI * 2;
        var material = new THREE.ParticleCanvasMaterial( {
            color: 0x0078de,
            program: function ( context ) {
                context.beginPath();
                context.arc( 0, 0, 1, 0, PI2, true );
                context.fill();
            }
        });

        var i = 0;

        for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
            for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
                particle = particles[ i ++ ] = new THREE.Particle( material );
                particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
                particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
                scene.add( particle );
            }
        }

        renderer = new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        //

        window.addEventListener( 'resize', onWindowResize, false );
        animate();
    },

    methods: {
        handleLogin() { // 登录处理
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    // test
                    localStorage.setItem('username', this.loginForm.username);
                    localStorage.setItem('login', "1");
                    this.$message.success('登录成功');
                    this.$router.replace('/'); // 跳转路径
                    this.timer = setTimeout(() => { // 设置计时器 2s 后登录失效
                        var l = localStorage.getItem("login");
                        if (l == null || l != "0") {
                            localStorage.setItem("login", "0");
                            this.$message.info("到时间啦");
                            var evt = document.createEvent('CloseEvent'); // 创建事件
                            evt.initEvent("logout", false, false);  // 初始化事件为 logout
                            document.dispatchEvent(evt);  // 触发事件，Menu 监听
                        }
                    }, 60000);
                    
                    // this.loading = true;
                    // var that = this;
                    // this.$axios.post('http://139.196.225.67:8008/login', this.loginForm).then((res) => {
                    //     console.log(res)
                    //     that.loading = false;
                    //     // localStorage.setItem('username', this.loginForm.username); // 加入本地储存
                    //        localStorage.setItem('login', "1");  // 设置登录状态
                    //     that.$message.success('登录成功');
                    //     that.$router.replace('/'); // 跳转路径
                        // this.timer = setTimeout(() => { // 设置计时器 2s 后登录失效
                        //     var l = localStorage.getItem("login");
                        //     if (l == null || l != "0") {
                        //         localStorage.setItem("login", "0");
                        //         this.$message.info("到时间啦");
                        //         var evt = document.createEvent('CloseEvent'); // 创建事件
                        //         evt.initEvent("logout", false, false);  // 初始化事件为 logout
                        //         document.dispatchEvent(evt);  // 触发事件，Menu 监听
                        //     }
                        // }, 2000);
                    // }).catch(err => {
                    //     this.$message.error(err);
                    //     this.loading = false;
                    // });
                } else {
                    this.$message.error('error submit!!');
                    return false;
                }
            });
        },

        handleRegister() { // 注册处理
            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    var that = this;
                    this.$axios.post('http://139.196.225.67:8008/register', this.registerForm).then((res) => {
                        that.$message.success('注册成功');
                        console.log(res)
                        
                        that.loading = false;
                        // localStorage.setItem('username', this.loginForm.username); // 加入本地储存
                        
                        // that.$router.replace('/');
                        that.notRegister = true; // 回到登录
                    }).catch(err => {
                        this.$message.error(err);
                        this.loading = false;
                    });
                } else {
                    this.$message.error('error submit!!');
                    return false;
                }
            });
        }
    }

    // debug
    // ,watch : {
    //     'registerForm.password'(nv, ov) {
    //         console.log(this.registerForm);
    //     }
    // }
}

    var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;

    var container;
    var camera, scene, renderer;

    var particles, particle, count = 0;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    function init() {
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    //

    function onDocumentMouseMove( event ) { // 鼠标移动时的回调函数

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;

    }

    function onDocumentTouchStart( event ) {
        if ( event.touches.length === 1 ) {
            event.preventDefault();
            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;
        }
    }

    function onDocumentTouchMove( event ) {
        if ( event.touches.length === 1 ) {
            event.preventDefault();
            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;
        }
    }

    //

    function animate() {
        requestAnimationFrame( animate );
        render();
    }

    function render() {
        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;
        camera.lookAt( scene.position );
        var i = 0;
        for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
            for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
                particle = particles[ i++ ];
                particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
                particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 2 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 2;
            }
        }
        renderer.render( scene, camera );
        count += 0.1;
    }
</script>

<style>
/* .login-container {
    height: 100vh;
    background-color: #2d3a4b;
} */

.login-container a{color:#0078de;}

.login-container input {
    position: absolute;
    right: 0;
    background: transparent;
    border: 1px solid #2d8cf0;
    -webkit-appearance: none;
    border-radius: 3px;
    padding: 12px 5px 12px 15px;
    color: #eeeeee;
    height: 47px;
    width: 305px;
}

.login-container .el-input {
    display: table;
    height: 47px;
    width: 100%;
}

/* .login-container input {
    display: inline-block;
    height: 47px;
    width: 85%;
} */

.login-container .svg-container {
    color: #889aa4;
}

.login-container .title {
    font-size: 26px;
    font-weight: 400;
    color: #eeeeee;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
}

.login-container .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 330px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
}

.login-container .el-form-item {
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    width: 330px;
}

.login-container .el-input-group__prepend {
    padding: 0 5px;
}

.login-container .forget-pwd {
    color: #fff;
}

#canvascontainer{
  position: absolute;
  top: 0px;
}

.wz-input-group-prepend{
  background-color: #141a48;
   border: 1px solid #2d8cf0;
   border-right: none;
   color:  #2d8cf0;
}

.tips{
       font-size: 14px;
       color: #fff;
       margin-bottom: 5px;
     }

.login-container button {
    width: 100%;
    height: 36px;
}

.login-container .register {
    margin: 10px 0;
    background-color: rgba(136, 154, 164, 0.4);
    border-color: #889aa4;
}

#app {
    margin: 0;
}

body {
    background-color: #0d1c4d;
}

</style> 