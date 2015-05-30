<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '登录'></@inc.header>

<@inc.body 'page-open page-index'>

    <div class="content">
    	<div class="content-in">
    		<div class="login-box">
    			<div class="login-box-in">
    			    <form id="J_Form">
                        <h2 class="tit">登录</h2>
                        <div class="form-group">
                            <input type="text" class="form-control form-control-ex2 form-control-account" name="userName" />
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control form-control-ex2 form-control-password" name="passWord" />
                        </div>
                        <div class="error-box" id="J_UserTip"></div>
                        <div class="detail-box">
                            <div class="form-group form-check">
                                <div class="check-box checked">
                                    <div class="check-in"></div>
                                    <div class="check-txt">记住账号</div>
                                </div>
                            </div>
                            <a href="javascript:;" class="comm-link link-forget" data-role="forget">忘记密码？</a>
                        </div>
                        <a href="javascript:;" class="comm-btn comm-btn-ex2 btn-l btn-login" data-role="login">登录</a>
    				</form>
    			</div>
    		</div>
    	</div>
    </div>

</@inc.body>

<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/sso/login/main.js');
    </script>
</@inc.footer>