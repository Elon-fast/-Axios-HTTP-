//最上层，整理下面两层的关系，并且进行真实的业务发送例如发送验证码，发送笔记，发送点赞信息，利用中间层暴露出来的方法
//为request-core注入requestor的具体实现
import{inject,sendGet,createSerialRequestor, createParallelRequestor,sendPost} from './request-core'
import {requestor} from './request-imp-axios';
//注入
inject(requestor)

//下面是示例测试，建议一个个进行测试

//示例1，发送get请求
/* sendGet('http://127.0.0.1:3000/').then((ans)=>{
    console.log(ans);
}) */
//示例2，发送post请求
/* sendPost('http://127.0.0.1:3000/',{data:{a:'bbbbb'}}).then((ans)=>{
    console.log(ans);
}) */
//示例3，发送get请求一个错误地址并且开启请求重试，假设我们的后端没有对6000端口进行配置
/* sendGet('http://127.0.0.1:6000/', {RetryRequestor:{use:true,maxTry:5,waitTime:2000}}).then((ans)=>{
    console.log(ans);
}).catch((err)=>{
    console.log(err);
}) */
//示例4，使用请求串行提交两个重复请求并且开启请求防重
/* createSerialRequestor([
    { url: 'http://127.0.0.1:3000/', options: {data:'bbbb', DebounceRequestor: {use: true, wait: 5000}}},
    { url: 'http://127.0.0.1:3000/', options: {data:'bbbb', DebounceRequestor: {use: true, wait: 5000}}}
]).then((ans) => {
    console.log(ans);
}) */