//中间层，用于向底层抛出需要完成的接口，并完成业务需要的网络功能，最终由最上层注入

//定义接口，不负责实现

// 定义 RequestOptions 接口类型表示上传请求之前的配置参数，在底层用相应的对象进行实现
export interface RequestOptions{
    [key:string]: any; // 任何键值对都可以
    //下面就是请求重试，请求防重，请求缓存的配置
    //请求重试
    RetryRequestor?:{
        use:boolean | false;
        maxTry:number | 5;
        waitTime:number |2000
    };
    //请求防重
    DebounceRequestor?:{
        use:boolean | false;
        wait:number | 60000;
    };
    //请求缓存
    StoreRequestor?:{
        use: boolean | false;
        storage: "localStorage"|"IndexedDB"; // 例如 localStorage 或 IndexedDB
        storageTime: number | 100000
    }

}
//定义Response接口类型表示调用方法后传递的对象，在底层用相应的对象进行实现
export interface Response{
    [key:string]: any; // 任何键值对都可以
}
//定义请求列表接口，表示请求并行以及串行的输入数组，每个元素都由一对url和options组成
export interface requestList{
    url: string;
  options?: RequestOptions;
}
//定义Requester接口对象
export interface Requestor{
    
    
   
    //需要实现GET方法，可以使用可选参数对象RequestOptions对传递进行一些更加细腻的控制，返回一个Promise并且包含一个Response对象
    get(url:string,options?:RequestOptions):Promise<Response>
    //需要实现POST方法，可以使用可选参数对象RequestOptions对传递进行一些更加细腻的控制，返回一个Promise并且包含一个Response对象
    post(url:string, options?:RequestOptions):Promise<Response>

    //实现请求串行
    createSerialRequestor(requestlist:requestList[]):Promise<any>
    //实现请求并行
    createParallelRequestor(requestlist:requestList[]):Promise<any>
    //对于重试以及防重等，应该写进请求中而不是调用方法

}

//定义注入以及使用，需要在上层接收并调用

let req:Requestor;
//定义注入方法，将上层注入的实例在本层使用
export function inject(requestor:Requestor){
    req = requestor;
}
export function useRequestor(){
    return req;
}

//下面就是利用基础方法完成的网络上层控制，比如get，post，请求串行，请求并行，并且将请求防重，请求重试等功能嵌入，可以通过配置来使用
//get请求
export function sendGet(url:string,options?:RequestOptions){
    const req = useRequestor();
    return req.get(url,options);
}
//post请求
export function sendPost(url:string,options?:RequestOptions){
    const req = useRequestor();
    return req.post(url,options);
}
//请求串行
export function createSerialRequestor(res:requestList[]){
    const req = useRequestor();
   
    return req.createSerialRequestor(res);
}
//请求并行
 export function createParallelRequestor(res:requestList[]){
    const req = useRequestor();
   
    return req.createParallelRequestor(res);
}
