package com.cyou.fz2035.servicetag.utils.http;


public class HttpRuntimeException extends RuntimeException{
    public HttpRuntimeException(){
        super();
    }

    public HttpRuntimeException(String msg){
        super(msg);
    }

    public HttpRuntimeException(Throwable e){
        super(e);
    }

    public HttpRuntimeException(String msg, Throwable e){
        super(msg,e);
    }

}
