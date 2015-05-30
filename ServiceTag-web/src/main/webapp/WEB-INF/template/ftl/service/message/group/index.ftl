<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />
<#import '/WEB-INF/template/ftl/inc/sidebar.ftl' as sidebar />

<@inc.header '群发消息'></@inc.header>

<@inc.body 'page-open page-manage-message page-manage-message2'>

    <div class="content content-col">
        <div class="content-in">

            <#-- 左侧导航 开始 -->
            <@sidebar.nav 'messageGroup'></@sidebar.nav>
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
                        <div class="tit fl">群发消息</div>
                        <a href="javascript:;" class="comm-btn comm-btn-ex2 btn-new fr" id="J_Create">创建群发信息</a>
                        <div class="form-group fr">
                            <a href="javascript:;" class="btn-search2" id="J_Form_Search"></a>
                        </div>
                        <div class="form-group fr">
                            <label class="control-label">关键字：</label>
                            <div class="type-box">
                                <input type="text" class="form-control form-control-w15" name="content" placeholder="请输入关键字">
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
        seajs.use('${jsRoot}/app/service/message/group/main.js');
    </script>
</@inc.footer>