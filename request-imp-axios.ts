//最底层，用于实现中间层抛出的接口，并由最上层导入并利用
//使用axios完成底层的实现
//导入中间层的需要实现的接口并且进行实现
import {Requestor,RequestOptions, Response,requestList} from './request-core';
//导入axios以及其标准的发送配置，接受配置，转换为自己的配置
import axios ,{ AxiosRequestConfig, AxiosResponse }from 'axios';
//导入npm的加密包以实现加密
import CryptoJS from "crypto-js";

//创建axios实例
const ins = axios.create();
//创建一个map用来存储hash后的防重数据,键为hash，值为过期时间
const debounceMap = new Map<string,number>();


//创建注入函数，将AxiosRequestConfig对象注入到我们的RequestOptions对象中
function convertAxiosRequestConfig(options?: RequestOptions):AxiosRequestConfig | undefined{
    //没有传递就返回undefined
    
    if(!options){
        return undefined;
    }
    if(options.RetryRequestor?.use === false){
        //设置为空
        options.RetryRequestor = undefined;
    }
    if(options.DebounceRequestor?.use === false){
        //设置为空
        options.DebounceRequestor = undefined;
    }
    

    const config: AxiosRequestConfig = {
        // 这里可以设置一些默认值或者转换值
        //添加取消请求的信号
        //signal: controller.signal,
        ...options,
        // 确保所有必需的 AxiosRequestConfig 属性都被正确设置
        //下面的只是一个例子
        params: {
            ID: 12345
          },
      };
      return config;
    //

}


    // 添加请求拦截器，并在里面处理请求防重，请求缓存等操作
    ins.interceptors.request.use(function (options) {
        // 在发送请求之前做些什么
        // 创建新的 AbortController 实例
        const controller = new AbortController();
        options.signal = controller.signal;  // 将 signal 注入到请求配置中
        //检查options中的属性
        if("RetryRequestor" in options){
            //存在请求重试，需要在发送请求之前以及接收数据的时候都要进行处理
            //发送请求的时候将配置传入，响应的时候根据状态码进行重试
            //由于我们在注入函数中已经配置好了，所以这里不需要进行任何操作，只需要在响应拦截器中进行对应的操作
            
        }
        if("DebounceRequestor" in options ){
            //存在防重函数，只用在发送之前进行处理
            //存在重复，就直接不提交，这里就返回true吧好让我们的缓存函数使用
            //调用防重函数
            //对于结果为true的，我们不进行发送，需要进行请求取消
           
            const ans = createDebounceRequestor(options);
            if(ans === true){
                //取消请求
                //console.log("取消")
                controller.abort();
            }
        }
        if("StoreRequestor" in options){
            //存在缓存函数，需要在发送请求之前以及接收数据的时候都要进行处理
            //首先对于发送的时候，看看本地有没有缓存，有就直接返回缓存，没有就正常发送，然后在接收拦截器的时候将结果进行缓存
            //我们的业务中没有BFF层，所以对于缓存的需求不是很大，所以不进行扩展
        }
        return options;
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      })
      
      // 添加响应拦截器
    ins.interceptors.response.use(function (response) {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        return response;
    }, function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 在这里进行请求重试
        //获取配置
        const config = error.config;
        if( config.RetryRequestor != undefined && config.RetryRequestor.use === true){
            //进行重试逻辑
            //获取重试次数，检查是否存在current不存在就拿取maxTry(第一次)存在就直接拿取current(递归流程内)
            let tryCount = config.RetryRequestor.current === undefined?(config.RetryRequestor.maxTry as number):(config.RetryRequestor.current as number);
            //总的次数
            const base = config.RetryRequestor.maxTry as number;
            //设置指数
            //获取退避时间，这里其实还可以优化使用惰性函数使这个设置只运行一次
            const waitTime = config.RetryRequestor.waitTime as number;
            const index = base;
            //base case
            if(tryCount <= 0){
                return Promise.reject(error);
            }
            // 重试前，先将重试次数减一
            tryCount--;
            return new Promise(resolve =>{
                setTimeout(()=>{
                    //写入当前的重试次数
                    
                    config.RetryRequestor.current = tryCount;
                    console.log(`Retrying${index-tryCount}/${index}`);
                    console.log(config)
                    resolve(ins(config));
                    
                },(Math.pow(waitTime/1000,index-tryCount))*1000)//指数退避
            })
            
        }
        //没有设置重试的请求对于错误直接返回错误
        return Promise.reject(error);
    });


export const requestor: Requestor = {
    get(url,options?) {
        //在这里判断一下options中的RetryRequestor等属性，并进行相应的配置
        const config = convertAxiosRequestConfig(options)
        return ins.get(url, config).then((response: AxiosResponse) => {
            // 转换 AxiosResponse 到 Response 类型
            const res: Response = {
              data:response.data,
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
              config: response.config
            };
            return res;
          });
    },
    // post请求，与get类似
    post(url, options?) {
        //在这里判断一下options中的RetryRequestor等属性，并进行相应的配置
        const config = convertAxiosRequestConfig(options)
        return ins.post(url,config).then((response: AxiosResponse) => {
            // 转换 AxiosResponse 到 Response 类型
            const res: Response = {
              ...response.data,
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
              config: response.config
            };
            return res;
          });
    },
     async createSerialRequestor(requestlist:requestList[]){
        // 请求串行利用axios的实现
        //这里只是进行了一个个的发送，并没有将上一个的输出作为下一个的输入，可以根据业务进行调整
    // 首先，我们需要检查requestList的个数以及格式，假设大于五个我们就直接抛出错误：请求串行个数过多
    if (requestlist.length > 5) {
        throw new Error('请求串行个数过多');
    }

    // 初始化一个结果数组
    const result: any[] = [];

    // 创建一个Promise数组，用于存储每个请求的Promise
    const promises = requestlist.map(item => {
        return this.get(item.url, item.options)
            .then(res => {
                //console.log(res);
                result.push(res);
                return res;
            })
            .catch(err => {
                result.push(err);
                return err;
            });
    });

    // 使用Promise.all等待所有请求完成
    await Promise.all(promises);

    // 返回结果数组
    return Promise.resolve(result);
    },


    createParallelRequestor(requestlist:requestList[]){
        //请求并行利用axios的实现
        //首先还是检查个数，大于五个抛出错误
        if(requestlist.length >5){
            throw new Error('请求并行个数过多');
        }
        //利用Promise.all来并行发送，返回一个Promise
        //没有出现问题应该返回一个按照顺序的promise解析值数组
        //任何一个出现错误，我们都应该终止并且返回第一个拒绝的原因
        //原生的Promise.all就很好的完成了我们的需求
        return Promise.all(requestlist.map(item => this.get(item.url,item.options)))
        //return Promise.resolve(1)
    },
   

};


//这里是防重，重试，缓存的方法
function createDebounceRequestor (options:any) :boolean {
    //console.log("请求取消函数")
    //得到生效时间加上现在的时间戳形成过期时间
        //获取配置中的持续时间
    const duration = options.DebounceRequestor?.wait;
        //获取现在的时间
    const now = Date.now();
        //得到过期时间
    const expires = now + (duration as number);

    //将所有的信息hash
        //调用crypto-js中的加密方法将数据加密为SHA256
        const hash = CryptoJS.SHA256(JSON.stringify(options)).toString();

    //创建一个哈希表，键为hash后的值，值为过期时间戳
        //对比哈希表的键，有就继续对比值
        if(debounceMap.has(hash)){
            //有就检查过期时间
            //console.log("有了")
            if(Date.now() >= (debounceMap.get(hash) as number)){
                //过期，设置新的过期时间
                debounceMap.set(hash, expires);
                return false;
            }
            else{
                //console.log("重复")
                //不进行任何操作(防重)
                return true;
            }
        }
        else{
            //没有就添加到哈希表中
            //console.log("第一次")
            debounceMap.set(hash, expires);
            return false;
        }
        
    
    

}