<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '管理服务号'></@inc.header>

<@inc.body 'page-open page-service-admin'>

    <div class="content">
    	<div class="content-in">
    		<div class="main" id="J_Main">
    			<div class="service-box service-box-ex2">
                    <h1 class="tit">管理服务号</h1>
                </div>
                <div class="pn">
                    <div class="comm-tab tab-service">
                        <div class="tab-hd">
                            <ul class="comm-list2" id="J_Tabs">
                                <li class="list-item tab-active" data-isall="true">
                                    <a href="javascript:;" class="con">全部</a>
                                </li>
                                <li class="list-item" data-isall="false">
                                    <a href="javascript:;" class="con">资料审核</a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-bd">
                            <div class="tab-pane tab-active">
                                <div class="top-box">
                                <form id="J_Form">
                                    <div class="form-group fl">
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
                                    <div class="form-group fl">
                                        <label class="control-label">关键字：</label>
                                        <div class="type-box">
                                            <input type="text" class="form-control form-control-w15" name="serviceTagName" placeholder="请输入关键字">
                                        </div>
                                    </div>
                                    <div class="form-group fl">
                                        <a href="javascript:;" class="btn-search2" id="J_Search"></a>
                                    </div>
                                </form>
                                </div>
                                <div class="comm-mod comm-mod-ex2" id="J_List"></div>
                            </div>
                        </div>
                    </div>
                </div>
    		</div>
    	</div>
    </div>

</@inc.body>

<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/index/admin/main.js');
    </script>
</@inc.footer>