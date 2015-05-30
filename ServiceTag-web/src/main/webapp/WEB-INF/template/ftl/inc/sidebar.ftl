<#macro nav type=''>
    <div class="side">
        <ul class="nav">
            <#if type == "task" || type == "time" || type == "reward" || type == "survey" || type == "article" >
                <li class="nav-item show">
            <#else>
                <li class="nav-item">
            </#if>
                <a href="javascript:;" class="nav-tit"><i class="ico ico-switch"></i>定制服务</a>
                <ul class="sub-nav">
                    <#if type=="task">
                        <li class="sub-nav-item current"><a href="${urlServiceCustomTask}" class="sub-nav-tit">任务管理</a></li>
                    <#else>
                        <li class="sub-nav-item"><a href="${urlServiceCustomTask}" class="sub-nav-tit">任务管理</a></li>
                    </#if>

                    <#if type=="time">
                        <li class="sub-nav-item current"><a href="${urlServiceCustomTime}" class="sub-nav-tit">日程管理</a></li>
                    <#else>
                        <li class="sub-nav-item"><a href="${urlServiceCustomTime}" class="sub-nav-tit">日程管理</a></li>
                    </#if>

                    <#if type=="reward">
                        <li class="sub-nav-item current"><a href="${urlServiceCustomReward}" class="sub-nav-tit">悬赏招募</a></li>
                    <#else>
                        <li class="sub-nav-item"><a href="${urlServiceCustomReward}" class="sub-nav-tit">悬赏招募</a></li>
                    </#if>

                    <#if type=="survey">
                        <li class="sub-nav-item current"><a href="${urlServiceCustomSurvey}" class="sub-nav-tit">问卷平台</a></li>
                    <#else>
                        <li class="sub-nav-item"><a href="${urlServiceCustomSurvey}" class="sub-nav-tit">问卷平台</a></li>
                    </#if>

                    <#if type=="article">
                        <li class="sub-nav-item current"><a href="${urlServiceCustomArticle}" class="sub-nav-tit">图文管理</a></li>
                    <#else>
                        <li class="sub-nav-item"><a href="${urlServiceCustomArticle}" class="sub-nav-tit">图文管理</a></li>
                    </#if>

                </ul>
            </li>

            <#if type=="user">
                <li class="nav-item show">
                    <a href="javascript:;" class="nav-tit"><i class="ico ico-switch"></i>用户管理</a>
                    <ul class="sub-nav" id="J_UserGroup_List"></ul>
                    <a href="javascript:;" class="btn-new" id="J_UserGroup_Create"><i class="ico ico-new"></i>创建分组</a>
                </li>
            <#else>
                <li class="nav-item">
                    <a href="${urlServiceUser}" class="nav-tit"><i class="ico ico-switch"></i>用户管理</a>
                </li>
            </#if>

            <#if type == "messageGroup" || type == "messageIndex" >
                <li class="nav-item show">
            <#else>
                <li class="nav-item">
            </#if>
                <a href="javascript:;" class="nav-tit"><i class="ico ico-switch"></i>消息管理</a>
                <ul class="sub-nav">
                    <#if type=="messageIndex">
                        <li class="sub-nav-item current"><a href="${urlServiceMessageIndex}" class="sub-nav-tit">实时消息</a></li>
                    <#else>
                        <li class="sub-nav-item"><a href="${urlServiceMessageIndex}" class="sub-nav-tit">实时消息</a></li>
                    </#if>

                    <#if type=="messageGroup">
                        <li class="sub-nav-item current"><a href="${urlServiceMessageGroup}" class="sub-nav-tit">群发消息</a></li>
                    <#else>
                        <li class="sub-nav-item"><a href="${urlServiceMessageGroup}" class="sub-nav-tit">群发消息</a></li>
                    </#if>
                </ul>
            </li>

        </ul>
    </div>
</#macro>