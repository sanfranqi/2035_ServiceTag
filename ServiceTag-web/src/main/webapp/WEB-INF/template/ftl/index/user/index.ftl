<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '我的服务号'></@inc.header>

<@inc.body 'page-open page-service'>

    <div class="content">
    	<div class="content-in">
    		<!-- 右侧内容 开始 -->
    		<div class="main" id="J_Main">
    			<div class="service-box service-box-ex2">
    				<h2 class="tit">我的服务号</h2>
    				<a href="javascript:;" class="comm-btn btn-l btn-service fr" id="J_Add">申请服务号</a>
    			</div>
    			<div class="top-box">
    			    <form id="J_Form">
                        <div class="form-group fr">
                            <a href="javascript:;" class="btn-search2" id="J_Search"></a>
                        </div>
                        <div class="form-group fr">
                            <label class="control-label">关键字：</label>
                            <div class="type-box">
                                <input type="text" class="form-control form-control-w15" name="serviceTagName" placeholder="请输入关键字">
                            </div>
                        </div>
                        <div class="form-group fr">
                            <label class="control-label">状态：</label>
                            <div class="type-box">
                                <select class="form-control form-control-w1" name="status">
                                    <option value="null" selected="selected">全部</option>
                                    <option value="10">启用</option>
                                    <option value="11">停用</option>
                                    <option value="12">未审核</option>
                                    <option value="13">未通过</option>
                                </select>
                            </div>
                        </div>
    				</form>
    			</div>
    			<div class="pn" id="J_List"></div>
    		</div>
    		<!-- 右侧内容 结束 -->
    	</div>
    </div>

</@inc.body>

<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/index/user/main.js');
    </script>
</@inc.footer>