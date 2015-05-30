<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />
<#import '/WEB-INF/template/ftl/inc/sidebar.ftl' as sidebar />

<@inc.header '实时消息'></@inc.header>

<@inc.body 'page-open page-manage-message page-manage-message1'>

    <div class="content content-col">
        <div class="content-in">

            <#-- 左侧导航 开始 -->
            <@sidebar.nav 'messageIndex'></@sidebar.nav>
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
                        <div class="tit fl">实时消息</div>
                        <div class="form-group fr">
                            <a href="javascript:;" class="btn-search2" id="J_Form_Search"></a>
                        </div>
                        <div class="form-group fr">
                            <label class="control-label">时间段：</label>
                            <input type="text" class="form-control form-control-w1" name="startTime" id="J_StartTime">
                            <span>-</span>
                            <input type="text" class="form-control form-control-w1" name="endTime" id="J_EndTime">
                        </div>
                    </form>
                </div>
                <div class="pn pn-message" id="J_List"></div>
            </div>
            <#-- 右侧内容 结束 -->
        </div>
    </div>

</@inc.body>

<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/service/message/index/main.js');
    </script>
</@inc.footer>