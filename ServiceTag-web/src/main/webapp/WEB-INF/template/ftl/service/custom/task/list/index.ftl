<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />
<#import '/WEB-INF/template/ftl/inc/sidebar.ftl' as sidebar />

<@inc.header '任务管理'>
    <script type="text/javascript">
        var singleUrl = '${urlServiceCustomTaskSingle}';
    </script>
</@inc.header>

<@inc.body 'page-open page-manage-task'>

    <div class="content content-col">
        <div class="content-in">

            <#-- 左侧导航 开始 -->
            <@sidebar.nav 'task'></@sidebar.nav>
            <#-- 左侧导航 结束 -->

            <#-- 右侧内容 开始 -->
            <div class="main" id="J_Main">

                <div class="service-box">
                    <div class="pic-box"><img src="${imageURL}/${simpleServiceTagVo.serviceTagImg}?w=56&h=56" alt="" width="56" height="56"></div>
                    <h2 class="tit">${simpleServiceTagVo.serviceTagName}</h2>
                    <a href="${urlUserIndex}" class="comm-btn btn-l btn-service fr">切换服务号</a>
                </div>

                <div class="top-box">
                    <form id="J_Form">
                        <input type="hidden" name="serviceTagId" value="${simpleServiceTagVo.id?c}" />
                        <input type="hidden" name="serviceType" value="100" />
                        <div class="tit fl">任务管理</div>
                        <a href="${urlServiceCustomTaskSingle}" class="comm-btn comm-btn-ex2 btn-new fr">创建任务</a>
                        <div class="form-group fr">
                            <a href="javascript:;" class="btn-search2" id="J_Search"></a>
                        </div>
                        <div class="form-group fr">
                            <label class="control-label">关键字：</label>
                            <div class="type-box">
                                <input type="text" class="form-control form-control-w15" name="serviceName" placeholder="请输入关键字" maxlength="300">
                            </div>
                        </div>
                        <div class="form-group fr">
                            <label class="control-label">状态：</label>
                            <div class="type-box">
                                <select class="form-control form-control-w1" name="status">
                                    <option value="null" selected="selected">全部</option>
                                    <option value="10">未发布</option>
                                    <option value="11">已发布</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="pn" id="J_List"></div>

            </div>
            <#-- 右侧内容 结束 -->
        </div>
    </div>

</@inc.body>

<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/service/custom/task/list/main.js');
    </script>
</@inc.footer>